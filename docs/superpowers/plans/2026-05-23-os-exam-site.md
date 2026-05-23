# OS Exam Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first operating systems exam-practice site that presents the course PDFs in their original visual format with real interactive answer controls and immediate feedback.

**Architecture:** Render the source exam PDFs into static page images and place React controls over detected radio circles and answer boxes. Static metadata links controls to solution-key answers; local React state tracks selections and reveals short feedback without a backend.

**Tech Stack:** Vite, React, TypeScript, CSS, Python/PyMuPDF asset generation, Node `tsx --test`, browser QA.

---

### Task 1: Scaffold Project And Tests

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `tests/examLogic.test.ts`

- [x] **Step 1: Write failing tests for answer evaluation and exam metadata expectations**
- [x] **Step 2: Run tests and confirm they fail before implementation**
- [x] **Step 3: Add package/config scaffolding**
- [x] **Step 4: Implement answer evaluation helpers**
- [x] **Step 5: Run tests again until they pass**

### Task 2: Generate PDF-Exact Exam Assets

**Files:**
- Create: `scripts/build_exam_assets.py`
- Generate: `public/exams/**`
- Generate: `src/data/generatedExamManifest.ts`

- [x] **Step 1: Write tests that expect four exams, rendered pages, choice groups, and fill controls**
- [x] **Step 2: Run tests and confirm missing generated data fails**
- [x] **Step 3: Implement PyMuPDF script to render page images and detect radio/blank rectangles**
- [x] **Step 4: Add solution-key metadata for MCQ and fill/drop answers**
- [x] **Step 5: Generate assets and rerun metadata tests**

### Task 3: Build Exam UI

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/components/ExamViewer.tsx`
- Create: `src/components/PageCanvas.tsx`
- Create: `src/components/FeedbackPanel.tsx`
- Create: `src/lib/examLogic.ts`
- Create: `src/styles.css`

- [x] **Step 1: Write tests for choice feedback state and fill/drop matching logic**
- [x] **Step 2: Implement exam picker, progress rail, page stack, radio overlays, blank overlays, and answer bank chips**
- [x] **Step 3: Add immediate green/red feedback for MCQ and fill/drop controls**
- [x] **Step 4: Add explanation panels that state the correct answer and why alternatives are rejected**
- [x] **Step 5: Add responsive print-like page styling matching the PDF**

### Task 4: Verify And Handoff

**Files:**
- Update: generated assets or UI files if QA finds issues

- [x] **Step 1: Run typecheck/build/tests**
- [x] **Step 2: Start local dev server**
- [x] **Step 3: Browser-test desktop and mobile flows**
- [x] **Step 4: Dispatch a fresh agent for independent site testing**
- [ ] **Step 5: Fix any findings, rerun verification, rebuild graphify if code changed**
