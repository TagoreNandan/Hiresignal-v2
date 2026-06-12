from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

#enum - application status (set of named status)

class ApplicationStatus(enum.Enum):
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    applications = relationship("Application", back_populates="user")


#sql datatypes and (primary key - column that uniquely identifies each record)

class Application(Base):
    __tablename__ = 'applications'

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    source = Column(String(100))
    status = Column(String(50),default="applied")
    applied_date = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

#Foreign key - links to users table
#users id - primary key in users table





#back-populate - bidirectional relationship between user and application tables
#backpopulating links back to the user and application tables - allows us to access related data from both sides of the relationship

    user = relationship("User", back_populates="applications")
    status_history = relationship('StatusHistory', back_populates='application')

class StatusHistory(Base):
    __tablename__ = 'status_history'

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(ApplicationStatus), nullable=False)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())
    note = Column(String(500))


    application_id = Column(Integer, ForeignKey('applications.id'), nullable=False)
    application = relationship('Application', back_populates='status_history')




#Entire code - models for users, applications, and status history tables