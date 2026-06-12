from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models import ApplicationStatus

#both schemas for crating and response of user

class UserCreate(BaseModel):
    name: str
    email: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {'from_attributes': True}

class ApplicationCreate(BaseModel):
    company_name: str
    role: str
    source: Optional[str] = None
    user_id: int

class ApplicationResponse(BaseModel):
    id: int
    company_name: str
    role: str
    source: Optional[str]
    status: ApplicationStatus
    applied_date: datetime
    user_id: int

    model_config = {'from_attributes': True}

class StatusUpdate(BaseModel):
    status: ApplicationStatus
    note: Optional[str] = None

#Entire code - pydantic schemas for user and appli data validation