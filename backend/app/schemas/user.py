from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    FACULTY = "faculty"
    STUDENT = "student"

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    role: UserRole = UserRole.STUDENT
    
    @validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# Faculty specific schemas
class FacultyBase(BaseModel):
    department: Optional[str] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None

class FacultyCreate(FacultyBase):
    user_id: int

class Faculty(FacultyBase):
    id: int
    user: User

    class Config:
        orm_mode = True

# Student specific schemas
class StudentBase(BaseModel):
    enrollment_number: Optional[str] = None
    program: Optional[str] = None
    semester: Optional[int] = None
    batch: Optional[str] = None

class StudentCreate(StudentBase):
    user_id: int

class Student(StudentBase):
    id: int
    user: User

    class Config:
        orm_mode = True
