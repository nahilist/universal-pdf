from html import escape
from typing import Callable, List, Optional

import pymupdf
from deep_translator import GoogleTranslator

from app.core.exceptions import PDFInvalidError, TranslationFailedError
from app.schemas.job import LanguageInfo

SUPPORTED_LANGUAGES: List[LanguageInfo] = [
    LanguageInfo(code="en", name="English", native_name="English", popular=True),
    LanguageInfo(code="hi", name="Hindi", native_name="हिन्दी", popular=True),
    LanguageInfo(code="es", name="Spanish", native_name="Español", popular=True),
    LanguageInfo(code="fr", name="French", native_name="Français", popular=True),
    LanguageInfo(code="de", name="German", native_name="Deutsch", popular=True),
    LanguageInfo(code="zh", name="Chinese (Simplified)", native_name="中文", popular=True),
    LanguageInfo(code="ja", name="Japanese", native_name="日本語", popular=True),
    LanguageInfo(code="ar", name="Arabic", native_name="العربية", popular=True),
    LanguageInfo(code="pt", name="Portuguese", native_name="Português", popular=False),
    LanguageInfo(code="ru", name="Russian", native_name="Русский", popular=False),
    LanguageInfo(code="it", name="Italian", native_name="Italiano", popular=False),
    LanguageInfo(code="ko", name="Korean", native_name="한국어", popular=False),
    LanguageInfo(code="nl", name="Dutch", native_name="Nederlands", popular=False),
    LanguageInfo(code="tr", name="Turkish", native_name="Türkçe", popular=False),
]


class TranslationEngine:
    def get_supported_languages(self) -> List[LanguageInfo]:
        return SUPPORTED_LANGUAGES

    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        if source_lang == target_lang:
            return text
        try:
            source = "auto" if source_lang == "auto" else source_lang
            return GoogleTranslator(source=source, target=target_lang).translate(text)
        except Exception as exc:
            raise TranslationFailedError(f"Translation service failed: {exc}") from exc

    def translate_pdf(
        self,
        content: bytes,
        source_lang: str,
        target_lang: str,
        progress_callback: Optional[Callable[[int], None]] = None,
    ) -> bytes:
        try:
            source_document = pymupdf.open(stream=content, filetype="pdf")
        except Exception as exc:
            raise PDFInvalidError("The uploaded PDF is corrupted or invalid.") from exc

        output = pymupdf.open()
        found_text = False

        try:
            page_count = max(len(source_document), 1)
            for page_number, source_page in enumerate(source_document, start=1):
                page = output.new_page(width=source_page.rect.width, height=source_page.rect.height)
                text = source_page.get_text("text").strip()
                if not text:
                    continue

                found_text = True
                chunks = [text[index:index + 4000] for index in range(0, len(text), 4000)]
                translated = "\n\n".join(
                    self.translate_text(chunk, source_lang, target_lang) for chunk in chunks
                )
                html = (
                    "<div style='font-family: sans-serif; font-size: 11pt; line-height: 1.4;'>"
                    + escape(translated).replace("\n", "<br>")
                    + "</div>"
                )
                page.insert_htmlbox(page.rect + (36, 36, -36, -36), html)
                if progress_callback:
                    # Translation is the expensive phase. Reserve the final 10%
                    # for PDF reconstruction and serialization.
                    progress_callback(10 + int(page_number / page_count * 80))

            if not found_text:
                raise TranslationFailedError(
                    "No selectable text was found. Scanned PDFs require OCR, which is not configured yet."
                )
            if progress_callback:
                progress_callback(95)
            return output.tobytes(garbage=4, deflate=True)
        finally:
            output.close()
            source_document.close()


translation_engine = TranslationEngine()
