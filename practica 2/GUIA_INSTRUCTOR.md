# Guia del Instructor - Practica 2 (FastAPI + Scalar)

> Tiempo objetivo: **30-45 min**. Audiencia: misma de practica 1.
> Esta practica **complementa** la 1 enseñando funcionalidades de Scalar que no se tocaron alla.

---

## 0. Diferencias clave vs Practica 1 (mencionar al inicio, 2 min)

| Aspecto | Practica 1 (NestJS) | Practica 2 (FastAPI) |
| --- | --- | --- |
| Lenguaje | TypeScript | Python |
| Framework | NestJS | FastAPI |
| OpenAPI generado por | `@nestjs/swagger` (decoradores extra) | FastAPI **nativo** (lee type hints + Pydantic) |
| Scalar package | `@scalar/nestjs-api-reference` | `scalar-fastapi` |
| Datos | SQLite + TypeORM | **Mock en memoria** |
| Tema | `purple` | `kepler` (espacial) |
| Foco | Documentacion basica + Cloudflare + Cloud | **Auth, uploads, ejemplos, deprecated, config UI avanzada** |

**Mensaje central:** FastAPI demuestra que Scalar funciona con cualquier framework que produzca un `openapi.json`. Los conceptos son los mismos; cambia la sintaxis del wrapper.

---

## 1. Instalacion (5 min)

```powershell
cd "practica 2"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

URLs:

- `http://localhost:8000/scalar` -> **UI Scalar** (foco de la clase)
- `http://localhost:8000/docs` -> Swagger UI nativo de FastAPI (comparar)
- `http://localhost:8000/openapi.json` -> el JSON crudo

**Punto pedagogico:** abre `/scalar` y `/docs` lado a lado. Misma data, dos renderers. Scalar gana en estetica, busqueda, code-gen.

---

## 2. Recorrido del codigo (8 min)

### `models.py` - Pydantic + Enum

- Enum `Genre` -> Scalar lo renderiza como **dropdown** automaticamente.
- `Field(..., examples=[...])` -> autocompleta el "Try it" con valor real.
- `model_config.json_schema_extra.examples` en `BookCreate` -> **multiples ejemplos** seleccionables en la UI (NUEVO vs practica 1).

### `auth.py` - Dos esquemas de seguridad

- `APIKeyHeader(name="X-API-Key")` -> en Scalar aparece **candado** + boton "Authorize" donde pegas la key.
- `HTTPBearer()` -> mismo pero pide `Authorization: Bearer <token>`.
- Credenciales demo: `demo-key-123` / `demo-token-abc` (ya documentadas en el `description` del API).

### `routers/books.py` - features Scalar destacadas

| Decorador / param | Que muestra Scalar |
| --- | --- |
| `responses={401: {"model": ErrorResponse}}` | Tab "401" en la UI con schema del error |
| `Depends(require_api_key)` | Candado y selector de auth |
| `response.headers["X-RateLimit-..."]` | Headers que aparecen en la respuesta de prueba |
| `deprecated=True` en `legacy/all` | **Banner amarillo** "Deprecated" |
| `Path(..., examples=[1])` | Autocompleta el parametro |

### `routers/uploads.py` - multipart

- `UploadFile = File(...)` -> Scalar muestra un **selector de archivo** (input type=file) en lugar de un textarea JSON. Demostrar subiendo cualquier imagen.

### `main.py` - configuracion Scalar avanzada (lo mas nuevo)

```python
get_scalar_api_reference(
    openapi_url=app.openapi_url,
    theme=Theme.KEPLER,            # 12+ temas: KEPLER, MARS, MOON, SATURN, DEEP_SPACE, ...
    layout=Layout.MODERN,          # MODERN o CLASSIC
    search_hot_key=SearchHotKey.K, # Ctrl/Cmd+K
    dark_mode=True,
    hide_models=False,
    hide_download_button=False,
    scalar_proxy_url="https://proxy.scalar.com",  # evita CORS al hacer "Try it"
)
```

**Demo en vivo:** cambia `Theme.KEPLER` por `Theme.MARS`, recarga, "miren como cambia toda la paleta sin tocar el codigo de la API".

---

## 3. Demo guiada en la UI Scalar (15 min)

Abrir `http://localhost:8000/scalar` y mostrar **en este orden**:

### a) Markdown rico

La descripcion principal renderiza headings, tablas y listas. Compara con la descripcion plana de practica 1.

### b) Busqueda con hotkey

Presionar **Ctrl + K** -> aparece buscador. Escribir "cover" -> salta al endpoint de upload. (Practica 1 no configuro hotkey.)

### c) Authorize

Clic en candado arriba a la derecha -> pegar `demo-key-123` y `demo-token-abc`. Ahora todos los endpoints autenticados se prueban sin volver a escribir credenciales.

### d) Multiples ejemplos

Ir a `POST /books` -> en el panel "Body", **dropdown** con "Novela clasica" y "Sci-Fi moderno". Cambiar entre ellos prellena el body.

### e) Probar POST con auth

Ejecutar `POST /books` con la key cargada -> 201. Sin key -> 401 (mostrar tab 401 con el schema `ErrorResponse`).

### f) Endpoint deprecado

Scrollear a `GET /books/legacy/all` -> banner amarillo "Deprecated". Mostrar como Scalar lo separa visualmente.

### g) File upload

`POST /books/{book_id}/cover` -> selector de archivo (no se ve igual en Swagger UI). Subir cualquier imagen, ver respuesta con `cover_url`.

### h) Headers de respuesta

Ejecutar `GET /books` -> inspeccionar tab "Response Headers": aparecen `X-Total-Count`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`.

### i) Code Snippets (igual que practica 1, pero recordar)

Panel derecho -> elegir Python `requests` o `curl`. Mostrar como ya inyecta el header de auth.

### j) Multi-server

Dropdown arriba: `http://localhost:8000` vs `https://api.libros.example.com`. Util para apuntar la prueba a dev/prod.

### k) Cambiar tema en caliente

Editar `Theme.KEPLER` -> `Theme.MARS` -> guardar -> uvicorn recarga -> F5 en el browser. Misma API, otra estetica.

---

## 4. Scalar Cloud y Free Tier (5 min)

> Recordar: **practica 1 ya enseño** import a `dashboard.scalar.com` y `sandbox.scalar.com`. Aqui solo aclaramos limites.

### Free tier (gratis hoy)

- Subir 1 OpenAPI spec por workspace personal.
- Hosted docs publicos (URL `*.apidocs.scalar.com`).
- Sandbox sin login (`sandbox.scalar.com`).
- Versionado basico (subir v1.0, v1.1...).
- Cliente API offline desktop.

### Paid (tier Team/Pro)

- Workspaces de equipo, colaboracion multi-usuario.
- Docs **privados** (auth para verlos).
- Custom domain (`docs.tu-empresa.com`).
- SSO, roles, audit log.
- Sync automatico desde GitHub repo.

**Demo opcional:** descargar `openapi.json` de esta API, subirlo a `sandbox.scalar.com`, mostrar URL publica generada.

---

## 5. Cierre - puntos a remarcar (2 min)

1. Scalar **no depende del lenguaje**: cualquier OpenAPI 3.x sirve.
2. La calidad de la doc depende de los **schemas + ejemplos + responses**, no del wrapper.
3. Auth se documenta una vez en el spec y la UI maneja todo.
4. `theme`, `layout`, `searchHotKey`, `darkMode` son cambios de UNA linea con impacto grande.
5. Free tier alcanza para proyectos de clase y portafolio.

---

## 6. Troubleshooting rapido

| Sintoma | Causa | Fix |
| --- | --- | --- |
| `ModuleNotFoundError: scalar_fastapi` | venv no activado | `.\.venv\Scripts\activate` |
| `/scalar` carga blanco | Bloqueador CDN o sin internet | El JS de Scalar viene de jsdelivr; revisar consola |
| "Try it" da CORS error | Endpoint externo sin CORS | El `scalar_proxy_url` ya esta puesto, deberia funcionar |
| 401 aunque cargue Authorize | Pegaste con espacios | Re-pegar `demo-key-123` exacto |
| Puerto 8000 ocupado | Otro proceso | Cambiar a `port=8001` en `main.py` |

---

## 7. Ejercicio en clase para estudiantes (8 min)

> Objetivo: que **apliquen** lo visto y usen el **Scalar Desktop Client** (requisito de la practica).
> Tarea pequenia pero cubre 3 cosas: editar codigo, recargar Scalar, usar Desktop.

### Enunciado para los estudiantes (leer en voz alta)

> "Tienen 6 minutos. Hagan estos 3 pasos:
>
> 1. En `models.py`, agreguen un **tercer ejemplo** al `BookCreate` (categoria libre, ej: biografia).
> 2. Abran **Scalar Desktop Client**, importen la API desde `http://localhost:8000/openapi.json` y carguen la API Key `demo-key-123`.
> 3. Desde Desktop, ejecuten `POST /books` usando su ejemplo nuevo. Verifiquen 201 y luego `GET /books` para ver el libro creado."

### Pasos detallados (lo que ellos van a hacer)

**Paso 1 — Editar `models.py`** (2 min)
Agregar dentro del array `examples` de `BookCreate.model_config`:

```python
{
    "summary": "Biografia",
    "value": {
        "title": "Cartas a un joven poeta",
        "author": "Rainer Maria Rilke",
        "year": 1929,
        "genre": "biography",
        "pages": 96,
    },
},
```

Uvicorn recarga solo (esta corriendo con `reload=True`). Refrescar `/scalar` -> el dropdown ahora tiene **3 opciones**.

**Paso 2 — Importar en Scalar Desktop** (2 min)

- Abrir el Desktop Client (ya descargado como requisito).
- Boton **"Import"** (o `File > Import OpenAPI`).
- Pegar URL: `http://localhost:8000/openapi.json` -> Import.
- En el panel izquierdo aparecen los endpoints agrupados por tag (Libros, Uploads).
- Ir a la seccion **Authentication** / candado -> elegir `APIKeyHeader` -> pegar `demo-key-123`.

**Paso 3 — Crear libro desde Desktop** (2 min)

- Seleccionar `POST /books`.
- En el body, dropdown de ejemplos -> elegir su nuevo "Biografia".
- Send -> respuesta `201` con `id` autogenerado.
- Ejecutar `GET /books` -> el libro nuevo aparece al final del array.

### Resultado esperado (lo que tu vas a verificar)

| Verificacion | Esperado |
| --- | --- |
| Dropdown en `/scalar` body de POST /books | 3 ejemplos (era 2) |
| Desktop Client conectado | Endpoints agrupados, candado configurado |
| Status del POST desde Desktop | `201 Created` con id 6+ |
| GET /books muestra el nuevo libro | Si, al final |

### Errores tipicos a esperar (preparate)

| Error | Causa | Fix rapido |
| --- | --- | --- |
| Sintaxis: falta coma despues del `}` | Pegaron mal el ejemplo | Mostrar trailing comma |
| `422 Unprocessable Entity` | Pusieron `genre: "biografia"` (espanol) en vez de `biography` | Recordar enum tiene 5 valores fijos |
| Desktop dice "Cannot fetch" | Server no corriendo | `python main.py` |
| Desktop no muestra candado | Olvidaron seleccionar el scheme | Sidebar -> Auth -> APIKey |
| 401 desde Desktop con key cargada | Selecciono el scheme equivocado (Bearer en vez de APIKey) | Cambiar al de header X-API-Key |

### Por que este ejercicio

- **Demuestra atencion** a 3 conceptos: ejemplos multiples, hot-reload de FastAPI, esquemas de auth.
- **Cumple el requisito** de Scalar Desktop sin meter cosas nuevas.
- **No requiere escribir codigo nuevo desde cero** — solo copiar/adaptar un patron existente, asi que cabe en 6-8 min incluso con audiencia mixta.

---

## 8. Scalar Desktop Client (mencionar en seccion de Cloud, 2 min extra)

Posicionarlo asi: "Lo que vimos en `/scalar` (browser) es el render web. **Desktop Client** es la herramienta para **probar y construir** sobre cualquier API documentada con OpenAPI — es el equivalente Scalar de Postman/Insomnia, pero gratis y open-source."

Diferencias clave Browser UI vs Desktop:

| Caracteristica | UI web (`/scalar`) | Desktop Client |
| --- | --- | --- |
| Para que sirve | Documentacion publica | Cliente de pruebas / coleccion |
| Funciona offline | No | Si (despues de import) |
| Guarda historial de requests | No | Si |
| Multiples environments (dev/prod) | Solo dropdown de servers | Si, con variables propias |
| Compartir colecciones con equipo | No directamente | Si (export JSON) |

**Workflow real que demuestra valor:** un dev que mantiene la API usa `/scalar` para mostrarla a clientes; usa Desktop para probarla mientras la construye.

---

## 9. Tarea adicional (post-clase, opcional)

1. Agregar endpoint `GET /authors` con su propio tag y un ejemplo.
2. Cambiar a `Layout.CLASSIC` y comparar visualmente.
3. Probar 3 temas distintos (`MARS`, `SATURN`, `DEEP_SPACE`) y elegir favorito.
4. Subir el spec a `dashboard.scalar.com` (free tier) y compartir el link publico.
5. Crear una coleccion en Desktop con 5 requests guardados y exportarla a JSON.
