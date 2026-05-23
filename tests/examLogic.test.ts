import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildChoiceFeedback,
  evaluateFillAnswer,
  normalizeAnswer,
  toggleChoiceSelection,
} from "../src/lib/examLogic";

test("normalizes answers without punctuation, whitespace, or case sensitivity", () => {
  assert.equal(normalizeAnswer(" Sem_Wait(full); "), "semwaitfull");
  assert.equal(normalizeAnswer("0x0EA"), "0x0ea");
  assert.equal(normalizeAnswer("Virtual runtime"), "virtualruntime");
});

test("evaluates fill answers against multiple accepted spellings", () => {
  assert.equal(
    evaluateFillAnswer("MRU", ["random", "most recently used", "mru"]),
    true,
  );
  assert.equal(evaluateFillAnswer("least recently used", ["FIFO"]), false);
});

test("choice feedback reports selected correctness and explains alternatives", () => {
  const feedback = buildChoiceFeedback({
    selectedIndex: 1,
    correctIndex: 2,
    options: ["Layered kernel", "Hybridkernel", "Microkernel", "Monolithic Kernel"],
    solution: "Microkernel",
  });

  assert.equal(feedback.correct, false);
  assert.match(feedback.title, /Incorrect/);
  assert.match(feedback.body, /Microkernel/);
  assert.match(feedback.body, /other option/);
});

test("clicking the selected option clears that choice", () => {
  assert.deepEqual(toggleChoiceSelection({}, "q1", 2), { q1: 2 });
  assert.deepEqual(toggleChoiceSelection({ q1: 2 }, "q1", 2), {});
  assert.deepEqual(toggleChoiceSelection({ q1: 2 }, "q1", 1), { q1: 1 });
  assert.deepEqual(toggleChoiceSelection({ q1: 2, q2: 0 }, "q1", 2), { q2: 0 });
});
