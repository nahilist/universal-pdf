import io
import time
from fastapi.testclient import TestClient
import pytest
import pymupdf
from unittest.mock import patch
from app.main import app

client = TestClient(app)


def test_root_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root_ready() -> None:
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_v1_health() -> None:
    response = client.get("/api/v1/health/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_v1_languages() -> None:
    response = client.get("/api/v1/languages")
    assert response.status_code == 200
    languages = response.json()
    assert isinstance(languages, list)
    assert len(languages) > 0
    assert any(lang["code"] == "hi" for lang in languages)


def test_v1_job_lifecycle() -> None:
    document = pymupdf.open()
    page = document.new_page()
    page.insert_text((72, 72), "Hello")
    source_pdf = document.tobytes()
    document.close()
    upload_res = client.post(
        "/api/v1/files/upload",
        files={"file": ("sample.pdf", source_pdf, "application/pdf")},
    )

    # 1. Create Job
    payload = {
        "file_id": upload_res.json()["file_id"],
        "source_language": "en",
        "target_language": "hi",
        "filename": "sample.pdf",
    }
    with patch("app.translation.engine.TranslationEngine.translate_text", return_value="नमस्ते"):
        create_res = client.post("/api/v1/jobs", json=payload)
        assert create_res.status_code == 201
        job_data = create_res.json()
        job_id = job_data["id"]
        deadline = time.monotonic() + 5
        while job_data["status"] not in ("COMPLETED", "FAILED") and time.monotonic() < deadline:
            time.sleep(0.01)
            job_data = client.get(f"/api/v1/jobs/{job_id}").json()
    assert job_data["filename"] == "sample.pdf"
    assert job_data["status"] == "COMPLETED"

    # 2. Get Job Details
    get_res = client.get(f"/api/v1/jobs/{job_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == job_id

    # 3. List Jobs
    list_res = client.get("/api/v1/jobs")
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # 4. Download Job PDF
    dl_res = client.get(f"/api/v1/jobs/{job_id}/download")
    assert dl_res.status_code == 200
    assert dl_res.headers["content-type"] == "application/pdf"

    # 5. Cancel Job
    del_res = client.delete(f"/api/v1/jobs/{job_id}")
    assert del_res.status_code == 204

    # 6. Verify Job Not Found after deletion
    nf_res = client.get(f"/api/v1/jobs/{job_id}")
    assert nf_res.status_code == 404
    assert nf_res.json()["error_code"] == "JOB_NOT_FOUND"


def test_v1_file_upload() -> None:
    # Valid PDF file upload
    fake_pdf = io.BytesIO(b"%PDF-1.4 mock content")
    response = client.post(
        "/api/v1/files/upload",
        files={"file": ("test.pdf", fake_pdf, "application/pdf")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.pdf"
    assert "file_id" in data

    # Invalid file extension upload
    fake_txt = io.BytesIO(b"hello world")
    invalid_res = client.post(
        "/api/v1/files/upload",
        files={"file": ("test.txt", fake_txt, "text/plain")},
    )
    assert invalid_res.status_code == 400
    assert invalid_res.json()["error_code"] == "PDF_INVALID"
