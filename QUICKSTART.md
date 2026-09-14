# Clone, Run & Quick Setup Guide (Localhost + CV Setup)

This guide walks you through cloning the repository, running the localhost full-stack dashboard, and uploading/setting up your CV.

---

## 1. Prerequisites

Make sure you have installed:
- **Node.js** (v18+ recommended): Check with `node -v`
- *(Optional for Scrapers)* **Bun**: `curl -fsSL https://bun.sh/install | bash`
- *(Optional for PDF compilation)* **pdflatex / TeX Live / MacTeX**: `pdflatex -v`

---

## 2. Clone the Repository

Clone the repository from GitHub and navigate into the project directory:

```bash
git clone https://github.com/Hassaan142/AIJobEngine.git
cd AIJobEngine
```

---

## 3. Run the Localhost Frontend & Backend

The dashboard is lightweight and runs with **zero npm dependencies** using native Node.js.

### Start the Server
```bash
node dashboard/server.js
```

### Access the App
Open your browser and navigate to:
```
http://localhost:3000
```

*(To run on a custom port, use `PORT=8080 node dashboard/server.js`)*

---

## 4. Setting Up & Uploading Your CV

You can set up your CV either through the codebase or via the dashboard:

### Option A: Edit the Master LaTeX CV Source
1. Navigate to the [`cv/`](file:///Users/apple/Documents/Job%20Search/cv) directory.
2. Open [`cv/main_example.tex`](file:///Users/apple/Documents/Job%20Search/cv/main_example.tex) in your editor.
3. Update your contact details, core competencies, and work experience.
4. Compile to PDF (if TeX is installed):
   ```bash
   cd cv
   pdflatex main_example.tex
   ```
5. Your compiled CV PDF will be generated inside the `cv/` directory.

### Option B: Add Pre-existing PDF / TeX CV Files
1. Copy your existing CV file (`.pdf` or `.tex`) into the `cv/` folder:
   ```bash
   cp ~/Downloads/my_resume.pdf ./cv/
   ```
2. In the Dashboard (under **CV & Template Studio** or the **Kanban Application Modal**), reference your CV file name (e.g. `cv/my_resume.pdf`).

---

## 5. Dashboard Features Available Immediately

- **Overview & Metrics**: Application analytics, pipeline conversion rates, and skill match scores.
- **Live Job Search Hub**: Query jobs across platforms (Freehire, LinkedIn, Jobnet, etc.).
- **AI Fit Evaluator**: Paste any job description to compute an instant match breakdown (Technical, Seniority, Behavioral, Compensation).
- **Kanban Application Pipeline**: Drag-and-drop workflow (`Drafted` → `Applied` → `Screening` → `Interview` → `Offer` → `Closed`). Changes auto-sync to `job_search_tracker.csv`.
- **CV & Template Studio**: Targeted elevator pitches and LaTeX resume previews.
- **STAR Interview Lab**: Behavioral answers with quantified metrics and flashcards.
