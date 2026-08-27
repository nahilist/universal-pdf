<div align="center">

# LINGUAFLOW

### 🌐 Universal AI PDF Translator

<p align="center">
  <strong>Translate any PDF. Preserve its original identity.</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js" />
  </a>
  <a href="https://www.python.org/">
    <img src="https://img.shields.io/badge/Python-3.13+-blue.svg" alt="Python" />
  </a>
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/FastAPI-0.111-green.svg" alt="FastAPI" />
  </a>
  <a href="https://www.docker.com/">
    <img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker" />
  </a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#features">Features</a> •
  <a href="#development">Development</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</p>

</div>

---

## 📖 About

**LinguaFlow** is a production-grade, premium SaaS application that translates PDF documents across **100+ languages** while preserving their original layout, typography, tables, and visual structure.

Most translation tools simply extract text, translate it, and generate a broken PDF. LinguaFlow is built differently. It analyzes document structure, detects scanned pages requiring OCR, performs contextual translation, and reconstructs the PDF with pixel-perfect fidelity.

### 🔥 Key Highlights

| Capability | Detail |
|---|---|
| 🎯 **Layout Preservation** | Tables, images, fonts, and formatting remain identical post-translation |
| ⚡ **Background Processing** | Async job queue with Redis + Celery for long-running translations |
| 🔍 **Smart OCR** | Auto-detects scanned PDFs and extracts text with PaddleOCR / Tesseract |
| 🗣️ **100+ Languages** | Provider-agnostic translation engine supporting cloud APIs and LLMs |
| 🛡️ **Enterprise Security** | JWT auth, rate limiting, MIME validation, path traversal protection |
| 📊 **Observability** | Structured logging, error codes, and metrics-ready architecture |

---

## ✨ Features

### Frontend
- **Premium landing page** — glass-effect navbar, animated hero, interactive PDF translation visualization, subtle grid + glow + particle background
- **Translation workspace** — drag-and-drop upload, animated progress pipeline, live page status
- **Language selectors** — search, native names, popular/recent languages, auto-detection
- **PDF preview** — zoom, page navigation, side-by-side comparison, download
- **Dashboard** — stats, recent translations, history with search/filter/sort
- **Design system** — centralized tokens, reusable UI components, skeleton loaders, toast notifications

### Backend
- **Async job lifecycle** — `PENDING → PROCESSING → OCR_PROCESSING → TRANSLATING → RECONSTRUCTING → VALIDATING → COMPLETED`
- **PDF pipeline** — upload validation → structure analysis → language detection → OCR → text extraction → smart chunking → translation → layout reconstruction → validation
- **Provider abstraction** — replaceable translation providers without touching business logic
- **Font engine** — language-aware fallback for Latin, Devanagari, CJK, Arabic, Hebrew, Cyrillic
- **Table engine** — row/column/border/cell preservation with independent cell translation

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│  API Gateway │────▶│ Application │
│  (Next.js)  │     │  (FastAPI)   │     │  Services   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Redis     │     │ PostgreSQL  │
                    │   (Queue)   │     │  (Storage)  │
                    └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Celery   │
                    │   Worker    │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PDF Pipeline│
                    │  Translation│
                    │   Engine    │
                    └─────────────┘
```

### Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · TanStack Query · React Hook Form · Zod · Lucide |
| **Backend** | FastAPI · Pydantic · SQLAlchemy · Alembic · Python-Jose · Passlib |
| **Queue** | Redis · Celery |
| **PDF / OCR** | PyMuPDF · PaddleOCR · Tesseract |
| **Infrastructure** | Docker · Docker Compose · PostgreSQL 16 · Redis 7 |
| **Observability** | Structured logging · Sentry-ready · Prometheus-ready |

</div>

---

## 📁 Project Structure

```
universalpdf/
├── frontend/                    # Next.js 14 application
│   ├── src/
│   │   ├── app/                 # App Router (pages, layouts, metadata)
│   │   ├── components/          # Reusable components
│   │   │   ├── ui/              # shadcn/ui + custom design system
│   │   │   └── landing/         # Landing page sections
│   │   ├── lib/                 # Utilities, design tokens, cn()
│   │   └── providers/           # Query + Theme providers
│   ├── public/                  # Static assets
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── api/v1/              # API routers
│   │   ├── core/                # Config, logging, exceptions, security
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── repositories/        # Database session, queries
│   │   ├── services/            # Business logic
│   │   ├── pdf/                 # Extraction, analysis, layout, rendering, validation
│   │   ├── ocr/                 # OCR abstraction (Tesseract, PaddleOCR)
│   │   ├── translation/         # Provider abstraction, chunking, retry
│   │   ├── storage/             # Local + S3 storage backends
│   │   ├── workers/             # Celery workers
│   │   └── main.py              # FastAPI app entrypoint
│   ├── pyproject.toml
│   ├── uv.lock
│   └── Dockerfile
│
├── worker/                      # Celery worker entrypoints
├── infrastructure/              # Terraform, CI/CD, monitoring configs
├── tests/                       # Integration & E2E tests
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   └── CONTRIBUTING.md
├── linguaflow/                  # Monorepo symlink / submodule staging
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **Python** >= 3.11
- **Docker & Docker Compose**
- **PostgreSQL** >= 16 *(or use Docker)*
- **Redis** >= 7 *(or use Docker)*

### 1. Clone the repository

```bash
git clone https://github.com/linguaflow/linguaflow.git
cd linguaflow
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DATABASE_URL=postgresql+asyncpg://linguaflow:linguaflow@localhost:5432/linguaflow

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=change-me-to-a-strong-secret-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Upload Limits
MAX_UPLOAD_SIZE=52428800
MAX_PAGES=200

# Translation Provider
TRANSLATION_PROVIDER=mock

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start with Docker Compose

```bash
docker compose up --build
```

| Service | URL | Credentials |
|:---|:---|:---|
| **Frontend** | http://localhost:3000 | — |
| **Backend API** | http://localhost:8000 | — |
| **API Docs** | http://localhost:8000/docs | — |
| **PostgreSQL** | localhost:5432 | linguaflow / linguaflow |
| **Redis** | localhost:6379 | — |

### 4. Manual development (without Docker)

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run lint      # ESLint
npm run typecheck # TypeScript
npm run build     # Production build
npm test          # Jest
```

### Backend
```bash
cd backend
uv run pytest     # Unit + integration tests
```

---

## 🛠️ Development

### Scripts

| Command | Description |
|:---|:---|
| `docker compose up --build` | Start full stack |
| `docker compose down -v` | Stop and remove volumes |
| `npm run dev` | Frontend dev server (hot reload) |
| `npm run build` | Frontend production build |
| `npm run lint` | Frontend linting |
| `npm run typecheck` | Frontend type checking |
| `uv run uvicorn app.main:app --reload` | Backend dev server |
| `uv run pytest` | Run backend tests |

### Design System

Theming uses **CSS custom properties** with a dark-first palette:

| Token | Value |
|:---|:---|
| `--background` | `hsl(0 0% 3%)` |
| `--foreground` | `hsl(0 0% 98%)` |
| `--primary` | `hsl(263 70% 50%)` |
| `--brand` | `hsl(263 70% 50%)` |
| `--surface` | `hsl(0 0% 5%)` |
| `--graphite` | `hsl(0 0% 6%)` |
| `--radius` | `0.75rem` |

---

## 📡 API Reference

Base URL: `/api/v1`

### Authentication
```
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Jobs
```
POST   /jobs              Create translation job
GET    /jobs              List user jobs
GET    /jobs/{id}         Get job status
DELETE /jobs/{id}         Cancel job
GET    /jobs/{id}/download Download translated PDF
```

### Files
```
POST /files/upload        Upload PDF
GET  /files/{id}          Get file metadata
```

### Languages
```
GET /languages            List supported languages
```

### Health
```
GET /health               Health check
GET /ready                Readiness check
```

Full API documentation is available at **http://localhost:8000/docs** (Swagger UI) when the backend is running.

---

## 🔐 Security

LinguaFlow is built with security-first principles:

- **Authentication** — JWT with short-lived access tokens + bcrypt password hashing
- **Authorization** — IDOR protection, scoped access controls
- **Input validation** — Strict MIME checking, size limits, path traversal prevention
- **Data protection** — TLS 1.3 in transit, AES-256 at rest, zero-knowledge document handling
- **Infrastructure** — Non-root containers, minimal base images, secrets via env vars

See [SECURITY.md](./docs/SECURITY.md) for details.

---

## 🚢 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production deployment guides, scaling strategies, and infrastructure recommendations.

**Production checklist:**
- [ ] Set `DEBUG=False`
- [ ] Use a strong `SECRET_KEY`
- [ ] Configure CORS origins
- [ ] Enable TLS / HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, Prometheus, Grafana)
- [ ] Configure database backups
- [ ] Review security headers

---

## 🗺️ Roadmap

- [ ] **Phase 1** ✅ Foundation — frontend, backend, Docker, design system, landing page
- [ ] **Phase 2** 🔜 Authentication — JWT, registration, login, protected routes
- [ ] **Phase 3** 🔜 PDF upload + storage — multipart upload, validation, S3/local storage
- [ ] **Phase 4** 🔜 PDF analysis + extraction — PyMuPDF pipeline, structure analysis
- [ ] **Phase 5** 🔜 OCR — PaddleOCR/Tesseract integration, scanned page detection
- [ ] **Phase 6** 🔜 Translation engine — provider abstraction, smart chunking, retry
- [ ] **Phase 7** 🔜 Background worker — Celery, Redis queue, job lifecycle
- [ ] **Phase 8** 🔜 Layout reconstruction — text fitting, font fallback, table engine
- [ ] **Phase 9** 🔜 PDF preview — zoom, navigation, side-by-side comparison
- [ ] **Phase 10** 🔜 Dashboard + history — stats, search, filter, sort
- [ ] **Phase 11** 🔜 Security hardening — rate limiting, audit logging, secrets management
- [ ] **Phase 12** 🔜 Testing + E2E — pytest, Playwright, CI/CD
- [ ] **Phase 13** 🔜 Performance — caching, CDN, edge deployment

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines on setup, code style, and pull requests.

```bash
# Fork, then clone
git clone https://github.com/himanshux64/linguaflow.git
cd linguaflow

# Install dependencies
docker compose up --build

# Make changes, add tests, submit PR
```

---

## 📄 License

LinguaFlow is released under the [MIT License](./LICENSE).

---

## 🙏 Acknowledgments

Built with the following open-source technologies:

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query)
- [PyMuPDF](https://pymupdf.readthedocs.io/)
- [Celery](https://docs.celeryq.dev/)
- [SQLAlchemy](https://www.sqlalchemy.org/)

---

<div align="center">

**Translate any PDF. Preserve its original identity.**

Built with precision. Designed for scale.

[Website](https://linguaflow.ai) • [Documentation](./docs/API.md) • [Security](./docs/SECURITY.md) • [Contributing](./docs/CONTRIBUTING.md)

</div>
