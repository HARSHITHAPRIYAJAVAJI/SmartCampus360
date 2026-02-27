from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create database engine
db_url = settings.get_database_url()
connect_args = {}
if "sqlite" in db_url:
    connect_args = {"check_same_thread": False}
    # SQLite doesn't support pool_size etc in the same way, or at least creates warnings/errors with some configs
    engine = create_engine(
        db_url,
        connect_args=connect_args,
    )
else:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=20,
        max_overflow=10,
        pool_recycle=3600,
    )

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    Dependency function that yields database sessions.
    Use this in FastAPI path operations to get a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
