# TDT4186 OS Exam Practice

Interactive practice site for TDT4186 Operativsystemer exams and exercise sheets.

## Commands

```powershell
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

The local dev server runs at `http://127.0.0.1:4100`.

## Generated Assets

Exam and exercise PDF pages are rendered into `public/exams`, and the interactive
manifest is generated at `src/data/generatedExamManifest.ts`.

Regenerate both with:

```powershell
python scripts\build_exam_assets.py
```
