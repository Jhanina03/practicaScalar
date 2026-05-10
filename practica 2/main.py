"""
Practica 2 - Scalar + FastAPI (API de Libros).

Punto de entrada. Configura:
- Metadata OpenAPI rica (markdown, contact, license, servers, tags con descripcion)
- Esquemas de seguridad (API Key + Bearer Token) -> candado en UI Scalar
- Renderizado Scalar avanzado: theme, layout, hotkey, customCss, hideDownloadButton
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import (
    Layout,
    SearchHotKey,
    Theme,
    get_scalar_api_reference,
)

from routers import books, uploads

API_DESCRIPTION = """
# API de Libros - Demo Scalar

API REST de demostracion para la **practica 2** del curso. Cubre features de Scalar
no usadas en la practica 1 (NestJS).

## Que aprenderas
- Autenticacion **API Key** y **Bearer Token** (boton "Authorize" en la UI)
- **Multiples ejemplos** por endpoint (dropdown en Scalar)
- **Subida de archivos** (multipart) con UI especial
- **Endpoints deprecados** (banner amarillo)
- **Enums** -> dropdowns automaticos
- **Headers de respuesta** documentados (rate-limit)
- Configuracion Scalar avanzada: theme, layout, hotkey, custom CSS

## Credenciales de prueba
| Tipo | Valor |
|------|-------|
| API Key (header `X-API-Key`) | `demo-key-123` |
| Bearer Token (`Authorization: Bearer ...`) | `demo-token-abc` |
"""

tags_metadata = [
    {
        "name": "Libros",
        "description": "CRUD de libros. POST/PUT/DELETE requieren autenticacion.",
        "externalDocs": {
            "description": "Inspirado en Open Library",
            "url": "https://openlibrary.org/developers/api",
        },
    },
    {
        "name": "Uploads",
        "description": "Subida de archivos multipart (portadas).",
    },
]

app = FastAPI(
    title="API de Libros - Practica 2",
    description=API_DESCRIPTION,
    version="1.0.0",
    contact={"name": "Equipo Practica 2", "url": "https://github.com/"},
    license_info={"name": "MIT", "url": "https://opensource.org/licenses/MIT"},
    servers=[
        {"url": "http://localhost:8000", "description": "Servidor local"},
        {"url": "https://api.libros.example.com", "description": "Produccion (ficticio)"},
    ],
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

app.include_router(books.router)
app.include_router(uploads.router)


@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "API Libros corriendo",
        "docs_scalar": "/scalar",
        "docs_swagger": "/docs",
        "openapi_json": "/openapi.json",
    }


@app.get("/scalar", include_in_schema=False)
def scalar_docs():
    """Renderiza Scalar con configuracion avanzada (NUEVO vs practica 1).

    Cambia parametros y recarga (Ctrl+F5) para ver el efecto en vivo.
    """
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="API de Libros - Scalar",
        theme=Theme.KEPLER,                  # tema distinto a practica 1 (purple)
        layout=Layout.MODERN,                # MODERN o CLASSIC
        search_hot_key=SearchHotKey.K,       # Ctrl/Cmd + K
        hide_download_button=False,
        hide_models=False,
        dark_mode=True,
        scalar_proxy_url="https://proxy.scalar.com",
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
