from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Social Media Agent API"
    VERSION: str = "1.0.0"

    # Supabase Config
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # OpenAI Config
    OPENAI_API_KEY: str = ""

    # Facebook Config
    FB_APP_ID: str = ""
    FB_APP_SECRET: str = ""

    # Redis/Celery
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"


settings = Settings()
