# API Reference

Base URL: `/api/v1`

## Authentication

```
POST /auth/register
POST /auth/login
POST /auth/logout
```

## Jobs

```
POST   /jobs              Create a translation job
GET    /jobs              List user jobs
GET    /jobs/{id}         Get job details
DELETE /jobs/{id}         Cancel a job
GET    /jobs/{id}/download Download translated PDF
```

## Files

```
POST /files/upload       Upload a PDF
GET  /files/{id}         Get file info
```

## Languages

```
GET /languages           List supported languages
```

## Health

```
GET /health              Health check
GET /ready               Readiness check
```

## Error Codes

| Code | Description |
|------|-------------|
| PDF_INVALID | Invalid PDF file |
| PDF_CORRUPTED | Corrupted PDF |
| PDF_PASSWORD_PROTECTED | Password-protected PDF |
| PDF_TOO_LARGE | File size exceeds limit |
| PDF_TOO_MANY_PAGES | Too many pages |
| OCR_FAILED | OCR processing failed |
| TRANSLATION_FAILED | Translation failed |
| TRANSLATION_RATE_LIMIT | Rate limit exceeded |
| RENDER_FAILED | PDF render failed |
| STORAGE_FAILED | Storage failed |
| JOB_NOT_FOUND | Job not found |
| UNAUTHORIZED | Authentication required |
