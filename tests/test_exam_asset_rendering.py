import importlib.util
import sys
import unittest
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]


def load_asset_builder():
    module_path = ROOT / "scripts" / "build_exam_assets.py"
    spec = importlib.util.spec_from_file_location("build_exam_assets", module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load {module_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class ExamAssetRenderingTest(unittest.TestCase):
    def test_crop_keeps_bottom_body_text_without_including_footer(self):
        builder = load_asset_builder()
        doc = fitz.open()
        page = doc.new_page(width=595, height=842)

        page.insert_text((72, 100), "Main content", fontsize=11)
        page.insert_text((72, 812), "Rotational speed: 15000 RPM", fontsize=11)
        page.insert_text((72, 827), "https://example.test 1/1", fontsize=8)

        blocks = {
            " ".join(str(block[4]).split()): fitz.Rect(block[:4])
            for block in page.get_text("blocks")
        }
        bottom_text = blocks["Rotational speed: 15000 RPM"]
        footer_text = blocks["https://example.test 1/1"]

        crop = builder.page_content_crop(page)

        self.assertGreaterEqual(crop.y1, bottom_text.y1 + 1)
        self.assertLess(crop.y1, footer_text.y0)

    def test_answer_masks_keep_question_text_visible(self):
        builder = load_asset_builder()
        doc = fitz.open()
        page = doc.new_page(width=595, height=842)

        page.insert_text(
            (90, 120),
            "1. What is a process? Answer: It is a program in execution.",
            fontsize=11,
        )
        page.insert_text((90, 160), "2. What is a thread?", fontsize=11)

        masks, continues = builder.answer_mask_rects(page)
        answer_marker = page.search_for("Answer:")[0]
        first_question = page.search_for("What is a process?")[0]
        next_question = page.search_for("2. What is a thread?")[0]

        self.assertFalse(continues)
        self.assertTrue(any(mask.intersects(answer_marker) for mask in masks))
        self.assertFalse(any(mask.intersects(first_question) for mask in masks))
        self.assertFalse(any(mask.intersects(next_question) for mask in masks))


if __name__ == "__main__":
    unittest.main()
