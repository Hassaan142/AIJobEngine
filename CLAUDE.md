# Job Application Assistant for Hassaan Nasir

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Hassaan Nasir, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

### Identity
- **Name:** Hassaan Nasir
- **Location:** Pakistan / UAE (Open to Worldwide Remote, Relocation, and Hybrid)
- **Phone:** Available upon request
- **Email:** hasaan.engineer1@gmail.com
- **LinkedIn:** https://linkedin.com/in/hassaan713-nasir
- **GitHub:** Available on profile
- **Languages:**
  | Language | Level |
  |----------|-------|
  | English | Fluent / Professional Working Proficiency |
  | Urdu | Native |
- **CV language:** English
- **Status:** Actively exploring Senior Full Stack, Senior Backend, and AI Engineer roles
- **LinkedIn headline:** "Senior Full Stack Engineer | Python, Django, React, Next.js, TypeScript, AI & LLM Integration"

### Education
- **Bachelor of Computer Science** - National University of Computer and Emerging Sciences (FAST-NUCES), Lahore, Pakistan
  - Key Topics: Distributed Systems, Algorithms & Data Structures, Database Systems, Software Architecture, Web Engineering

### Professional Experience
- **Senior Full Stack Engineer** (2024 – 2026) - **Tags Solutions** (United Arab Emirates / Remote)
  - Architected scalable backend services using Python, Django REST Framework, and PostgreSQL, delivering secure REST APIs that supported multiple business-critical applications while improving API response times by 38%.
  - Designed asynchronous processing pipelines with Celery and Redis, automating long-running background workloads and reducing task completion times by 55%.
  - Developed high-performance user interfaces with React, Next.js, and TypeScript, optimizing rendering strategies and bundle sizes to improve Core Web Vitals and reduce page load times by 34%.
  - Optimized PostgreSQL schemas, indexing strategies, and complex ORM queries, lowering database latency by 47% across high-traffic services.
  - Implemented comprehensive observability using Sentry, Grafana, Datadog, and Prometheus, enabling proactive monitoring that reduced production incident resolution time by 42%.
  - Integrated AI-powered developer workflows using Claude Code, Cursor AI, and OpenAI APIs to accelerate feature development and automate code generation.
  - Managed containerized deployments with Docker, Kubernetes, GitLab CI/CD, and AWS, enabling reliable automated releases with minimal downtime.

- **Full Stack Engineer** (2023 – 2024) - **Inovaqo** (Pakistan / Remote)
  - Led the architecture and development of distributed backend systems using Python, Django, DRF, Celery, and PostgreSQL, supporting high-volume data processing and scalable microservice communication.
  - Engineered reusable backend modules, authentication systems, and shared APIs adopted across multiple engineering teams, reducing duplicate development effort.
  - Built responsive frontend features with React, Next.js, and TypeScript, collaborating closely with product designers to deliver performant user experiences.
  - Improved database efficiency through advanced query optimization, indexing, and schema refactoring, significantly reducing response times for complex analytical workloads.
  - Implemented centralized logging, tracing, and application monitoring using Sentry, Grafana, Datadog, and OpenTelemetry.
  - Mentored engineers through architecture discussions, pull request reviews, and coding standards.
  - Automated deployment pipelines with GitLab CI/CD, Docker, Kubernetes, and AWS.

- **Senior Software Engineer** (2021 – 2023) - **Turing** (Remote / Pakistan)
  - Built scalable chat and collaboration systems using Python, React.js, TypeScript, and PostgreSQL, supporting 10,000+ concurrent users.
  - Designed reusable frontend systems and plugin architectures for real-time data visualization and analytics workflows.
  - Implemented automated testing workflows using Jest, Vitest, and Cypress, achieving 90% test coverage and reducing production bugs.
  - Streamlined CI/CD pipelines using Docker and GitHub Actions, enabling twice-weekly releases without downtime.

- **Software Engineer** (2018 – 2020) - **Devsinc** (Pakistan)
  - Developed responsive UI components using React.js, TypeScript, Tailwind CSS, HTML5, and CSS3 with strong attention to UX and accessibility.
  - Implemented client-side state management using Redux, Zustand, and Context API, improving user session stability and frontend responsiveness.
  - Optimized frontend performance through code splitting, lazy loading, and Lighthouse-driven optimization techniques.
  - Wrote unit and integration tests using Jest and React Testing Library to ensure reliable feature delivery.

### Technical Skills
- **Primary:** Python 3, TypeScript, JavaScript (ES6+), Django, Django REST Framework (DRF), React.js, Next.js, PostgreSQL, Celery, Redis, SQL
- **Secondary:** FastAPI, Node.js, Express.js, ClickHouse, Elasticsearch, MongoDB, SQLite, pgvector, Redux Toolkit, Tailwind CSS, GraphQL
- **AI & LLMs:** LangChain, LangGraph, OpenAI API, Anthropic Claude API, Claude Code, Cursor AI, MCP (Model Context Protocol), Agentic Workflows
- **DevOps & Cloud:** Docker, Kubernetes, AWS (EC2, ECS, S3, RDS, CloudWatch), GitLab CI/CD, GitHub Actions, Terraform, Linux, Nginx, Vercel
- **Observability:** Sentry, Datadog, Grafana, Prometheus, OpenTelemetry, ELK Stack
- **Testing & Quality:** PyTest, Jest, Cypress, Playwright, React Testing Library, Code Review, Static Analysis, Profiling

### Certifications
- **Introduction to Model Context Protocol** - Anthropic
- **Claude Code in Action** - Anthropic

### Key Projects
- **Maya AI**: AI automation platform providing customizable agents for lead conversion, customer support, scheduling, and workflow execution. Integrated LLMs, CRMs, and messaging APIs.
- **Emergent Data AI**: Applications of data science, artificial intelligence, and machine learning for data exploration.
- **Kordis**: Financial management platform providing services from financial statement preparation and cash flow management to M&A/capital raise prep.
- **Nebula x Gaming**: High-performance gaming tournament and competitive play platform.

### Behavioral Profile
- **Architectural Ownership & Systems Thinking**: Deep focus on clean code, resilient distributed architectures, and maintainability.
- **Proactive & Results-Driven**: Strong track record of measurable optimizations (e.g. 38% API speedups, 55% task completion speedups, 47% latency reduction).
- **Strengths:** Full-stack versatility, rapid AI adoption/agentic development, cross-functional mentorship, production observability.
- **Growth areas:** Deepening specialization in custom model fine-tuning and specialized vector database architectures.
- **Thrives in:** High-ownership engineering teams, fast-moving product companies, modern distributed/remote environments.

### What Excites You
- Building intelligent, AI-augmented web applications and distributed backend architectures.
- Solving complex latency, scalability, and async workflow bottlenecks.

### Target Sectors
- AI / GenAI & Agentic Tech Startups & Scaleups
- Cloud & SaaS Platforms
- FinTech & High-Scale Web Applications

### Deal-breakers
- Pure legacy codebase maintenance with no opportunity for modernization or AI tooling.
- Environments hostile to modern developer tooling (CI/CD, automated testing, AI-assisted workflows).

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>_<role>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output.
- [ ] CV compiled with **lualatex**. Cover letter compiled with **xelatex**.
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles**
- [ ] **Cover letter is exactly 1 page**
- [ ] **Cover letter bullet font matches body font**

### ATS & keyword verification (CV)
Extract with `python tools/verify_pdf.py cv/main_<company>_<role>.pdf --dump-text cv/main_<company>_<role>.txt` (pypdf, then `pdftotext -layout -enc UTF-8`) and verify what a parser sees.
- [ ] CV text layer extracts cleanly - no `(cid:*)` markers, `` replacement characters
- [ ] Email and phone appear as **literal text** in the extraction
- [ ] Reading order of the extracted text matches the visual order
- [ ] Posting keywords covered or honestly absent
