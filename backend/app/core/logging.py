import logging
import sys
from typing import Any

from app.core.config import settings

logger = logging.getLogger("linguaflow")
logger.setLevel(logging.DEBUG if settings.debug else logging.INFO)

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(
    logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
)
logger.addHandler(handler)


class RequestIdFilter(logging.Filter):
    def filter(self, record: Any) -> bool:
        record.request_id = getattr(record, "request_id", "-")
        return True


logger.addFilter(RequestIdFilter())


__all__ = ["logger"]
