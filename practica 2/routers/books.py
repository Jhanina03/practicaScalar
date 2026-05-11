from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, Response, status
from typing import Optional

from models import Book, BookCreate, BookUpdate, ErrorResponse, Genre
from data import books_db, get_next_id
from auth import require_api_key, require_bearer

router = APIRouter(prefix="/books", tags=["Libros"])


@router.get(
    "",
    response_model=list[Book],
    summary="Listar libros",
    description="Lista todos los libros. Soporta filtro por **genero** y paginacion.",
    responses={200: {"description": "Lista paginada de libros"}},
)
def list_books(
    response: Response,
    genre: Optional[Genre] = Query(None, description="Filtrar por genero"),
    limit: int = Query(10, ge=1, le=100, description="Maximo resultados"),
    offset: int = Query(0, ge=0),
):
    items = list(books_db.values())
    if genre:
        items = [b for b in items if b.genre == genre]
    total = len(items)
    page = items[offset : offset + limit]
    response.headers["X-Total-Count"] = str(total)
    response.headers["X-RateLimit-Limit"] = "100"
    response.headers["X-RateLimit-Remaining"] = "99"
    return page


@router.get(
    "/{book_id}",
    response_model=Book,
    summary="Obtener libro por ID",
    responses={
        200: {"description": "Libro encontrado"},
        404: {"model": ErrorResponse, "description": "Libro no existe"},
    },
)
def get_book(book_id: int = Path(..., description="ID del libro", examples=[1])):
    book = books_db.get(book_id)
    if not book:
        raise HTTPException(404, "Libro no encontrado")
    return book


@router.post(
    "",
    response_model=Book,
    status_code=status.HTTP_201_CREATED,
    summary="Crear libro (requiere API Key)",
    description="Crea un libro nuevo. **Requiere autenticacion** via header `X-API-Key`.",
    responses={
        201: {"description": "Libro creado"},
        401: {"model": ErrorResponse, "description": "API key invalida"},
    },
)
def create_book(
    payload: BookCreate = Body(
        ...,
        openapi_examples={
            "novela_clasica": {
                "summary": "Novela clasica",
                "description": "Ejemplo de novela clasica espaniola",
                "value": {
                    "title": "El Quijote",
                    "author": "Miguel de Cervantes",
                    "year": 1605,
                    "genre": "fiction",
                    "pages": 863,
                },
            },
            "scifi_moderno": {
                "summary": "Sci-Fi moderno",
                "value": {
                    "title": "Project Hail Mary",
                    "author": "Andy Weir",
                    "year": 2021,
                    "genre": "scifi",
                    "pages": 476,
                },
            },
        },
    ),
    _: str = Depends(require_api_key),
):
    new_id = get_next_id()
    book = Book(id=new_id, **payload.model_dump())
    books_db[new_id] = book
    return book


@router.put(
    "/{book_id}",
    response_model=Book,
    summary="Actualizar libro (requiere Bearer Token)",
    description="Actualiza campos de un libro. **Requiere `Authorization: Bearer <token>`**.",
    responses={
        200: {"description": "Libro actualizado"},
        401: {"model": ErrorResponse, "description": "Token invalido"},
        404: {"model": ErrorResponse, "description": "Libro no existe"},
    },
)
def update_book(book_id: int, payload: BookUpdate, _: str = Depends(require_bearer)):
    book = books_db.get(book_id)
    if not book:
        raise HTTPException(404, "Libro no encontrado")
    updated = book.model_copy(update=payload.model_dump(exclude_unset=True))
    books_db[book_id] = updated
    return updated


@router.delete(
    "/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar libro (requiere Bearer Token)",
    responses={
        204: {"description": "Eliminado"},
        401: {"model": ErrorResponse, "description": "Token invalido"},
        404: {"model": ErrorResponse, "description": "No existe"},
    },
)
def delete_book(book_id: int, _: str = Depends(require_bearer)):
    if book_id not in books_db:
        raise HTTPException(404, "Libro no encontrado")
    del books_db[book_id]
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/legacy/all",
    response_model=list[Book],
    deprecated=True,
    summary="[DEPRECADO] Listar todo sin paginacion",
    description="Endpoint viejo sin paginacion. Usa `GET /books` en su lugar.",
)
def legacy_all():
    return list(books_db.values())
