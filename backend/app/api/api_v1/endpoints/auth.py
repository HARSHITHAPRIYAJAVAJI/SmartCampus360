from datetime import timedelta
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.schemas.user import Token, User, UserCreate, UserInDB

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login/test-token", response_model=schemas.user.User)
def test_token(current_user: models.User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user

@router.post("/register", response_model=schemas.user.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.user.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Create user
    user_in_db = UserInDB(
        **user_in.dict(),
        hashed_password=get_password_hash(user_in.password)
    )
    user = crud.user.create(db, obj_in=user_in_db)
    
    # Create user role specific data
    if user.role == "faculty":
        crud.faculty.create_with_user(db, user_id=user.id)
    elif user.role == "student":
        crud.student.create_with_user(db, user_id=user.id)
    
    return user

@router.get("/me", response_model=schemas.user.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=schemas.user.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.user.UserUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Update own user.
    """
    if user_in.password:
        hashed_password = get_password_hash(user_in.password)
        delattr(user_in, "password")
        user_in = user_in.dict()
        user_in["hashed_password"] = hashed_password
    else:
        user_in = user_in.dict(exclude_unset=True)
    
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user
