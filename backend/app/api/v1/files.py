import uuid
from fastapi import APIRouter, File, UploadFile
import pymupdf

from app.core.config import settings
from app.core.exceptions import PDFInvalidError, PDFPasswordProtectedError, PDFTooLargeError
from app.schemas.job import FileUploadResponse

router = APIRouter()
uploaded_files: dict[str, bytes] = {}


@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)) -> FileUploadResponse:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise PDFInvalidError("File must be a valid PDF format.")

    content = await file.read()
    if len(content) > settings.max_upload_size:
        raise PDFTooLargeError("File size exceeds the maximum upload limit.")

    try:
        document = pymupdf.open(stream=content, filetype="pdf")
        if getattr(document, "is_encrypted", False) or getattr(document, "needs_pass", False):
            document.close()
            raise PDFPasswordProtectedError("Password-protected PDFs are not supported.")
        page_count = len(document)
        document.close()
    except (PDFInvalidError, PDFPasswordProtectedError):
        raise
    except Exception as exc:
        raise PDFInvalidError("The uploaded file is corrupted or is not a PDF.") from exc

    if page_count == 0:
        raise PDFInvalidError("The uploaded PDF does not contain any pages.")
    if page_count > settings.max_pages:
        raise PDFTooLargeError(f"PDF exceeds the maximum of {settings.max_pages} pages.")

    file_id = str(uuid.uuid4())
    if len(uploaded_files) >= 100:
        oldest_id = next(iter(uploaded_files))
        uploaded_files.pop(oldest_id, None)
    uploaded_files[file_id] = content
    return FileUploadResponse(
        file_id=file_id,
        filename=file.filename,
        size_bytes=len(content),
        page_count=page_count,
        message="File uploaded and verified successfully.",
    )
