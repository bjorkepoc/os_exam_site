import { useRef, useState } from "react";
import type {
  ChoiceGroupSpec,
  ExamPageSpec,
  ExamSpec,
  FillGroupSpec,
} from "../data/examTypes";
import {
  buildFillFeedback,
  evaluateFillAnswer,
  rectStyle,
} from "../lib/examLogic";
import type { ExamAnswerState } from "./ExamViewer";
import FeedbackPanel from "./FeedbackPanel";

function fillSlotId(group: FillGroupSpec, slotIndex: number): string {
  return `${group.id}-slot-${slotIndex}`;
}

function pageChoiceGroups(exam: ExamSpec, pageNumber: number): ChoiceGroupSpec[] {
  return exam.choiceGroups.filter((group) => group.pageNumber === pageNumber);
}

function pageFillGroups(exam: ExamSpec, pageNumber: number): FillGroupSpec[] {
  return exam.fillGroups.filter((group) => group.pageNumber === pageNumber);
}

function optionNoteStyle(
  rect: { x: number; y: number; width: number; height: number },
  page: { width: number; height: number },
) {
  const noteWidth = Math.min(230, Math.max(148, page.width * 0.32));
  const preferredX = Math.min(page.width - noteWidth - 12, rect.x + 258);
  const x = Math.min(
    Math.max(rect.x + rect.width + 12, preferredX),
    page.width - noteWidth - 8,
  );
  return {
    left: `${(x / page.width) * 100}%`,
    top: `${((rect.y - 3) / page.height) * 100}%`,
    width: `${(noteWidth / page.width) * 100}%`,
  };
}

export default function PageCanvas({
  exam,
  page,
  answers,
  onChoice,
  onFill,
  onFreeResponse,
}: {
  exam: ExamSpec;
  page: ExamPageSpec;
  answers: ExamAnswerState;
  onChoice: (groupId: string, optionIndex: number) => void;
  onFill: (slotId: string, value: string) => void;
  onFreeResponse: (responseId: string, value: string) => void;
}) {
  const choices = pageChoiceGroups(exam, page.pageNumber);
  const fillGroups = pageFillGroups(exam, page.pageNumber);
  const skipNextChipClick = useRef(false);
  const [draggingChip, setDraggingChip] = useState<{
    value: string;
    x: number;
    y: number;
  } | null>(null);
  const freeResponses = exam.freeResponse.filter(
    (response) => response.pageNumber === page.pageNumber,
  );

  function handleChipPointerDown(value: string) {
    return (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      const startX = event.clientX;
      const startY = event.clientY;
      let didDrag = false;

      const finishDrag = (clientX: number, clientY: number) => {
        const dropTarget = document
          .elementFromPoint(clientX, clientY)
          ?.closest<HTMLElement>("[data-drop-slot-id]");
        const slotId = dropTarget?.dataset.dropSlotId;
        if (slotId) onFill(slotId, value);
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const distance = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
        if (!didDrag && distance < 6) return;
        didDrag = true;
        setDraggingChip({ value, x: moveEvent.clientX, y: moveEvent.clientY });
      };

      const cleanup = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerCancel);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        cleanup();
        if (didDrag) {
          skipNextChipClick.current = true;
          finishDrag(upEvent.clientX, upEvent.clientY);
        }
        setDraggingChip(null);
      };

      const handlePointerCancel = () => {
        cleanup();
        setDraggingChip(null);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerCancel);
    };
  }

  return (
    <article id={`page-${page.pageNumber}`} className="page-section">
      {fillGroups.length > 0 && (
        <div className="answer-bank answer-bank-top">
          {fillGroups.map((group) => (
            <div key={group.id}>
              <div className="bank-heading">
                <strong>{group.title}</strong>
                <span>{group.explanation}</span>
              </div>
              <div className="chips">
                {group.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    draggable={false}
                    onPointerDown={handleChipPointerDown(chip)}
                    onClick={() => {
                      if (skipNextChipClick.current) {
                        skipNextChipClick.current = false;
                        return;
                      }
                      const firstEmpty = group.slots.findIndex((_, index) => {
                        const id = fillSlotId(group, index);
                        return !answers.fills[id];
                      });
                      if (firstEmpty >= 0) onFill(fillSlotId(group, firstEmpty), chip);
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pdf-page" style={{ aspectRatio: `${page.width} / ${page.height}` }}>
        <img src={page.image} alt={`${exam.title} page ${page.pageNumber}`} draggable={false} />

        {choices.map((group) =>
          group.optionRects.map((rect, optionIndex) => {
            const selected = answers.choices[group.id];
            const hasAnswer = selected !== undefined;
            const isSelected = selected === optionIndex;
            const isCorrectOption = group.correctIndex === optionIndex;
            const statusClass = hasAnswer
              ? isCorrectOption
                ? "is-correct"
                : isSelected
                  ? "is-wrong"
                  : "is-muted"
              : "";

            return (
              <button
                key={`${group.id}-${optionIndex}`}
                type="button"
                data-testid={`${group.id}-option-${optionIndex}`}
                aria-label={`Question ${group.number}, option ${optionIndex + 1}`}
                className={`choice-overlay ${statusClass}`}
                style={rectStyle(rect, page)}
                onClick={() => onChoice(group.id, optionIndex)}
              >
                <span />
              </button>
            );
          }),
        )}

        {choices.flatMap((group) => {
          const selected = answers.choices[group.id];
          if (selected === undefined) return [];
          return group.optionRects.map((rect, optionIndex) => {
            const isCorrect = group.correctIndex === optionIndex;
            const isSelected = selected === optionIndex;
            const text = isCorrect
              ? `Right: ${group.correctAnswer}`
              : isSelected
                ? `Wrong: answer is ${group.correctAnswer}`
                : "Wrong: not the solution";
            return (
              <div
                key={`${group.id}-${optionIndex}-note`}
                className={`option-note ${isCorrect ? "right" : isSelected ? "picked-wrong" : "wrong"}`}
                style={optionNoteStyle(rect, page)}
              >
                {text}
              </div>
            );
          });
        })}

        {fillGroups.flatMap((group) =>
          group.slots.map((slot, slotIndex) => {
            const slotId = fillSlotId(group, slotIndex);
            const value = answers.fills[slotId] ?? "";
            const hasValue = value.trim().length > 0;
            const correct = hasValue && evaluateFillAnswer(value, slot.accepted);
            return (
              <input
                key={slotId}
                data-testid={slotId}
                aria-label={`${group.title} ${slot.label}`}
                className={`blank-overlay ${hasValue ? (correct ? "is-correct" : "is-wrong") : ""}`}
                style={rectStyle(slot.rect, page)}
                value={value}
                data-drop-slot-id={slotId}
                onChange={(event) => onFill(slotId, event.currentTarget.value)}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  onFill(slotId, event.dataTransfer.getData("text/plain"));
                }}
              />
            );
          }),
        )}
      </div>

      {fillGroups.length > 0 && (
        <div className="page-feedback">
          {fillGroups.map((group) => (
            <div key={group.id} className="answer-bank">
              <div className="bank-heading">
                <strong>{group.title} feedback</strong>
                <span>{group.explanation}</span>
              </div>
              <div className="slot-feedback-list">
                {group.slots.map((slot, index) => {
                  const slotId = fillSlotId(group, index);
                  const value = answers.fills[slotId] ?? "";
                  if (!value.trim()) return null;
                  const feedback = buildFillFeedback(value, slot.accepted);
                  return (
                    <FeedbackPanel
                      key={slotId}
                      title={`${slot.label}: ${feedback.title}`}
                      tone={feedback.correct ? "correct" : "incorrect"}
                    >
                      {feedback.body}
                    </FeedbackPanel>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      )}

      {draggingChip ? (
        <div
          className="drag-chip-preview"
          style={{ left: draggingChip.x, top: draggingChip.y }}
        >
          {draggingChip.value}
        </div>
      ) : null}

      {freeResponses.length > 0 && (
        <div className="free-response-list">
          {freeResponses.map((response) => (
            <section key={response.id} className="free-response">
              <h3>{response.title}</h3>
              <p>{response.prompt}</p>
              <textarea
                value={answers.freeResponses[response.id] ?? ""}
                onChange={(event) => onFreeResponse(response.id, event.currentTarget.value)}
              />
              {answers.freeResponses[response.id]?.trim() ? (
                <FeedbackPanel title="Rubric" tone="neutral">
                  {response.solution}
                </FeedbackPanel>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
