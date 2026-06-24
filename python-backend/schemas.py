from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


class UserProfileCreate(BaseModel):
    name: str
    email: EmailStr
    skills: List[str]
    target_roles: List[str]
    year_of_study: Optional[str] = None
    location_pref: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    skills: Optional[List[str]] = None
    target_roles: Optional[List[str]] = None
    year_of_study: Optional[str] = None
    location_pref: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class OpportunityResponse(BaseModel):
    id: int
    title: str
    company: str
    description: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = None
    source_url: str
    posted_date: Optional[datetime] = None
    scraped_at: datetime
    score: Optional[float] = 100.0
    status: Optional[str] = "ACTIVE"

    model_config = {"from_attributes": True}


class OpportunityCreate(BaseModel):
    title: str
    company: str
    description: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = None
    source_url: str


class JobApplicationCreate(BaseModel):
    user_id: int
    opportunity_id: int
    status: Optional[str] = "APPLIED"
    notes: Optional[str] = None


class JobApplicationOpportunity(BaseModel):
    id: int
    title: str
    company: str
    description: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = None

    model_config = {"from_attributes": True}


class JobApplicationResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    status: str
    notes: Optional[str] = None
    applied_at: datetime
    opportunity: JobApplicationOpportunity

    model_config = {"from_attributes": True}


class JobApplicationStatusUpdate(BaseModel):
    status: str


class JobApplicationNotesUpdate(BaseModel):
    notes: str