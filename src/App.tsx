import { useMemo, useState } from "react";
import { exams, exerciseSheets } from "./data/generatedExamManifest";
import ExamViewer from "./components/ExamViewer";

export default function App() {
  const [section, setSection] = useState<"exam" | "exercise">("exam");
  const [sheetId, setSheetId] = useState(exams[0]?.id ?? "");
  const availableSheets = section === "exam" ? exams : exerciseSheets;
  const selectedSheet = useMemo(
    () => availableSheets.find((sheet) => sheet.id === sheetId) ?? availableSheets[0],
    [availableSheets, sheetId],
  );

  function handleSectionChange(nextSection: "exam" | "exercise") {
    setSection(nextSection);
    setSheetId((nextSection === "exam" ? exams[0] : exerciseSheets[0])?.id ?? "");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="course-code">TDT4186</p>
          <h1>Operativsystemer Exam Practice</h1>
        </div>
        <div className="section-tabs" role="tablist" aria-label="Practice material type">
          <button
            type="button"
            aria-selected={section === "exam"}
            onClick={() => handleSectionChange("exam")}
          >
            Exams
          </button>
          <button
            type="button"
            aria-selected={section === "exercise"}
            onClick={() => handleSectionChange("exercise")}
          >
            Exercises
          </button>
        </div>
        <label className="exam-select">
          <span>{section === "exam" ? "Exam" : "Exercise sheet"}</span>
          <select value={sheetId} onChange={(event) => setSheetId(event.target.value)}>
            {availableSheets.map((sheet) => (
              <option key={sheet.id} value={sheet.id}>
                {sheet.title}
              </option>
            ))}
          </select>
        </label>
      </header>

      {selectedSheet ? <ExamViewer key={selectedSheet.id} exam={selectedSheet} /> : null}
    </div>
  );
}
