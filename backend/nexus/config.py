from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str = "sqlite:///./nexus-dev.db"
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:8081", "http://127.0.0.1:8081"]
    storage_dir: Path = Path("storage")
    time_zone: str = "America/Sao_Paulo"
    session_days: int = 7
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@example.com"
    smtp_starttls: bool = True


settings = Settings()
