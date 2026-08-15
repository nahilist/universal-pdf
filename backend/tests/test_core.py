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
    with patch("app.translation.engine.GoogleTranslator.translate", return_value="नमस्ते"):
        res = engine.translate_text("Hello", "en", "hi")
    assert res == "नमस्ते"
