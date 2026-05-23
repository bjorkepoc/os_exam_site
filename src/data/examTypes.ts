export interface RectSpec {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExamPageSpec {
  pageNumber: number;
  image: string;
  width: number;
  height: number;
}

export interface ChoiceGroupSpec {
  id: string;
  number: number;
  pageNumber: number;
  optionRects: RectSpec[];
  optionTexts: string[];
  correctIndex: number;
  correctAnswer: string;
  solution: string;
}

export interface FillSlotSpec {
  rect: RectSpec;
  accepted: string[];
  label: string;
}

export interface FillGroupSpec {
  id: string;
  pageNumber: number;
  title: string;
  mode: "fill" | "drag-drop";
  slots: FillSlotSpec[];
  chips: string[];
  explanation: string;
}

export interface ExamSpec {
  id: string;
  title: string;
  kind?: "exam" | "exercise";
  sourceLabel: string;
  pages: ExamPageSpec[];
  choiceGroups: ChoiceGroupSpec[];
  fillGroups: FillGroupSpec[];
  freeResponse: Array<{
    id: string;
    pageNumber: number;
    title: string;
    prompt: string;
    solution: string;
  }>;
}
