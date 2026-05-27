import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getChoiceExplanation } from "../data/explanations";
import type { ExamPageSpec, ExamSpec } from "../data/examTypes";
import { buildCorrectProgressStats, toggleChoiceSelection } from "../lib/examLogic";
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

function isAnswerHiddenExercise(exam: ExamSpec): boolean {
  return exam.kind === "exercise" && Boolean(exam.answersHiddenByDefault);
}

function StaticPdfPage({
  id,
  exam,
  page,
  toolbar,
  variant = "question",
  className = "",
}: {
  id?: string;
  exam: ExamSpec;
  page: ExamPageSpec;
  toolbar?: ReactNode;
  variant?: "question" | "answer";
  className?: string;
}) {
  const image = variant === "answer" ? (page.answerImage ?? page.image) : page.image;
  return (
    <article id={id} className={`page-section ${className}`}>
      {toolbar}
      <div className="pdf-page" style={{ aspectRatio: `${page.width} / ${page.height}` }}>
        <img src={image} alt={`${exam.title} page ${page.pageNumber}`} draggable={false} />
      </div>
    </article>
  );
}

export default function ExamViewer({
  exam,
  answerSheet,
  examAnswersRevealed,
  onExamAnswersRevealedChange,
}: {
  exam: ExamSpec;
  answerSheet?: ExamSpec;
  examAnswersRevealed: boolean;
  onExamAnswersRevealedChange: (revealed: boolean) => void;
}) {
  const [answers, setAnswers] = useState<ExamAnswerState>(() => loadState(exam.id));
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const isExercise = exam.kind === "exercise";
  const isAnswerOnlyExercise = isAnswerHiddenExercise(exam);
  const revealableAnswerCount = isAnswerOnlyExercise
    ? exam.pages.length
    : (answerSheet?.pages.length ?? 0);
  const revealedAnswerCount = Object.values(revealedAnswers).filter(Boolean).length;

  useEffect(() => {
    setAnswers(loadState(exam.id));
    setRevealedAnswers({});
  }, [exam.id]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(exam.id), JSON.stringify(answers));
  }, [answers, exam.id]);

  const stats = useMemo(() => {
    const selectedChoices = Object.keys(answers.choices).length;
    const filledSlots = Object.values(answers.fills).filter(Boolean).length;
    const totalSlots = exam.fillGroups.reduce((sum, group) => sum + group.slots.length, 0);
    const scoredChoiceGroups = exam.choiceGroups.map((group) => ({
      id: group.id,
      correctIndex: getChoiceExplanation(group.id)?.correctIndex ?? group.correctIndex,
    }));
    const correctProgress = buildCorrectProgressStats({
      choices: answers.choices,
      fills: answers.fills,
      choiceGroups: scoredChoiceGroups,
      fillGroups: exam.fillGroups,
    });
    return { selectedChoices, filledSlots, totalSlots, correctProgress };
  }, [answers.choices, answers.fills, exam.choiceGroups, exam.fillGroups]);

  function setChoice(groupId: string, optionIndex: number) {
    setAnswers((current) => ({
      ...current,
      choices: toggleChoiceSelection(current.choices, groupId, optionIndex),
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
    onExamAnswersRevealedChange(false);
    window.localStorage.removeItem(storageKey(exam.id));
  }

  function setAnswerReveal(key: string, revealed: boolean) {
    setRevealedAnswers((current) => ({ ...current, [key]: revealed }));
  }

  function hideAllAnswers() {
    setRevealedAnswers({});
  }

  function answerPageFor(pageIndex: number): ExamPageSpec | undefined {
    return answerSheet?.pages[pageIndex];
  }

  function renderAnswerRevealPanel(
    answerPage: ExamPageSpec | undefined,
    pageNumber: number,
    panelKey?: string,
  ) {
    if (!answerSheet || !answerPage) return null;
    const revealKey = `${answerSheet.id}-${answerPage.pageNumber}`;
    const isRevealed = Boolean(revealedAnswers[revealKey]);
    return (
      <div key={panelKey} className="exercise-answer-block">
        <div className="exercise-reveal-panel">
          <div>
            <strong>Answers for page {pageNumber}</strong>
            <span>{isRevealed ? answerSheet.sourceLabel : "Hidden until you reveal them."}</span>
          </div>
          <button
            className="exercise-reveal-button"
            type="button"
            aria-expanded={isRevealed}
            onClick={() => setAnswerReveal(revealKey, !isRevealed)}
          >
            {isRevealed ? "Hide answer page" : "Reveal answer page"}
          </button>
        </div>
        {isRevealed ? (
          <StaticPdfPage
            exam={answerSheet}
            page={answerPage}
            variant="answer"
            className="exercise-answer-page"
          />
        ) : null}
      </div>
    );
  }

  function renderHiddenAnswerPage(page: ExamPageSpec) {
    const revealKey = `${exam.id}-${page.pageNumber}`;
    const isRevealed = Boolean(revealedAnswers[revealKey]);
    return (
      <StaticPdfPage
        key={page.pageNumber}
        id={`page-${page.pageNumber}`}
        exam={exam}
        page={page}
        variant={isRevealed ? "answer" : "question"}
        toolbar={
          <div className="exercise-answer-toolbar">
            <span>
              Page {page.pageNumber} {isRevealed ? "answers revealed" : "questions only"}
            </span>
            <button
              className={isRevealed ? "exercise-hide-button" : "exercise-reveal-button"}
              type="button"
              aria-expanded={isRevealed}
              onClick={() => setAnswerReveal(revealKey, !isRevealed)}
            >
              {isRevealed ? "Hide answers" : "Reveal answers"}
            </button>
          </div>
        }
      />
    );
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
                <dt>Correct</dt>
                <dd>{examAnswersRevealed ? `${stats.correctProgress.percent}%` : "Hidden"}</dd>
              </div>
            )}
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
            {isExercise && revealableAnswerCount > 0 && (
              <div>
                <dt>Answers</dt>
                <dd>
                  {revealedAnswerCount}/{revealableAnswerCount}
                </dd>
              </div>
            )}
          </dl>
          {!isExercise && (
            <div className="exam-action-row">
              <button className="reset-button" type="button" onClick={resetExam}>
                Reset exam
              </button>
              <button
                className="reset-button"
                type="button"
                aria-pressed={examAnswersRevealed}
                onClick={() => onExamAnswersRevealedChange(!examAnswersRevealed)}
              >
                {examAnswersRevealed ? "Hide answers" : "Reveal answers"}
              </button>
            </div>
          )}
          {isExercise && revealableAnswerCount > 0 && revealedAnswerCount > 0 && (
            <button className="reset-button" type="button" onClick={hideAllAnswers}>
              Hide answers
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
        {exam.pages.map((page, pageIndex) =>
          isAnswerOnlyExercise ? (
            renderHiddenAnswerPage(page)
          ) : (
            <div key={page.pageNumber}>
              <PageCanvas
                exam={exam}
                page={page}
                answers={answers}
                onChoice={setChoice}
                onFill={setFill}
                onFreeResponse={setFreeResponse}
                revealAnswers={examAnswersRevealed}
              />
              {renderAnswerRevealPanel(answerPageFor(pageIndex), page.pageNumber)}
            </div>
          ),
        )}
        {!isAnswerOnlyExercise && answerSheet
          ? answerSheet.pages
              .slice(exam.pages.length)
              .map((page) =>
                renderAnswerRevealPanel(
                  page,
                  page.pageNumber,
                  `extra-answer-${page.pageNumber}`,
                ),
              )
          : null}
      </section>
    </main>
  );
}
