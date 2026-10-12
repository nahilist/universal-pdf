import re
from urllib.parse import quote
from fastapi import APIRouter, Depends, Response
from app.core.auth import CurrentUser, get_current_user
from app.schemas.job import JobCreate, JobListResponse, JobResponse
from app.services.job_service import job_service

router = APIRouter()


@router.post("", response_model=JobResponse, status_code=201)
async def create_job(
    job_data: JobCreate,
    current_user: CurrentUser = Depends(get_current_user),
) -> JobResponse:
    # Return immediately; clients poll the job resource while a worker translates.
    user_id = current_user.id if current_user.is_authenticated else None
    return job_service.create_job(job_data, user_id=user_id)


@router.get("", response_model=JobListResponse)
async def list_jobs(
    current_user: CurrentUser = Depends(get_current_user),
) -> JobListResponse:
    user_id = current_user.id if current_user.is_authenticated else None
    return job_service.list_jobs(user_id=user_id)


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str) -> JobResponse:
    return job_service.get_job(job_id)


@router.delete("/{job_id}", status_code=204)
async def cancel_job(job_id: str) -> None:
    job_service.cancel_job(job_id)


@router.get("/{job_id}/download")
async def download_job(job_id: str) -> Response:
    job = job_service.get_job(job_id)
    pdf_content = job_service.get_translated_file(job_id)
    filename = f"translated_{job.filename}"
    ascii_filename = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename) or "translated.pdf"
    encoded_filename = quote(filename)
    content_disposition = (
        f'attachment; filename="{ascii_filename}"; filename*=UTF-8\'\'{encoded_filename}'
    )
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": content_disposition},
    )

