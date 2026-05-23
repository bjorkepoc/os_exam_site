import { useEffect, useMemo, useState } from "react";
import { exams, exerciseSheets } from "./data/generatedExamManifest";
import type { ExamSpec } from "./data/examTypes";
import ExamViewer from "./components/ExamViewer";

type Section = "exam" | "exercise";
type ThemeMode = "light" | "mild" | "dark";

const THEME_KEY = "tdt4186_theme_mode";
const themeOptions: Array<{ id: ThemeMode; label: string }> = [
  { id: "light", label: "Light" },
  { id: "mild", label: "Mild" },
  { id: "dark", label: "Dark" },
];

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "mild" || value === "dark";
}

function loadThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  return isThemeMode(stored) ? stored : "light";
}

export default function App() {
  const [section, setSection] = useState<Section>("exam");
  const [sheetId, setSheetId] = useState(exams[0]?.id ?? "");
  const [theme, setTheme] = useState<ThemeMode>(() => loadThemeMode());
  const availableSheets: ExamSpec[] = section === "exam" ? exams : exerciseSheets;
  const selectedSheet = useMemo(
    () => availableSheets.find((sheet) => sheet.id === sheetId) ?? availableSheets[0],
    [availableSheets, sheetId],
  );
  const selectedAnswerSheet = useMemo(
    () =>
      selectedSheet?.solutionSheetId
        ? exerciseSheets.find((sheet) => sheet.id === selectedSheet.solutionSheetId)
        : undefined,
    [selectedSheet],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function handleSectionChange(nextSection: Section) {
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
        <div className="topbar-controls">
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
          <div className="theme-tabs" role="group" aria-label="Theme">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={theme === option.id}
                onClick={() => setTheme(option.id)}
              >
                {option.label}
              </button>
            ))}
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
        </div>
      </header>

      {selectedSheet ? (
        <ExamViewer
          key={selectedSheet.id}
          exam={selectedSheet}
          answerSheet={selectedAnswerSheet}
        />
      ) : null}
    </div>
  );
}
