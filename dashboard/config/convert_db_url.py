"""
SQL Alchemy db URL should be converted to Django style db URL
"""

from urllib.parse import parse_qs, urlsplit


def database_url_to_django(url: str) -> dict:
    parts = urlsplit(url)
    scheme = parts.scheme.split("+")[0]  # "postgresql+asyncpg" -> "postgresql"

    if scheme == "sqlite":
        name = parts.path.lstrip("/") or ":memory:"
        return {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": name,
        }

    query = parse_qs(parts.query)
    options = {key: values[0] for key, values in query.items()}

    return {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": parts.path.lstrip("/"),
        "USER": parts.username or "",
        "PASSWORD": parts.password or "",
        "HOST": parts.hostname or "",
        "PORT": str(parts.port) if parts.port else "",
        "OPTIONS": options,
    }