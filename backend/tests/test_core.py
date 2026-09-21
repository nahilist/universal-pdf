from app.core.config import Settings
from app.core.exceptions import PDFInvalidError, TranslationFailedError
from unittest.mock import patch

from app.translation.engine import TranslationEngine


def test_settings_default() -> None:
    settings = Settings()
    assert settings.app_name == "LinguaFlow API"
    assert settings.max_pages == 200


def test_custom_exceptions() -> None:
    exc = PDFInvalidError()
    assert exc.status_code == 400
    assert exc.error_code == "PDF_INVALID"

    exc_trans = TranslationFailedError("Custom error message")
    assert exc_trans.status_code == 500
    assert exc_trans.message == "Custom error message"


def test_translation_engine() -> None:
    engine = TranslationEngine()
    langs = engine.get_supported_languages()
    assert len(langs) > 0
    with patch("app.core.config.settings.translation_provider", "google"):
        with patch("app.translation.engine.GoogleTranslator.translate", return_value="नमस्ते"):
            res = engine.translate_text("Hello", "en", "hi")
        assert res == "नमस्ते"


def test_language_normalization() -> None:
    from app.translation.engine import normalize_language_code
    assert normalize_language_code("zh") == "zh-CN"
    assert normalize_language_code("ZH") == "zh-CN"
    assert normalize_language_code("he") == "iw"
    assert normalize_language_code("es") == "es"


def test_mock_translation_provider() -> None:
    engine = TranslationEngine()
    with patch("app.core.config.settings.translation_provider", "mock"):
        res = engine.translate_text("Test phrase", "en", "es")
        assert res == "[ES] Test phrase"


def test_safe_small_page_translation() -> None:
    import pymupdf
    engine = TranslationEngine()
    doc = pymupdf.open()
    page = doc.new_page(width=50, height=50)
    page.insert_text((5, 20), "Small")
    pdf_bytes = doc.tobytes()
    doc.close()

    with patch("app.core.config.settings.translation_provider", "mock"):
        result = engine.translate_pdf(pdf_bytes, "en", "es")
    assert isinstance(result, bytes)
    assert len(result) > 0

