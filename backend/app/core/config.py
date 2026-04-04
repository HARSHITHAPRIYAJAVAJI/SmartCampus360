from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from typing import Optional, List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Timetable & Resource Optimizer"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:8081", "http://localhost:8080", "http://localhost:3000"]
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "timetable_optimizer"
    DATABASE_URI: Optional[str] = None
    
    model_config = ConfigDict(case_sensitive=True, env_file=".env", extra='ignore')

    def get_database_url(self):
        if self.DATABASE_URI:
            return self.DATABASE_URI
        # Default to SQLite for easier local development
        return "sqlite:///./sql_app.db"

settings = Settings()
