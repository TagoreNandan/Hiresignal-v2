from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY

from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    skills = Column(ARRAY(String))
    target_roles = Column(ARRAY(String))
    year_of_study = Column(String(50))
    location_pref = Column(String(100))
    
    applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")


class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    company = Column(String(200), nullable=False)
    
    description = Column(Text)
    
    location = Column(String(100))
    source = Column(String(50))
    
    source_url = Column(String(500), unique=True, nullable=False)
    
    posted_date = Column(DateTime(timezone=True))
    
    scraped_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    
    applications = relationship("JobApplication", back_populates="opportunity", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )
    opportunity_id = Column(
        Integer,
        ForeignKey("opportunities.id"),
        nullable=False
    )
    status = Column(String(50), nullable=False, default="APPLIED")
    notes = Column(Text, nullable=True)
    applied_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    
    user = relationship("User", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")


