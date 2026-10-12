import time
from html import escape
from typing import Callable, List, Optional, cast

import pymupdf
import requests
from deep_translator import GoogleTranslator, MyMemoryTranslator
from deep_translator.exceptions import TooManyRequests

from app.core.config import settings
from app.core.exceptions import PDFInvalidError, TranslationFailedError, TranslationRateLimitError
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

LANGUAGE_CODE_MAP: dict[str, str] = {
    "zh": "zh-CN",
    "zh-cn": "zh-CN",
    "zh-tw": "zh-TW",
    "he": "iw",
    "jv": "jw",
}

MYMEMORY_LANGUAGE_MAP: dict[str, str] = {
    "en": "en-GB",
    "hi": "hi-IN",
    "es": "es-ES",
    "fr": "fr-FR",
    "de": "de-DE",
    "zh": "zh-CN",
    "zh-cn": "zh-CN",
    "zh-tw": "zh-TW",
    "ja": "ja-JP",
    "ar": "ar-SA",
    "pt": "pt-PT",
    "ru": "ru-RU",
    "it": "it-IT",
    "ko": "ko-KR",
    "nl": "nl-NL",
    "tr": "tr-TR",
}


def normalize_language_code(code: str) -> str:
    cleaned = code.strip().lower()
    return LANGUAGE_CODE_MAP.get(cleaned, cleaned)


class TranslationEngine:
    def get_supported_languages(self) -> List[LanguageInfo]:
        return SUPPORTED_LANGUAGES

    def _chunk_text(self, text: str, max_chars: int = 450) -> List[str]:
        paragraphs = text.split("\n")
        chunks: List[str] = []
        current: List[str] = []
        current_len = 0
        for p in paragraphs:
            p = p.strip()
            if not p:
                continue
            if len(p) > max_chars:
                words = p.split(" ")
                line: List[str] = []
                line_len = 0
                for w in words:
                    if line_len + len(w) + 1 > max_chars:
                        if line:
                            chunks.append(" ".join(line))
                        line = [w]
                        line_len = len(w)
                    else:
                        line.append(w)
                        line_len += len(w) + 1
                if line:
                    chunks.append(" ".join(line))
            elif current_len + len(p) + 1 > max_chars:
                if current:
                    chunks.append("\n".join(current))
                current = [p]
                current_len = len(p)
            else:
                current.append(p)
                current_len += len(p) + 1
        if current:
            chunks.append("\n".join(current))
        return chunks if chunks else [text[:max_chars]]

    def _translate_google_client(self, text: str, source_lang: str, target_lang: str) -> Optional[str]:
        clean_text = text.strip()
        if not clean_text:
            return text

        url = "https://clients5.google.com/translate_a/t"
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            ),
        }
        chunks = self._chunk_text(clean_text, max_chars=800)
        translated_parts: List[str] = []

        for index, chunk in enumerate(chunks):
            if index > 0:
                time.sleep(0.05)
            params = {
                "client": "dict-chrome-ex",
                "sl": source_lang,
                "tl": target_lang,
                "q": chunk,
            }
            try:
                resp = requests.get(url, params=params, headers=headers, timeout=10)
                if resp.status_code != 200:
                    return None
                data = resp.json()
                if isinstance(data, list):
                    if len(data) > 0 and isinstance(data[0], list):
                        translated_parts.append(
                            "".join([
                                item[0]
                                for item in data
                                if isinstance(item, list) and item and isinstance(item[0], str)
                            ])
                        )
                    elif len(data) > 0 and isinstance(data[0], str):
                        translated_parts.append("".join(data))
                    else:
                        return None
                elif isinstance(data, str):
                    translated_parts.append(data)
                else:
                    return None
            except Exception:
                return None

        return "\n\n".join(translated_parts)

    def _translate_mymemory(self, text: str, source_lang: str, target_lang: str) -> str:
        clean_text = text.strip()
        if not clean_text:
            return text

        src_mem = MYMEMORY_LANGUAGE_MAP.get(source_lang.lower(), "en-GB")
        tgt_mem = MYMEMORY_LANGUAGE_MAP.get(target_lang.lower(), target_lang)

        chunks = self._chunk_text(clean_text, max_chars=450)
        translated_parts: List[str] = []

        for index, chunk in enumerate(chunks):
            if index > 0:
                time.sleep(0.1)
            try:
                part = MyMemoryTranslator(source=src_mem, target=tgt_mem).translate(chunk)
                translated_parts.append(cast(str, part if part is not None else chunk))
            except TooManyRequests as exc:
                raise TranslationRateLimitError("Translation service rate limit reached. Please wait a moment.") from exc
            except Exception as exc:
                err_msg = str(exc).lower()
                if "too many requests" in err_msg or "rate limit" in err_msg:
                    raise TranslationRateLimitError("Translation service rate limit reached. Please wait a moment.") from exc
                raise TranslationFailedError(f"Translation service failed: {exc}") from exc

        return "\n\n".join(translated_parts)

    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        if source_lang == target_lang:
            return text

        provider = getattr(settings, "translation_provider", "google").lower()
        if provider == "mock":
            return f"[{target_lang.upper()}] {text}"

        normalized_source = "auto" if source_lang == "auto" else normalize_language_code(source_lang)
        normalized_target = normalize_language_code(target_lang)

        # 1. Primary: High-speed Google Client Extension API (No 429 rate limit, native auto-detect)
        if provider in ("google", "auto"):
            direct_result = self._translate_google_client(text, normalized_source, normalized_target)
            if direct_result is not None:
                return direct_result

        # 2. Secondary: MyMemoryTranslator
        try:
            return self._translate_mymemory(text, normalized_source, normalized_target)
        except Exception:
            pass

        # 3. Third: deep-translator GoogleTranslator
        try:
            result = GoogleTranslator(source=normalized_source, target=normalized_target).translate(text)
            return cast(str, result if result is not None else text)
        except TooManyRequests as exc:
            raise TranslationRateLimitError("Translation service rate limit reached. Please wait a moment.") from exc
        except Exception as exc:
            err_msg = str(exc).lower()
            if "too many requests" in err_msg or "rate limit" in err_msg or "429" in err_msg:
                raise TranslationRateLimitError("Translation service rate limit reached. Please wait a moment.") from exc
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
                chunks = self._chunk_text(text, max_chars=450)
                translated_parts: List[str] = []
                for idx, chunk in enumerate(chunks):
                    if idx > 0:
                        time.sleep(0.1)
                    translated_parts.append(self.translate_text(chunk, source_lang, target_lang))
                translated = "\n\n".join(translated_parts)
                html = (
                    "<div style='font-family: sans-serif; font-size: 11pt; line-height: 1.4;'>"
                    + escape(translated).replace("\n", "<br>")
                    + "</div>"
                )
                margin = min(36.0, source_page.rect.width / 4, source_page.rect.height / 4)
                target_rect = pymupdf.Rect(
                    source_page.rect.x0 + margin,
                    source_page.rect.y0 + margin,
                    source_page.rect.x1 - margin,
                    source_page.rect.y1 - margin,
                )
                page.insert_htmlbox(target_rect, html)
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
            return cast(bytes, output.tobytes(garbage=4, deflate=True))
        finally:
            output.close()
            source_document.close()


translation_engine = TranslationEngine()
