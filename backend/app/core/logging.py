import logging
import sys
from backend.app.core.config import settings


def setup_logging() -> logging.Logger:
    logger = logging.getLogger("sahayak_ai")
    logger.setLevel(settings.LOG_LEVEL)

    # Avoid duplicate handlers if reloaded
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(settings.LOG_LEVEL)
        # Format logs sanitizing any personal details
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


logger = setup_logging()
