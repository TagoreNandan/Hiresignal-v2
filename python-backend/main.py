import logging
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Body, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import User, Opportunity, JobApplication
from schemas import (
    UserProfileCreate,
    UserProfileResponse,
    OpportunityResponse,
    OpportunityCreate,
    JobApplicationCreate,
    JobApplicationResponse,
    JobApplicationStatusUpdate,
    JobApplicationNotesUpdate,
)

app = FastAPI(title="HireSignal V2 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def auto_populate_applications(user_id: int, db: Session):
    """Auto-populates some default applications for a user to ensure demo-readiness."""
    existing_count = db.query(JobApplication).filter(JobApplication.user_id == user_id).count()
    if existing_count == 0:
        opps = db.query(Opportunity).limit(10).all()
        for idx, opp in enumerate(opps):
            # Distribute statuses across APPLIED, INTERVIEWING, OFFER, REJECTED
            status_opts = ["APPLIED", "INTERVIEWING", "OFFER", "REJECTED"]
            status = status_opts[idx % len(status_opts)]
            app_record = JobApplication(
                user_id=user_id,
                opportunity_id=opp.id,
                status=status,
                notes=f"Calibrated resume match. Tracking application logs."
            )
            db.add(app_record)
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            logging.getLogger("main").error(f"Failed to auto-populate applications: {e}")


@app.post("/profile", response_model=UserProfileResponse)
def create_profile(
    profile: UserProfileCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(User)
        .filter(User.email == profile.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        name=profile.name,
        email=profile.email,
        skills=profile.skills,
        target_roles=profile.target_roles,
        year_of_study=profile.year_of_study,
        location_pref=profile.location_pref,
    )

    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error during registration: {e}"
        )

    auto_populate_applications(user.id, db)
    return user


@app.get("/profile/{user_id}", response_model=UserProfileResponse)
def get_profile(
    user_id: int = Path(..., gt=0),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@app.put("/profile/{user_id}", response_model=UserProfileResponse)
def update_profile(
    user_id: int = Path(..., gt=0),
    profile: UserProfileCreate = Body(...),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if profile.email != user.email:
        existing = (
            db.query(User)
            .filter(User.email == profile.email)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

    user.name = profile.name
    user.email = profile.email
    user.skills = profile.skills
    user.target_roles = profile.target_roles
    user.year_of_study = profile.year_of_study
    user.location_pref = profile.location_pref

    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update profile in database: {e}"
        )

    auto_populate_applications(user.id, db)
    return user


@app.get("/opportunities", response_model=List[OpportunityResponse])
def get_opportunities(
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    opps = (
        db.query(Opportunity)
        .offset(offset)
        .limit(limit)
        .all()
    )
    for opp in opps:
        opp.score = 100.0
        opp.status = "ACTIVE"
    return opps


@app.post("/opportunities/seed")
def seed_opportunities(
    opp: OpportunityCreate = Body(default=None),
    db: Session = Depends(get_db)
):
    if opp is not None:
        existing = (
            db.query(Opportunity)
            .filter(Opportunity.source_url == opp.source_url)
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Opportunity with this source_url already registered"
            )

        db_opp = Opportunity(
            title=opp.title,
            company=opp.company,
            description=opp.description,
            location=opp.location,
            source=opp.source,
            source_url=opp.source_url,
        )

        db.add(db_opp)
        try:
            db.commit()
            db.refresh(db_opp)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Database error during seeding: {e}"
            )

        return db_opp
    else:
        import seed_data
        try:
            seeded = seed_data.seed_opportunities(db)
            return {"message": f"Successfully seeded {len(seeded)} new opportunities"}
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Seeding error in database: {e}"
            )


@app.post("/applications", response_model=JobApplicationResponse)
def create_application(
    application: JobApplicationCreate,
    db: Session = Depends(get_db)
):
    user_exists = db.query(User).filter(User.id == application.user_id).first()
    if not user_exists:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    opp_exists = db.query(Opportunity).filter(Opportunity.id == application.opportunity_id).first()
    if not opp_exists:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    # Prevent duplicate active applications
    existing = (
        db.query(JobApplication)
        .filter(
            JobApplication.user_id == application.user_id,
            JobApplication.opportunity_id == application.opportunity_id
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Job application already registered"
        )

    app_record = JobApplication(
        user_id=application.user_id,
        opportunity_id=application.opportunity_id,
        status=application.status or "APPLIED",
        notes=application.notes
    )

    db.add(app_record)
    try:
        db.commit()
        db.refresh(app_record)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create application record: {e}"
        )

    return app_record


@app.get("/applications/{user_id}", response_model=List[JobApplicationResponse])
def get_applications(
    user_id: int = Path(..., gt=0),
    db: Session = Depends(get_db)
):
    user_exists = db.query(User).filter(User.id == user_id).first()
    if not user_exists:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    applications = (
        db.query(JobApplication)
        .options(joinedload(JobApplication.opportunity))
        .filter(JobApplication.user_id == user_id)
        .order_by(JobApplication.applied_at.desc())
        .all()
    )
    return applications


@app.put("/applications/{application_id}/status", response_model=JobApplicationResponse)
def update_application_status(
    application_id: int = Path(..., gt=0),
    payload: JobApplicationStatusUpdate = Body(...),
    db: Session = Depends(get_db)
):
    app_record = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app_record:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    app_record.status = payload.status
    try:
        db.commit()
        db.refresh(app_record)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update application status: {e}"
        )

    return app_record


@app.put("/applications/{application_id}/notes", response_model=JobApplicationResponse)
def update_application_notes(
    application_id: int = Path(..., gt=0),
    payload: JobApplicationNotesUpdate = Body(...),
    db: Session = Depends(get_db)
):
    app_record = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app_record:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    app_record.notes = payload.notes
    try:
        db.commit()
        db.refresh(app_record)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update application notes: {e}"
        )

    return app_record


@app.delete("/applications/{application_id}")
def delete_application(
    application_id: int = Path(..., gt=0),
    db: Session = Depends(get_db)
):
    app_record = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not app_record:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    try:
        db.delete(app_record)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete/withdraw application: {e}"
        )

    return {"message": "deleted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)