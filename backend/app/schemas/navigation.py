from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LocationBase(BaseModel):
    name: str
    block: str
    floor: str
    type: str

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: int

    class Config:
        from_attributes = True

class FacultyLocationBase(BaseModel):
    faculty_id: str
    current_location: str
    source: str

class FacultyLocation(FacultyLocationBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True

class SearchResult(BaseModel):
    type: str # "faculty" | "location"
    name: str
    location: str
    block: Optional[str] = None
    floor: Optional[str] = None
    details: Optional[str] = None

class SearchResponse(BaseModel):
    type: str
    results: List[SearchResult]
