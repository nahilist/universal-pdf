# Deployment

## Prerequisites

- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+
- Node.js 20+ (for frontend)
- Python 3.12+ and uv (for backend)

## Environment

1. Copy `.env.example` to `.env`
2. Set `SECRET_KEY` to a strong random value
3. Configure `DATABASE_URL` and `REDIS_URL`
4. Set `TRANSLATION_PROVIDER` to your provider

## Docker Compose

```bash
docker compose up --build
```

## Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure CORS origins
- [ ] Set up TLS/HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, Prometheus)
- [ ] Configure backup strategy
- [ ] Review security settings

## Scaling

- Frontend: Deploy to Vercel / Next.js hosting
- Backend: Deploy to container orchestration (K8s / ECS)
- Workers: Scale Celery workers horizontally
- Database: Use managed PostgreSQL with read replicas
- Storage: Use S3-compatible object storage
