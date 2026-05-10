# Practica 2 - API de Libros con FastAPI + Scalar

Documentacion interactiva de una API REST en Python (FastAPI) usando Scalar.
**Complementa la practica 1** (NestJS) cubriendo features de Scalar no vistas alli:
auth, file uploads, multiples ejemplos, endpoints deprecados, config UI avanzada.

> Para profesores: leer `GUIA_INSTRUCTOR.md` (recorrido paso a paso, 30-45 min).

---

## Requisitos

- Python 3.10+
- pip
- **Scalar Desktop Client** (descargar de <https://scalar.com/download>) — se usa en el ejercicio practico

Verifica:

```powershell
python --version
pip --version
```

---

## Instalacion (3 comandos)

```powershell
cd "practica 2"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

---

## Arrancar el servidor

```powershell
python main.py
```

Salida esperada:

```text
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

---

## URLs

| URL | Que es |
| --- | --- |
| <http://localhost:8000/scalar> | **UI Scalar** (la que vamos a demostrar) |
| <http://localhost:8000/docs> | Swagger UI nativo (comparar) |
| <http://localhost:8000/openapi.json> | Spec OpenAPI cruda |
| <http://localhost:8000/books> | Endpoint API real |

---

## Credenciales demo (para probar auth en la UI)

| Tipo | Header | Valor |
| --- | --- | --- |
| API Key | `X-API-Key` | `demo-key-123` |
| Bearer | `Authorization: Bearer ...` | `demo-token-abc` |

En Scalar: clic en el **candado** arriba a la derecha -> pegar valores -> "Authorize".

---

## Endpoints

### Libros (mock en memoria)

| Metodo | Ruta | Auth |
| --- | --- | --- |
| GET | `/books?genre=&limit=&offset=` | publico |
| GET | `/books/{id}` | publico |
| POST | `/books` | API Key |
| PUT | `/books/{id}` | Bearer |
| DELETE | `/books/{id}` | Bearer |
| GET | `/books/legacy/all` | publico (**deprecado**) |

### Uploads

| Metodo | Ruta | Auth |
| --- | --- | --- |
| POST | `/books/{id}/cover` (multipart) | API Key |

---

## Estructura

```text
practica 2/
├── main.py              # FastAPI + Scalar config (theme, layout, hotkey...)
├── models.py            # Pydantic + Enum + multiples examples
├── data.py              # Mock DB en memoria
├── auth.py              # API Key y Bearer
├── routers/
│   ├── books.py         # CRUD + deprecated + headers + auth
│   └── uploads.py       # multipart UploadFile
├── requirements.txt
├── README.md            # este archivo
└── GUIA_INSTRUCTOR.md   # guion para la clase
```

---

## Que cubre que la practica 1 NO

- Autenticacion API Key + Bearer (boton Authorize)
- Multiples ejemplos por endpoint (dropdown)
- Subida de archivos multipart
- Endpoint `deprecated=True` (banner)
- Enum -> dropdown automatico
- Headers de respuesta documentados (rate-limit)
- Config Scalar: `theme`, `layout`, `search_hot_key`, `dark_mode`, `hide_models`
- Comparar Swagger UI vs Scalar lado a lado
- Free tier vs paid de Scalar Cloud
- **Scalar Desktop Client** (cliente API offline)

---

## Ejercicio en clase (resumen para estudiantes)

Tienen 6-8 min:

1. Agregar un **tercer ejemplo** (genero `biography`) en `BookCreate` dentro de `models.py`.
2. Abrir **Scalar Desktop**, importar `http://localhost:8000/openapi.json`, cargar API Key `demo-key-123`.
3. Desde Desktop, hacer `POST /books` con su ejemplo nuevo. Verificar `201` y luego `GET /books`.

Detalle completo en `GUIA_INSTRUCTOR.md` seccion 7.
