#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import shutil
import unicodedata
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
COURSE_ROOT = Path(r"C:\Users\bjork\Desktop\Operativsystemer(OS)")
EXAM_ROOT = COURSE_ROOT / "05_Eksamen"
PUBLIC_EXAMS = ROOT / "public" / "exams"
OUT_MANIFEST = ROOT / "src" / "data" / "generatedExamManifest.ts"


@dataclass(frozen=True)
class ExamSource:
    id: str
    title: str
    pdf: Path
    mcq_answers: list[str]
    fill_answers: dict[int, list[list[str]]]
    free_response: dict[int, list[tuple[str, str, str]]]


@dataclass(frozen=True)
class DocumentSource:
    id: str
    title: str
    pdf: Path


def clean(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "", normalized.lower())


def rect_to_dict(rect: fitz.Rect) -> dict[str, float]:
    return {
        "x": round(rect.x0, 2),
        "y": round(rect.y0, 2),
        "width": round(rect.width, 2),
        "height": round(rect.height, 2),
    }


def page_content_crop(page: fitz.Page) -> fitz.Rect:
    page_rect = page.rect
    candidates: list[fitz.Rect] = []

    for block in page.get_text("blocks"):
        x0, y0, x1, y1, text, *_ = block
        if not str(text).strip():
            continue
        rect = fitz.Rect(x0, y0, x1, y1)
        if rect.y1 < 32 or rect.y0 > page_rect.height - 34:
            continue
        candidates.append(rect)

    for drawing in page.get_drawings():
        rect = drawing.get("rect")
        if rect is None:
            continue
        rect = fitz.Rect(rect)
        is_page_background = (
            rect.width > page_rect.width * 0.82
            and rect.height > page_rect.height * 0.82
        )
        if is_page_background:
            continue
        if rect.y1 < 32 or rect.y0 > page_rect.height - 34:
            continue
        candidates.append(rect)

    if not candidates:
        return fitz.Rect(0, 0, page_rect.width, page_rect.height)

    crop = candidates[0]
    for rect in candidates[1:]:
        crop |= rect

    crop.x0 = max(28, crop.x0 - 14)
    crop.y0 = max(32, crop.y0 - 10)
    crop.x1 = min(page_rect.width - 24, crop.x1 + 14)
    crop.y1 = min(page_rect.height - 34, crop.y1 + 14)
    return crop


def page_has_meaningful_content(page: fitz.Page) -> bool:
    for block in page.get_text("blocks"):
        x0, y0, x1, y1, text, *_ = block
        normalized = re.sub(r"\s+", " ", str(text).strip())
        if not normalized:
            continue
        if y1 < 32 or y0 > page.rect.height - 34:
            continue
        if normalized.startswith("Maximum marks:"):
            continue
        return True
    return False


def shift_rect(rect: fitz.Rect, crop: fitz.Rect) -> fitz.Rect:
    return fitz.Rect(
        rect.x0 - crop.x0,
        rect.y0 - crop.y0,
        rect.x1 - crop.x0,
        rect.y1 - crop.y0,
    )


def dedupe_rects(rects: list[fitz.Rect], tolerance: float = 2.0) -> list[fitz.Rect]:
    out: list[fitz.Rect] = []
    for rect in sorted(rects, key=lambda r: (r.y0, r.x0)):
        cx = (rect.x0 + rect.x1) / 2
        cy = (rect.y0 + rect.y1) / 2
        if any(abs(((r.x0 + r.x1) / 2) - cx) < tolerance and abs(((r.y0 + r.y1) / 2) - cy) < tolerance for r in out):
            continue
        out.append(rect)
    return out


def detect_radio_rects(page: fitz.Page) -> list[fitz.Rect]:
    rects: list[fitz.Rect] = []
    for drawing in page.get_drawings():
        rect = drawing.get("rect")
        if rect is None:
            continue
        if 5 <= rect.width <= 13 and 5 <= rect.height <= 13 and rect.x0 < 120:
            rects.append(fitz.Rect(rect))
    return dedupe_rects(rects, tolerance=1.5)


def detect_blank_rects(page: fitz.Page) -> list[fitz.Rect]:
    rects: list[fitz.Rect] = []
    for drawing in page.get_drawings():
        rect = drawing.get("rect")
        if rect is None:
            continue
        width = rect.width
        height = rect.height
        is_answer_box = 35 <= width <= 260 and 12 <= height <= 45
        if is_answer_box:
            rects.append(fitz.Rect(rect))
    radio_centers = detect_radio_rects(page)
    filtered = []
    for rect in dedupe_rects(rects, tolerance=2.0):
        if any(abs(rect.x0 - r.x0) < 5 and abs(rect.y0 - r.y0) < 5 for r in radio_centers):
            continue
        filtered.append(rect)
    return filtered


def extract_option_texts(page: fitz.Page, group: list[fitz.Rect], next_group_y: float | None) -> list[str]:
    words = page.get_text("words")
    option_texts: list[str] = []
    for idx, rect in enumerate(group):
        y_min = rect.y0 - 4
        if idx < len(group) - 1:
            y_max = group[idx + 1].y0 - 3
        elif next_group_y is not None:
            y_max = min(next_group_y - 16, rect.y0 + 72)
        else:
            y_max = rect.y0 + 72
        collected = []
        for word in words:
            x0, y0, x1, y1, text, *_ = word
            cy = (y0 + y1) / 2
            if x0 >= rect.x1 + 3 and y_min <= cy <= y_max and x0 < page.rect.width - 25:
                collected.append((y0, x0, text))
        text = " ".join(part for _, _, part in sorted(collected, key=lambda item: (round(item[0], 1), item[1])))
        option_texts.append(re.sub(r"\s+", " ", text).strip())
    return option_texts


def match_answer(answer: str, options: list[str]) -> int:
    answer_clean = clean(answer)
    option_cleans = [clean(option) for option in options]
    for idx, option in enumerate(option_cleans):
        if answer_clean and (answer_clean in option or option in answer_clean):
            return idx
    ratios = [SequenceMatcher(None, answer_clean, option).ratio() for option in option_cleans]
    if ratios and max(ratios) >= 0.38:
        return ratios.index(max(ratios))
    return 0


def chunks(items: list[fitz.Rect], size: int) -> list[list[fitz.Rect]]:
    return [items[idx : idx + size] for idx in range(0, len(items) - (len(items) % size), size)]


def add_aliases(answer: str) -> list[str]:
    aliases = {answer}
    lower = answer.lower()
    if "sem wait" in lower or "sem_wait" in lower:
        aliases.add(answer.replace("sem wait", "sem_wait"))
        aliases.add(answer.replace("sem_wait", "sem wait"))
    if "sem post" in lower or "sem_post" in lower:
        aliases.add(answer.replace("sem post", "sem_post"))
        aliases.add(answer.replace("sem_post", "sem post"))
    if answer.startswith("0") and len(answer) > 1:
        aliases.add(answer.lstrip("0"))
    if answer.upper().startswith("0X"):
        aliases.add(answer[2:])
    return sorted(aliases)


EXAMS = [
    ExamSource(
        id="2025",
        title="TDT4186 2025",
        pdf=EXAM_ROOT / "Oppgaver" / "2025_exam.pdf",
        mcq_answers=[
            "Microkernel",
            "A request made by a user program to the operating system kernel",
            "A program in execution",
            "Disk size",
            "fork()",
            "To replace the current process with a new program",
            "A process is a program in execution, while a thread is a subset of a process",
            "Global variables",
            "SJF",
            "Like FIFO",
            "High context-switching overhead",
            "Interactive processes",
            "Memory management unit",
            "It determines the physical addresses of a process during execution",
            "Splitting memory into variable-sized logical units",
            "Best-Fit",
            "1,4",
            "1,3",
            "Page number and offset",
            "14 bits",
            "27",
            "A TLB miss occurs when the page table entry is not found in the TLB",
            "Round-Robin",
            "1024, 10 bits",
            "0,1,2",
            "To signal threads to wake up when a specific condition is true",
            "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
            "Reduces CPU overhead by allowing devices to transfer data directly to memory",
            "By mapping device registers into the memory address space and accessing them with standard memory instructions",
            "SSTF (Shortest Seek Time First)",
            "2,1",
            "13.17",
            "Path, inode, file descriptor",
            "Filename",
            "File descriptor",
            "2",
            "It contains metadata about the file system layout and status",
            "Using a bitmap where each bit represents a block's availability",
        ],
        fill_answers={
            16: [["fork()"], ["wait()"], ["exec()"], ["D"]],
            17: [["fairness"], ["Virtual runtime"], ["red-black tree"], ["P1"], ["10"]],
            18: [["1FF"], ["0F5"], ["0DB"], ["EEF"], ["12345EEF", "0x12345EEF"]],
            19: [["10"], ["1"], ["0"], ["sem_wait(full)", "sem wait(full)"], ["sem_post(empty)", "sem post(empty)"], ["sem_post(service)", "sem post(service)"]],
        },
        free_response={
            20: [
                (
                    "I/O devices",
                    "What are the two methods to check the status of an I/O device, and which should a slow printer use?",
                    "Polling repeatedly checks the device status register. Interrupts let the device signal the CPU when work is done. A slow printer should use interrupts because polling wastes CPU time while waiting.",
                )
            ]
        },
    ),
    ExamSource(
        id="2025-resit",
        title="TDT4186 2025 Resit",
        pdf=EXAM_ROOT / "Oppgaver" / "2025_resit_exam.pdf",
        mcq_answers=[
            "Monolithic Kernel",
            "User mode and kernel mode",
            "A program in execution",
            "Running to Blocked",
            "createprocess()",
            "To pause the execution of the parent process until a child process finishes",
            "A process is a program in execution, while a thread is a subset of a process",
            "Stack",
            "SJF",
            "RR",
            "Priority scheduling and RR",
            "When the process exceeds its time quantum in the current queue",
            "An address generated by the CPU that is mapped to a physical address",
            "It allocates fixed memory blocks to processes",
            "Segmentation eliminates all external fragmentation",
            "Worst-Fit",
            "1,4",
            "1,2",
            "The page size can be different for each process",
            "15 bits",
            "36",
            "The TLB stores copies of frequently used page table entries",
            "Least-recently used",
            "1024, 9 bits",
            "Preemption",
            "Condition variables store shared data between threads",
            "1",
            "Reduces CPU overhead by allowing devices to transfer data directly to memory",
            "The I/O device signals the CPU when it has completed its task, suspending the current process if needed",
            "SSTF (Shortest Seek Time First)",
            "Higher read/write speed",
            "12",
            "Superblock",
            "Filename",
            "A small integer used by a process to access an open file or I/O resource",
            "0",
            "It keeps track of free and used disk blocks",
            "1 -> 3 -> 2 -> 4",
        ],
        fill_answers={
            15: [["fork()"], ["exec()"], ["wait()"], ["A"]],
            16: [["priority", "weight"], ["O(1)"], ["P5"], ["larger"], ["12"]],
            17: [["10A"], ["0EA", "OEA"], ["184"], ["E12"], ["5ABCE12", "0x5ABCE12"]],
            18: [["5"], ["0"], ["sem_wait(empty)", "sem wait(empty)"], ["sem_post(mutex)", "sem post(mutex)"], ["sem_post(full)", "sem post(full)"], ["sem_post(service)", "sem post(service)"]],
        },
        free_response={
            19: [
                (
                    "File systems",
                    "Briefly describe how to delete an inode in a file system.",
                    "The OS unlinks the file name and decrements the inode link count. If the count reaches zero, the inode and associated blocks can be reclaimed.",
                )
            ]
        },
    ),
    ExamSource(
        id="2024",
        title="TDT4186 2024",
        pdf=EXAM_ROOT / "Oppgaver" / "2024_exam.pdf",
        mcq_answers=[
            "It consists of a small kernel that provides basic services such as scheduling and inter-process communication",
            "A process can only be in one state at a time",
            "Processes can communicate with each other using something like pipe",
            "Processes run independently and are isolated",
            "Round-Robin with time quantum=5",
            "It aims to provide fair distribution of CPU time among processes using virtual runtime",
            "2",
            "A virtual address is generated by the CPU",
            "1,3,4",
            "3,4",
            "It caches recently used page table entries",
            "12, 10",
            "It provides a mechanism for the producer to wait",
            "To ensure that only one thread can add or remove items",
            "No",
            "Two semaphores",
            "All statements are false",
            "Micro-controller",
            "To bypass the CPU",
            "HDDs are sector-addressable",
            "Cells in an SSD can only be written to a limited number of times",
            "1 and 4",
            "f=3",
            "3, 6, 2, 5, 1",
        ],
        fill_answers={
            10: [["2"], ["Yes"], ["1"], ["Child"]],
            11: [["boost priority", "reset priority"], ["95"], ["3"], ["60"], ["2"], ["120"], ["3"], ["No"]],
            12: [["9", "27"], ["010001100", "10001100"], ["000101100", "101100"], ["111000010"], ["000010101111", "10101111"], ["512GB", "512 GB", "2^39"], ["FIFO"], ["RANDOM", "MRU", "Most recently used"]],
            13: [["4", "4.15"], ["625", "638"], ["2"], ["Erase"], ["program", "write"]],
        },
        free_response={
            11: [
                (
                    "Memory",
                    "Explain segmentation, its problem, and the method used to address it.",
                    "Segmentation divides the address space into variable-sized logical segments, each with base and bound registers. Its main problem is external fragmentation, addressed by compaction.",
                )
            ]
        },
    ),
    ExamSource(
        id="2024-resit",
        title="TDT4186 2024 Resit",
        pdf=EXAM_ROOT / "Oppgaver" / "2024_resit_exam.pdf",
        mcq_answers=[
            "Monolithic kernel OSs have all system services and functionalities in kernel space",
            "fork()",
            "The program counter of a process is used to indicate the next instruction",
            "T1 and T2 share the stack",
            "First come first serve",
            "2,3",
            "1,2,3",
            "Segmentation fault",
            "Least-recently-used",
            "page number",
            "m-n, n",
            "1,3",
            "mutual exclusive",
            "either mutex locks or binary semaphores",
            "2,3",
            "23.5ms",
            "SSDs use flash memory",
            "Two different files can have the same Inode number at the same time",
        ],
        fill_answers={
            9: [["exec()"], ["wait()"], ["1"]],
            10: [["25"], ["12.25", "12.2", "12"], ["13.5"]],
            12: [["11"], ["512", "2^9"], ["2^27"], ["2^38", "256GB", "256 GB"], ["9"]],
            13: [["sem_t empty = M", "empty = M"], ["sem_t full = 0", "full = 0"], ["sem_t mutex = 1", "mutex = 1"], ["sem_wait(empty)", "sem wait(empty)"], ["sem_wait(mutex)", "sem wait(mutex)"], ["sem_post(mutex)", "sem post(mutex)"], ["sem_post(full)", "sem post(full)"], ["sem_wait(full)", "sem wait(full)"], ["sem_wait(mutex)", "sem wait(mutex)"], ["sem_post(mutex)", "sem post(mutex)"], ["sem_post(empty)", "sem post(empty)"]],
            15: [["read"], ["write"], ["read"], ["write"]],
        },
        free_response={
            11: [
                (
                    "Memory",
                    "Explain segmentation and paging, and identify their issues.",
                    "Segmentation divides address spaces into variable-sized logical segments and suffers from external fragmentation. Paging divides virtual and physical memory into fixed-size pages/frames and suffers from internal fragmentation.",
                )
            ],
            14: [
                (
                    "I/O Devices",
                    "Explain polling, interrupts, and a hybrid method.",
                    "Polling repeatedly checks device status and wastes CPU for slow devices. Interrupts let the device signal completion but can add context-switch overhead. A hybrid method polls briefly, then switches to interrupts if the device is not ready.",
                )
            ],
        },
    ),
]


EXERCISE_SHEETS = [
    DocumentSource(
        id="exercise-1",
        title="Exercise 1 Answered Sheet",
        pdf=COURSE_ROOT / "02_Ovinger" / "Oppgaver" / "Exercise_1.pdf",
    ),
    DocumentSource(
        id="exercise-1-handout",
        title="Exercise 1 Handout",
        pdf=COURSE_ROOT
        / "02_Ovinger"
        / "Oppgaver"
        / "Exercise_1_handout"
        / "exercise_1.pdf",
    ),
    *[
        DocumentSource(
            id=f"exercise-{number}-solution",
            title=f"Exercise {number} Solution",
            pdf=COURSE_ROOT
            / "02_Ovinger"
            / "Losninger"
            / f"ex{number:02d}_solution.pdf",
        )
        for number in range(1, 9)
    ],
]


def build_exam(source: ExamSource) -> dict:
    doc = fitz.open(source.pdf)
    target_dir = PUBLIC_EXAMS / source.id
    if target_dir.exists():
        shutil.rmtree(target_dir)
    target_dir.mkdir(parents=True, exist_ok=True)

    pages = []
    choice_groups = []
    fill_groups = []
    question_number = 1

    for page_index, page in enumerate(doc):
        page_number = page_index + 1
        if not page_has_meaningful_content(page):
            continue
        crop = page_content_crop(page)
        image_name = f"page-{page_number:02d}.jpg"
        image_path = target_dir / image_name
        pix = page.get_pixmap(matrix=fitz.Matrix(1.65, 1.65), alpha=False, clip=crop)
        pix.save(image_path, jpg_quality=88)
        pages.append(
            {
                "pageNumber": page_number,
                "image": f"/exams/{source.id}/{image_name}",
                "width": round(crop.width, 2),
                "height": round(crop.height, 2),
            }
        )

        radio_rects = detect_radio_rects(page)
        radio_groups = chunks(radio_rects, 4)
        for group_index, group in enumerate(radio_groups):
            if question_number > len(source.mcq_answers):
                break
            next_group_y = radio_groups[group_index + 1][0].y0 if group_index + 1 < len(radio_groups) else None
            option_texts = extract_option_texts(page, group, next_group_y)
            answer = source.mcq_answers[question_number - 1]
            correct_index = match_answer(answer, option_texts)
            choice_groups.append(
                {
                    "id": f"{source.id}-q{question_number:02d}",
                    "number": question_number,
                    "pageNumber": page_number,
                    "optionRects": [
                        rect_to_dict(shift_rect(rect + (-3, -3, 22, 3), crop))
                        for rect in group
                    ],
                    "optionTexts": option_texts,
                    "correctIndex": correct_index,
                    "correctAnswer": answer,
                    "solution": f"The solution key marks this as: {answer}.",
                }
            )
            question_number += 1

        if page_number in source.fill_answers:
            blank_rects = detect_blank_rects(page)
            answers = source.fill_answers[page_number]
            slots = []
            for slot_index, accepted in enumerate(answers):
                if slot_index < len(blank_rects):
                    rect = blank_rects[slot_index]
                else:
                    rect = fitz.Rect(70, 160 + slot_index * 34, 230, 184 + slot_index * 34)
                all_accepted = sorted({alias for answer in accepted for alias in add_aliases(answer)})
                slots.append(
                    {
                        "rect": rect_to_dict(shift_rect(rect, crop)),
                        "accepted": all_accepted,
                        "label": f"Blank {slot_index + 1}",
                    }
                )
            chips = []
            for accepted in answers:
                chips.append(accepted[0])
            chips.extend(["fork()", "wait()", "exec()", "read", "write", "0", "1"])
            seen = set()
            unique_chips = []
            for chip in chips:
                key = clean(chip)
                if key and key not in seen:
                    seen.add(key)
                    unique_chips.append(chip)
            fill_groups.append(
                {
                    "id": f"{source.id}-page-{page_number:02d}-fills",
                    "pageNumber": page_number,
                    "title": f"Page {page_number} blanks",
                    "mode": "drag-drop",
                    "slots": slots,
                    "chips": unique_chips[:18],
                    "explanation": "These blanks use the official solution key. Equivalent wording is accepted where the solution PDF allows it.",
                }
            )

    free_response = []
    for page_number, items in source.free_response.items():
        for index, (title, prompt, solution) in enumerate(items, start=1):
            free_response.append(
                {
                    "id": f"{source.id}-free-{page_number}-{index}",
                    "pageNumber": page_number,
                    "title": title,
                    "prompt": prompt,
                    "solution": solution,
                }
            )

    return {
        "id": source.id,
        "title": source.title,
        "kind": "exam",
        "sourceLabel": source.pdf.name,
        "pages": pages,
        "choiceGroups": choice_groups,
        "fillGroups": fill_groups,
        "freeResponse": free_response,
    }


def build_document_sheet(source: DocumentSource) -> dict:
    doc = fitz.open(source.pdf)
    target_dir = PUBLIC_EXAMS / source.id
    if target_dir.exists():
        shutil.rmtree(target_dir)
    target_dir.mkdir(parents=True, exist_ok=True)

    pages = []
    for page_index, page in enumerate(doc):
        page_number = page_index + 1
        if not page_has_meaningful_content(page):
            continue
        crop = page_content_crop(page)
        image_name = f"page-{page_number:02d}.jpg"
        image_path = target_dir / image_name
        pix = page.get_pixmap(matrix=fitz.Matrix(1.65, 1.65), alpha=False, clip=crop)
        pix.save(image_path, jpg_quality=88)
        pages.append(
            {
                "pageNumber": page_number,
                "image": f"/exams/{source.id}/{image_name}",
                "width": round(crop.width, 2),
                "height": round(crop.height, 2),
            }
        )

    return {
        "id": source.id,
        "title": source.title,
        "kind": "exercise",
        "sourceLabel": source.pdf.name,
        "pages": pages,
        "choiceGroups": [],
        "fillGroups": [],
        "freeResponse": [],
    }


def main() -> None:
    PUBLIC_EXAMS.mkdir(parents=True, exist_ok=True)
    exams = [build_exam(source) for source in EXAMS]
    exercise_sheets = [build_document_sheet(source) for source in EXERCISE_SHEETS]
    manifest = (
        "import type { ExamSpec } from './examTypes';\n\n"
        f"export const exams = {json.dumps(exams, ensure_ascii=False, indent=2)} satisfies ExamSpec[];\n"
        f"\nexport const exerciseSheets = {json.dumps(exercise_sheets, ensure_ascii=False, indent=2)} satisfies ExamSpec[];\n"
    )
    OUT_MANIFEST.write_text(manifest, encoding="utf-8")
    print(f"Wrote {OUT_MANIFEST}")
    print(f"Rendered assets under {PUBLIC_EXAMS}")


if __name__ == "__main__":
    main()
