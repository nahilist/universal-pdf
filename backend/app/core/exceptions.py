class LinguaFlowException(Exception):
    error_code: str = "INTERNAL_ERROR"
    message: str = "An unexpected error occurred."
    status_code: int = 500

    def __init__(self, message: str | None = None, error_code: str | None = None):
        if message:
            self.message = message
        if error_code:
            self.error_code = error_code
        super().__init__(self.message)


class PDFInvalidError(LinguaFlowException):
    error_code = "PDF_INVALID"
    message = "The uploaded file is not a valid PDF."
    status_code = 400


class PDFCorruptedError(LinguaFlowException):
    error_code = "PDF_CORRUPTED"
    message = "The PDF file is corrupted and cannot be processed."
    status_code = 400


class PDFPasswordProtectedError(LinguaFlowException):
    error_code = "PDF_PASSWORD_PROTECTED"
    message = "Password-protected PDFs are not supported."
    status_code = 400


class PDFTooLargeError(LinguaFlowException):
    error_code = "PDF_TOO_LARGE"
    message = "The PDF file exceeds the maximum allowed size."
    status_code = 400


class PDFTooManyPagesError(LinguaFlowException):
    error_code = "PDF_TOO_MANY_PAGES"
    message = "The PDF contains too many pages."
    status_code = 400


class OCRFailedError(LinguaFlowException):
    error_code = "OCR_FAILED"
    message = "OCR processing failed for this document."
    status_code = 500


class TranslationFailedError(LinguaFlowException):
    error_code = "TRANSLATION_FAILED"
    message = "Translation failed. Please try again."
    status_code = 500


class TranslationRateLimitError(LinguaFlowException):
    error_code = "TRANSLATION_RATE_LIMIT"
    message = "Translation service rate limit exceeded."
    status_code = 429


class RenderFailedError(LinguaFlowException):
    error_code = "RENDER_FAILED"
    message = "Failed to render the translated PDF."
    status_code = 500


class StorageFailedError(LinguaFlowException):
    error_code = "STORAGE_FAILED"
    message = "Storage operation failed."
    status_code = 500


class JobNotFoundError(LinguaFlowException):
    error_code = "JOB_NOT_FOUND"
    message = "The requested job was not found."
    status_code = 404


class UnauthorizedError(LinguaFlowException):
    error_code = "UNAUTHORIZED"
    message = "Authentication required."
    status_code = 401


__all__ = [
    "LinguaFlowException",
    "PDFInvalidError",
    "PDFCorruptedError",
    "PDFPasswordProtectedError",
    "PDFTooLargeError",
    "PDFTooManyPagesError",
    "OCRFailedError",
    "TranslationFailedError",
    "TranslationRateLimitError",
    "RenderFailedError",
    "StorageFailedError",
    "JobNotFoundError",
    "UnauthorizedError",
]
