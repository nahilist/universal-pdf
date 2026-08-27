# Contributing

Thank you for your interest in contributing to LinguaFlow!

## Setup

```bash
git clone https://github.com/linguaflow/linguaflow.git
cd linguaflow
cp .env.example .env
docker compose up --build
```

## Development

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Code Style

- Frontend: ESLint + Prettier
- Backend: Ruff + mypy
- Commit messages follow conventional commits

## Testing

```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && uv run pytest
```

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Code of Conduct

Be respectful. Be constructive. Build together.
