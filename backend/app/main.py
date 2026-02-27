from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import engine, Base
from app.db.session import get_db
from app.core.security import get_current_active_user

# Create database tables
Base.metadata.create_all(bind=engine)

def get_application():
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="AI Timetable & Resource Optimizer API",
        version="0.1.0",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Set up CORS
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Include API router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Mount static files
    app.mount("/static", StaticFiles(directory="static"), name="static")

    return app

app = get_application()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Example protected route
@app.get("/api/me")
async def read_users_me(current_user: dict = Depends(get_current_active_user)):
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
