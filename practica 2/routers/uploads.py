from fastapi import APIRouter, Depends, File, HTTPException, Path, UploadFile

from models import UploadResponse, ErrorResponse
from data import books_db
from auth import require_api_key

router = APIRouter(prefix="/books", tags=["Uploads"])


@router.post(
    "/{book_id}/cover",
    response_model=UploadResponse,
    summary="Subir portada del libro (multipart)",
    description="Sube una imagen de portada. Scalar mostrara un selector de archivo en la UI.",
    responses={
        200: {"description": "Portada subida"},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def upload_cover(
    book_id: int = Path(..., examples=[1]),
    file: UploadFile = File(..., description="Imagen JPG/PNG"),
    _: str = Depends(require_api_key),
):
    book = books_db.get(book_id)
    if not book:
        raise HTTPException(404, "Libro no encontrado")
    content = await file.read()
    cover_url = f"/static/covers/{book_id}_{file.filename}"
    book.cover_url = cover_url
    return UploadResponse(filename=file.filename, size_bytes=len(content), cover_url=cover_url)
