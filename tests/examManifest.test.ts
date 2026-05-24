import assert from "node:assert/strict";
import { test } from "node:test";

import { getChoiceExplanation } from "../src/data/explanations";
import { exams, exerciseSheets } from "../src/data/generatedExamManifest";

test("generated manifest exposes all four OS exam PDFs", () => {
  assert.deepEqual(
    exams.map((exam) => exam.id),
    ["2025", "2025-resit", "2024", "2024-resit"],
  );
});

test("each exam has rendered pages and interactive controls", () => {
  for (const exam of exams) {
    assert.ok(exam.pages.length >= 10, `${exam.id} should include rendered PDF pages`);
    assert.ok(
      exam.choiceGroups.length >= 15,
      `${exam.id} should expose MCQ radio groups`,
    );
    assert.ok(
      exam.fillGroups.length >= 1,
      `${exam.id} should expose fill or drag/drop controls`,
    );
  }
});

test("choice groups preserve PDF option geometry", () => {
  const first = exams[0].choiceGroups[0];
  assert.equal(first.optionRects.length, 4);
  assert.ok(first.optionRects[0].x > 0);
  assert.ok(first.optionRects[0].y > 0);
  assert.ok(first.correctIndex >= 0);
  assert.ok(first.correctIndex < 4);
});

test("generated manifest exposes available exercise sheets and solutions", () => {
  assert.ok(exerciseSheets.length >= 10);
  assert.deepEqual(
    exerciseSheets.map((sheet) => sheet.id),
    [
      "exercise-1",
      "exercise-1-handout",
      "exercise-1-solution",
      "exercise-2-solution",
      "exercise-3-solution",
      "exercise-4-solution",
      "exercise-5-solution",
      "exercise-6-solution",
      "exercise-7-solution",
      "exercise-8-solution",
    ],
  );

  for (const sheet of exerciseSheets) {
    assert.equal(sheet.kind, "exercise");
    assert.ok(sheet.pages.length >= 1, `${sheet.id} should have rendered pages`);
  }

  const handout = exerciseSheets.find((sheet) => sheet.id === "exercise-1-handout");
  assert.equal(handout?.solutionSheetId, "exercise-1-solution");

  const answerOnlySheets = exerciseSheets.filter(
    (sheet) => sheet.id === "exercise-1" || sheet.id.endsWith("-solution"),
  );
  assert.ok(answerOnlySheets.length >= 9);
  for (const sheet of answerOnlySheets) {
    assert.equal(
      sheet.answersHiddenByDefault,
      true,
      `${sheet.id} should hide answers until revealed`,
    );
    assert.ok(
      sheet.pages.every((page) => page.answerImage && page.answerImage !== page.image),
      `${sheet.id} should expose separate question and answer page images`,
    );
  }
});

test("detailed explanations cover every exam choice option", () => {
  for (const exam of exams) {
    for (const group of exam.choiceGroups) {
      const explanation = getChoiceExplanation(group.id);
      assert.ok(explanation, `${group.id} should have a detailed explanation`);
      assert.ok(
        explanation.correctIndex >= 0 && explanation.correctIndex < group.optionRects.length,
        `${group.id} should point to a valid correct option`,
      );

      for (let optionIndex = 0; optionIndex < group.optionRects.length; optionIndex += 1) {
        assert.ok(
          explanation.optionExplanations[optionIndex]?.length > 20,
          `${group.id} option ${optionIndex} should explain why it is right or wrong`,
        );
      }
    }
  }
});
