# Security

## Authentication & Authorization

- JWT-based authentication with short-lived access tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS configured to trusted origins only

## Data Protection

- TLS 1.3 for all data in transit
- AES-256 encryption for data at rest
- Zero-knowledge architecture for document content
- Automatic data deletion after retention period

## Input Validation

- Strict MIME type validation for uploads
- File size limits enforced
- Path traversal protection
- SQL injection prevention via ORM
- XSS prevention via content security policy

## Infrastructure

- Container security scanning
- Minimal base images
- Non-root user execution
- Secrets management via environment variables
- Regular dependency audits

## Reporting

Report security vulnerabilities to security@linguaflow.ai
