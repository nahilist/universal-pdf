from typing import Any, Optional, cast
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.core.config import settings

security_bearer = HTTPBearer(auto_error=False)


class CurrentUser(BaseModel):
    id: str
    email: Optional[str] = None
    is_authenticated: bool = True


_jwks_client: Optional[PyJWKClient] = None


def get_jwks_client() -> Optional[PyJWKClient]:
    global _jwks_client
    if _jwks_client is None and settings.clerk_jwks_url:
        _jwks_client = PyJWKClient(settings.clerk_jwks_url, cache_jwk_set=True, lifespan=3600)
    return _jwks_client


def verify_clerk_token(token: str) -> dict[str, Any]:
    # 1. If PEM public key is configured directly
    if settings.clerk_pem_public_key:
        pem_key = settings.clerk_pem_public_key.strip()
        if not pem_key.startswith("-----BEGIN"):
            pem_key = f"-----BEGIN PUBLIC KEY-----\n{pem_key}\n-----END PUBLIC KEY-----"
        return cast(
            dict[str, Any],
            jwt.decode(
                token,
                pem_key,
                algorithms=["RS256"],
                options={"verify_exp": True, "verify_aud": False},
            ),
        )

    # 2. If JWKS URL is configured
    jwks_client = get_jwks_client()
    if jwks_client:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        return cast(
            dict[str, Any],
            jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                options={"verify_exp": True, "verify_aud": False},
            ),
        )

    # 3. Development / Mock Mode fallback (when keys are not yet configured)
    unverified = jwt.decode(token, options={"verify_signature": False, "verify_exp": False})
    return cast(dict[str, Any], unverified)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
) -> CurrentUser:
    if not credentials or not credentials.credentials:
        return CurrentUser(id="anonymous", email=None, is_authenticated=False)

    token = credentials.credentials
    try:
        payload = verify_clerk_token(token)
        user_id = payload.get("sub") or payload.get("id") or "anonymous"
        email = payload.get("email") or payload.get("primary_email_address")
        return CurrentUser(id=user_id, email=email, is_authenticated=True)
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def require_current_user(
    current_user: CurrentUser = Depends(get_current_user),
) -> CurrentUser:
    if not current_user.is_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in to proceed.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user
