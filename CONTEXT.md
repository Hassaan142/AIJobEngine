# AIJobEngine — Architecture & Context Reference

## Overview
**AIJobEngine** is a unified, agentic job search automation, scraper, fit evaluation, and application tracking platform designed for Senior Software Engineers and AI practitioners.

The platform provides:
1. **Multi-Portal Job Scrapers**: Headless & API scrapers for LinkedIn, Freehire, and Danish job portals (Jobindex, Jobnet, Jobbank, Jobdanmark) via Bun/TypeScript CLI subagents.
2. **AI Fit Evaluator & Scoring Engine**: Automated multi-factor heuristic and LLM scoring against candidate profile metrics (technical stack, seniority, behavioral match, location eligibility, compensation).
3. **Interactive Local Dashboard**: Modern web dashboard with Kanban application pipeline, live scraper UI, STAR interview lab, and LaTeX CV preview/management.
4. **Agentic Workflows**: Integrated with Claude Code, Google Antigravity, and portable Agent Skills.

---

## Directory Architecture

```
AIJobEngine/
├── .agents/skills/              # Portable Agent Search Skills (CLI scrapers)
│   ├── freehire-search/         # Freehire API aggregator scraper
│   ├── linkedin-search/         # LinkedIn job search CLI
│   ├── jobindex-search/         # Jobindex Denmark scraper
│   ├── jobnet-search/           # Jobnet Denmark STAR portal scraper
│   └── jobbank-search/          # Akademikernes Jobbank scraper
├── .claude/skills/              # Candidate profile & workflow specs
│   └── job-application-assistant/
│       ├── 01-candidate-profile.md   # Canonical tech skills & metrics
│       ├── 02-behavioral-profile.md  # Leadership, communication & culture
│       ├── 04-job-evaluation.md      # Multi-dimensional fit scoring rules
│       ├── 05-cv-templates.md        # LaTeX tailoring guides
│       └── 07-interview-prep.md      # STAR story bank
├── cv/                          # LaTeX resume sources & compiled PDFs
│   ├── main_example.tex         # Master banking style LaTeX CV
│   └── ...                      # Tailored company-specific CVs
├── cover_letters/               # Tailored LaTeX cover letters
├── dashboard/                   # Localhost Full Stack Dashboard
│   ├── index.html               # Semantic, dark-themed UI
│   ├── styles.css               # Premium CSS design tokens & animations
│   ├── app.js                   # Client state, Kanban drag-and-drop, API sync
│   └── server.js                # Node.js backend (ESM, zero npm dependencies)
├── documents/                   # Verification degrees, certificates & assets
├── job_scraper/                 # Legacy python scraping utilities
├── job_search_tracker.csv       # Application tracking database
└── salary_lookup.py             # Salary & compensation estimation utility
```

---

## Backend & API Specifications (`dashboard/server.js`)

The backend is built with native Node.js (ESM) without requiring external npm packages.

### Endpoints
- `GET /api/profile`
  - Returns candidate profile data, verified skill lists, and raw profile markdown.
- `GET /api/tracker`
  - Reads `job_search_tracker.csv` and returns applications as JSON objects.
- `POST /api/tracker`
  - Accepts application updates, new rows, or batch syncs and updates `job_search_tracker.csv`.
- `POST /api/search`
  - Spawns scraper CLI processes (`.agents/skills/*`) and streams back live structured job listings.
- `POST /api/evaluate`
  - Scores a job title and description against candidate competencies and returns scores, verdict, strengths, and CV suggestions.
- Static File Serving
  - Serves `index.html`, `styles.css`, `app.js`, and project documents.

---

## Candidate Profile Context

- **Name**: Hassaan Nasir
- **Title**: Senior Full Stack & AI Engineer
- **Experience**: 8+ Years
- **Key Backend**: Python 3, Django, Django REST Framework, FastAPI, PostgreSQL, Celery, Redis, Microservices.
- **Key Frontend**: React.js, Next.js, TypeScript, Redux Toolkit, Tailwind CSS.
- **AI & Agentic Tools**: Claude Code, Anthropic Claude API, OpenAI API, LangChain, LangGraph, Model Context Protocol (MCP).
- **Cloud & DevOps**: Docker, Kubernetes, AWS (EC2, ECS, S3, RDS), GitHub Actions, GitLab CI/CD.
- **Key Quantified Wins**: 
  - Reduced API response times by 38% via PostgreSQL indexing and DRF query optimization.
  - Accelerated async job completion by 55% using Celery/Redis queue refactoring.
  - Reduced DB query latency by 47%.
