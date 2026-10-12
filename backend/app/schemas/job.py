from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class JobStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    OCR_PROCESSING = "OCR_PROCESSING"
    TRANSLATING = "TRANSLATING"
    RECONSTRUCTING = "RECONSTRUCTING"
    VALIDATING = "VALIDATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class JobCreate(BaseModel):
    file_id: Optional[str] = Field(default=None, description="Uploaded PDF ID")
    source_language: str = Field(default="auto", description="Source language ISO code or 'auto'")
    target_language: str = Field(..., description="Target language ISO code")
    filename: str = Field(..., description="Original filename of the PDF")


class JobResponse(BaseModel):
    id: str = Field(..., description="Unique job ID")
    filename: str = Field(..., description="Original filename")
    source_language: str
    target_language: str
    status: JobStatus
    progress: int = Field(default=0, ge=0, le=100)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    download_url: Optional[str] = None
    user_id: Optional[str] = Field(default=None, description="Clerk user ID")


class JobListResponse(BaseModel):
    jobs: List[JobResponse]
    total: int


class LanguageInfo(BaseModel):
    code: str
    name: str
    native_name: str
    popular: bool = False


class FileUploadResponse(BaseModel):
    file_id: str
    filename: str
    size_bytes: int
    page_count: int
    message: str = "File uploaded successfully"
