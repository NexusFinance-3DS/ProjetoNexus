from datetime import datetime
from zoneinfo import ZoneInfo

from .config import settings


def today():
    """Data financeira no fuso configurado; sessões continuam usando UTC."""
    return datetime.now(ZoneInfo(settings.time_zone)).date()
