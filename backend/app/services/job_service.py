from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
from threading import RLock
import uuid
from typing import Dict, List, Optional

from app.core.exceptions import JobNotFoundError
from app.schemas.job import JobCreate, JobListResponse, JobResponse, JobStatus


class JobService:
    def __init__(self) -> None:
        self._jobs: Dict[str, JobResponse] = {}
        self._translated_files: Dict[str, bytes] = {}
        self._executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="pdf-translation")
        self._lock = RLock()

    def create_job(self, data: JobCreate) -> JobResponse:
        from app.api.v1.files import uploaded_files
        from app.translation.engine import translation_engine

        job_id = str(uuid.uuid4())
        content = uploaded_files.get(data.file_id) if data.file_id else None
        if content is None:
            raise JobNotFoundError("The uploaded PDF was not found. Please upload it again.")
        job = JobResponse(
            id=job_id,
            filename=data.filename,
            source_language=data.source_language,
            target_language=data.target_language,
            status=JobStatus.PENDING,
            progress=5,
            created_at=datetime.now(timezone.utc),
        )
        with self._lock:
            self._jobs[job_id] = job
        self._executor.submit(self._process_job, job_id, content, data.source_language, data.target_language)
        return job

    def _process_job(self, job_id: str, content: bytes, source: str, target: str) -> None:
        from app.translation.engine import translation_engine

        def update_progress(progress: int) -> None:
            with self._lock:
                job = self._jobs.get(job_id)
                if job:
                    job.progress = progress
                    job.status = JobStatus.TRANSLATING

        try:
            with self._lock:
                self._jobs[job_id].status = JobStatus.PROCESSING
                self._jobs[job_id].progress = 10
            translated = translation_engine.translate_pdf(content, source, target, update_progress)
            with self._lock:
                self._translated_files[job_id] = translated
                job = self._jobs[job_id]
                job.status = JobStatus.COMPLETED
                job.progress = 100
                job.completed_at = datetime.now(timezone.utc)
                job.download_url = f"/api/v1/jobs/{job_id}/download"
        except Exception as exc:
            with self._lock:
                job = self._jobs.get(job_id)
                if job:
                    job.status = JobStatus.FAILED
                    job.error_message = str(exc)
                    job.completed_at = datetime.now(timezone.utc)

    def get_translated_file(self, job_id: str) -> bytes:
        self.get_job(job_id)
        if job_id not in self._translated_files:
            raise JobNotFoundError("No translated PDF is available for this job.")
        return self._translated_files[job_id]

    def get_job(self, job_id: str) -> JobResponse:
        with self._lock:
            if job_id not in self._jobs:
                raise JobNotFoundError(f"Job with ID {job_id} not found.")
            return self._jobs[job_id]

    def list_jobs(self) -> JobListResponse:
        jobs = list(self._jobs.values())
        return JobListResponse(jobs=jobs, total=len(jobs))

    def cancel_job(self, job_id: str) -> bool:
        if job_id not in self._jobs:
            raise JobNotFoundError(f"Job with ID {job_id} not found.")
        del self._jobs[job_id]
        self._translated_files.pop(job_id, None)
        return True


job_service = JobService()
