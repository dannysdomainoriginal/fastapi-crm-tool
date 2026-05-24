from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_URL: str
    SECRET_KEY: str = "your_secret_key_change_this_for_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Configuration for your settings class
    model_config = SettingsConfigDict(
        env_file=".env",            # Point to your local .env file
        env_file_encoding="utf-8"   # Standard character encoding
    )

# Instantiate the settings object to load everything
settings = Settings()
