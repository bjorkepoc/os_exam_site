import type { ReactNode } from "react";

export default function FeedbackPanel({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "correct" | "incorrect" | "neutral";
  children: ReactNode;
}) {
  return (
    <div className={`feedback-panel ${tone}`}>
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  );
}
