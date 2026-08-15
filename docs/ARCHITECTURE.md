# Architecture

## Overview

LinguaFlow follows a modern, scalable architecture designed for high-throughput PDF translation workloads.

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

## Frontend

- **Framework**: Next.js 14 with App Router
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **UI**: shadcn/ui + custom design system

## Backend

- **Framework**: FastAPI with async/await
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Queue**: Redis + Celery for background jobs
- **PDF Processing**: PyMuPDF
- **OCR**: PaddleOCR / Tesseract
- **Translation**: Provider abstraction for cloud/LLM APIs

## Job Lifecycle

```
PENDING → PROCESSING → OCR_PROCESSING → TRANSLATING
    → RECONSTRUCTING → VALIDATING → COMPLETED
                                           → FAILED
```

## PDF Pipeline

1. Upload validation
2. Structure analysis
3. Language detection
4. OCR (if needed)
5. Text extraction
6. Smart chunking
7. AI translation
8. Layout reconstruction
9. Visual validation
10. PDF generation
