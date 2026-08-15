from fastapi import APIRouter, Response
from app.schemas.job import JobCreate, JobListResponse, JobResponse
from app.services.job_service import job_service

router = APIRouter()


@router.post("", response_model=JobResponse, status_code=201)
async def create_job(job_data: JobCreate) -> JobResponse:
    # Return immediately; clients poll the job resource while a worker translates.
    return job_service.create_job(job_data)


@router.get("", response_model=JobListResponse)
async def list_jobs() -> JobListResponse:
    return job_service.list_jobs()


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
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="translated_{job.filename}"'},
    )
