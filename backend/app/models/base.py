from datetime import datetime
from sqlalchemy import Column, DateTime
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """Base class for all database models."""
    __abstract__ = True
    
    id = Column(DateTime, default=datetime.utcnow, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    @declared_attr
    def __tablename__(cls):
        """
        Generate __tablename__ automatically.
        Converts CamelCase class name to snake_case table name.
        """
        return ''.join(['_'+i.lower() if i.isupper() else i for i in cls.__name__]).lstrip('_')
    
    def to_dict(self):
        """Convert model instance to dictionary."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
