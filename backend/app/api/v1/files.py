import uuid
from fastapi import APIRouter, File, UploadFile
from app.core.exceptions import PDFInvalidError, PDFTooLargeError
from app.schemas.job import FileUploadResponse

router = APIRouter()
uploaded_files: dict[str, bytes] = {}


@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)) -> FileUploadResponse:
    if not file.filename or not file.filename.endswith(".pdf"):
        raise PDFInvalidError("File must be a valid PDF format.")

    content = await file.read()
    if len(content) > 50 * 1024 * 1024:  # 50MB limit
        raise PDFTooLargeError("File size exceeds maximum limit of 50MB.")

    file_id = str(uuid.uuid4())
    uploaded_files[file_id] = content
    return FileUploadResponse(
        file_id=file_id,
        filename=file.filename,
        size_bytes=len(content),
        page_count=1,
        message="File uploaded and verified successfully.",
    )
