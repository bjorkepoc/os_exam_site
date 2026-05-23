import explanations2024 from "./2024";
import explanations2024Resit from "./2024-resit";
import explanations2025 from "./2025";
import explanations2025Resit from "./2025-resit";

export interface NormalizedChoiceExplanation {
  correctIndex: number;
  optionExplanations: Record<number, string>;
  uncertainty?: string;
}

type SimpleExplanation = {
  correctIndex: number;
  correct: string;
  wrong: Record<number, string> | Partial<Record<0 | 1 | 2 | 3, string>>;
  uncertainty?: string;
};

type OptionExplanation = {
  explanation: string;
  isCorrect: boolean;
};

type OptionListExplanation = {
  correctIndex: number;
  options: OptionExplanation[];
  uncertainty?: string;
};

type RawExplanation = SimpleExplanation | OptionListExplanation;

const rawExplanations: Record<string, RawExplanation> = {
  ...explanations2025,
  ...explanations2025Resit,
  ...explanations2024,
  ...explanations2024Resit,
};

function isOptionListExplanation(value: RawExplanation): value is OptionListExplanation {
  return "options" in value;
}

function normalizeExplanation(value: RawExplanation): NormalizedChoiceExplanation {
  if (isOptionListExplanation(value)) {
    return {
      correctIndex: value.correctIndex,
      optionExplanations: Object.fromEntries(
        value.options.map((option, index) => [index, option.explanation]),
      ),
      uncertainty: value.uncertainty,
    };
  }

  const optionExplanations: Record<number, string> = {};
  for (const [optionIndex, explanation] of Object.entries(value.wrong)) {
    if (explanation) {
      optionExplanations[Number(optionIndex)] = explanation;
    }
  }
  optionExplanations[value.correctIndex] = value.correct;

  return {
    correctIndex: value.correctIndex,
    optionExplanations,
    uncertainty: value.uncertainty,
  };
}

export const choiceExplanations: Record<string, NormalizedChoiceExplanation> =
  Object.fromEntries(
    Object.entries(rawExplanations).map(([groupId, explanation]) => [
      groupId,
      normalizeExplanation(explanation),
    ]),
  );

export function getChoiceExplanation(
  groupId: string,
): NormalizedChoiceExplanation | undefined {
  return choiceExplanations[groupId];
}
