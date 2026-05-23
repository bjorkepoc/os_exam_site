import { useEffect, useMemo, useState } from "react";
import type { ExamSpec } from "../data/examTypes";
import PageCanvas from "./PageCanvas";

export interface ExamAnswerState {
  choices: Record<string, number>;
  fills: Record<string, string>;
  freeResponses: Record<string, string>;
}

function emptyState(): ExamAnswerState {
  return { choices: {}, fills: {}, freeResponses: {} };
}

function storageKey(examId: string): string {
  return `tdt4186_exam_state_${examId}`;
}

function loadState(examId: string): ExamAnswerState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(storageKey(examId));
    return raw ? { ...emptyState(), ...JSON.parse(raw) } : emptyState();
  } catch {
    return emptyState();
  }
}

export default function ExamViewer({ exam }: { exam: ExamSpec }) {
  const [answers, setAnswers] = useState<ExamAnswerState>(() => loadState(exam.id));
  const isExercise = exam.kind === "exercise";

  useEffect(() => {
    setAnswers(loadState(exam.id));
  }, [exam.id]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(exam.id), JSON.stringify(answers));
  }, [answers, exam.id]);

  const stats = useMemo(() => {
    const selectedChoices = Object.keys(answers.choices).length;
    const filledSlots = Object.values(answers.fills).filter(Boolean).length;
    const totalSlots = exam.fillGroups.reduce((sum, group) => sum + group.slots.length, 0);
    return { selectedChoices, filledSlots, totalSlots };
  }, [answers.choices, answers.fills, exam.fillGroups]);

  function setChoice(groupId: string, optionIndex: number) {
    setAnswers((current) => ({
      ...current,
      choices: { ...current.choices, [groupId]: optionIndex },
    }));
  }

  function setFill(slotId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      fills: { ...current.fills, [slotId]: value },
    }));
  }

  function setFreeResponse(responseId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      freeResponses: { ...current.freeResponses, [responseId]: value },
    }));
  }

  function resetExam() {
    setAnswers(emptyState());
    window.localStorage.removeItem(storageKey(exam.id));
  }

  return (
    <main className="exam-layout">
      <aside className="exam-rail">
        <div className="rail-panel">
          <p className="rail-kicker">{exam.sourceLabel}</p>
          <h2>{exam.title}</h2>
          <dl>
            <div>
              <dt>{isExercise ? "Sheet type" : "MCQ"}</dt>
              <dd>{isExercise ? "Exercise" : `${stats.selectedChoices}/${exam.choiceGroups.length}`}</dd>
            </div>
            {!isExercise && (
              <div>
                <dt>Blanks</dt>
                <dd>
                  {stats.filledSlots}/{stats.totalSlots}
                </dd>
              </div>
            )}
            <div>
              <dt>Pages</dt>
              <dd>{exam.pages.length}</dd>
            </div>
          </dl>
          {!isExercise && (
            <button className="reset-button" type="button" onClick={resetExam}>
              Reset exam
            </button>
          )}
          <nav className="page-jump" aria-label="Pages">
            {exam.pages.map((page) => (
              <a key={page.pageNumber} href={`#page-${page.pageNumber}`}>
                {page.pageNumber}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <section className="page-stack" aria-label={`${exam.title} pages`}>
        {exam.pages.map((page) => (
          <PageCanvas
            key={page.pageNumber}
            exam={exam}
            page={page}
            answers={answers}
            onChoice={setChoice}
            onFill={setFill}
            onFreeResponse={setFreeResponse}
          />
        ))}
      </section>
    </main>
  );
}
