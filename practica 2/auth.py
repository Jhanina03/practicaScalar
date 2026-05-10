from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPBearer, HTTPAuthorizationCredentials

VALID_API_KEY = "demo-key-123"
VALID_BEARER_TOKEN = "demo-token-abc"

api_key_scheme = APIKeyHeader(name="X-API-Key", auto_error=False)
bearer_scheme = HTTPBearer(auto_error=False)


def require_api_key(api_key: str = Security(api_key_scheme)) -> str:
    if api_key != VALID_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key invalida. Usa header X-API-Key: demo-key-123",
        )
    return api_key


def require_bearer(creds: HTTPAuthorizationCredentials = Security(bearer_scheme)) -> str:
    if creds is None or creds.credentials != VALID_BEARER_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido. Usa Authorization: Bearer demo-token-abc",
        )
    return creds.credentials
