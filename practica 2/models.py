from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class Genre(str, Enum):
    """Generos literarios soportados (enum -> dropdown en Scalar)."""
    fiction = "fiction"
    nonfiction = "nonfiction"
    fantasy = "fantasy"
    scifi = "scifi"
    biography = "biography"


class Book(BaseModel):
    id: int = Field(..., description="ID unico del libro", examples=[1])
    title: str = Field(..., description="Titulo", examples=["Cien anos de soledad"])
    author: str = Field(..., description="Autor", examples=["Gabriel Garcia Marquez"])
    year: int = Field(..., ge=1000, le=2100, description="Anio de publicacion", examples=[1967])
    genre: Genre = Field(..., description="Genero literario")
    pages: int = Field(..., gt=0, examples=[471])
    cover_url: Optional[str] = Field(None, description="URL de portada subida")


class BookCreate(BaseModel):
    title: str = Field(..., examples=["1984"])
    author: str = Field(..., examples=["George Orwell"])
    year: int = Field(..., examples=[1949])
    genre: Genre = Field(..., examples=[Genre.scifi])
    pages: int = Field(..., examples=[328])

    # Nota: para mostrar MULTIPLES ejemplos como tabs/dropdown en Scalar usamos
    # `openapi_examples=` en `Body(...)` del endpoint (ver routers/books.py).
    # Aqui solo dejamos un example simple por campo para autocompletar el body por defecto.


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    year: Optional[int] = None
    genre: Optional[Genre] = None
    pages: Optional[int] = None


class ErrorResponse(BaseModel):
    detail: str = Field(..., examples=["Libro no encontrado"])


class UploadResponse(BaseModel):
    filename: str
    size_bytes: int
    cover_url: str
