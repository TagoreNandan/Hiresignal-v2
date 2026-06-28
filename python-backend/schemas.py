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
    required_skills: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class OpportunityCreate(BaseModel):
    title: str
    company: str
    description: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = None
    source_url: str
    required_skills: Optional[List[str]] = None


class JobApplicationCreate(BaseModel):
    user_id: int
    opportunity_id: Optional[int] = None
    company: Optional[str] = None
    title: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = "APPLIED"
    notes: Optional[str] = None
    applied_at: Optional[datetime] = None


class JobApplicationOpportunity(BaseModel):
    id: int
    title: str
    company: str
    description: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = None
    required_skills: Optional[List[str]] = None

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


class MatchCreate(BaseModel):
    user_id: int
    opportunity_id: int
    score: float
    saved: Optional[bool] = False
    seen: Optional[bool] = False


class MatchResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: int
    score: float
    saved: bool
    seen: bool
    created_at: datetime
    opportunity: OpportunityResponse

    model_config = {"from_attributes": True}


class DashboardMetrics(BaseModel):
    total_opportunities: int
    total_users: int
    average_score: Optional[float] = None
    pipeline_value: float