export interface ChoiceFeedbackInput {
  selectedIndex: number;
  correctIndex: number;
  options: string[];
  solution: string;
}

export interface Feedback {
  correct: boolean;
  title: string;
  body: string;
}

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[;:,.()_\-\u2013\u2014\u2192]/g, "");
}

export function evaluateFillAnswer(value: string, accepted: string[]): boolean {
  const normalizedValue = normalizeAnswer(value);
  if (!normalizedValue) return false;
  return accepted.some((answer) => {
    const normalizedAnswer = normalizeAnswer(answer);
    return (
      normalizedValue === normalizedAnswer ||
      normalizedValue.includes(normalizedAnswer) ||
      normalizedAnswer.includes(normalizedValue)
    );
  });
}

export function toggleChoiceSelection(
  choices: Record<string, number>,
  groupId: string,
  optionIndex: number,
): Record<string, number> {
  if (choices[groupId] !== optionIndex) {
    return { ...choices, [groupId]: optionIndex };
  }

  const nextChoices = { ...choices };
  delete nextChoices[groupId];
  return nextChoices;
}

export function buildChoiceFeedback({
  selectedIndex,
  correctIndex,
  options,
  solution,
}: ChoiceFeedbackInput): Feedback {
  const correct = selectedIndex === correctIndex;
  const selected = options[selectedIndex] ?? "the selected option";
  const expected = options[correctIndex] ?? solution;
  const title = correct ? "Correct" : "Incorrect";
  const body = correct
    ? `Correct answer: ${expected}. ${solution} The other options conflict with the solution key for this item.`
    : `Correct answer: ${expected}. ${solution} Your choice, ${selected}, is not the solution-key answer; the other option texts do not match the operating-systems concept tested here.`;

  return { correct, title, body };
}

export function buildFillFeedback(value: string, accepted: string[]): Feedback {
  const correct = evaluateFillAnswer(value, accepted);
  const expected = accepted.join(" / ");
  return {
    correct,
    title: correct ? "Correct" : "Check this one",
    body: correct
      ? `Accepted answer: ${expected}.`
      : `Expected answer: ${expected}. The solution key accepts this wording or an equivalent phrase.`,
  };
}

export function rectStyle(rect: { x: number; y: number; width: number; height: number }, page: { width: number; height: number }) {
  return {
    left: `${(rect.x / page.width) * 100}%`,
    top: `${(rect.y / page.height) * 100}%`,
    width: `${(rect.width / page.width) * 100}%`,
    height: `${(rect.height / page.height) * 100}%`,
  };
}
