from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import update
from sqlalchemy.orm import Session
from database import get_db, Base, engine
from models import User, Application, StatusHistory
from schemas import UserCreate, UserResponse, ApplicationResponse, StatusUpdate, ApplicationCreate

#creates tables in DB
#Without this, tables won't be created and we will get error when trying to access them

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireSignal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Post - create new user and application
#response model - tells FastAPI what shape to use


@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")


#creating new user - add to DB session, commit, refresh to get ID, return user data

    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#create new application - check if user exists, if not return 404, otherwise return user data (for simplicity, we are not creating application records here, just returning user data)



#APP routes for creating users and applications, with data validation and error handling



@app.post('/applications',response_model=ApplicationResponse)
def create_application(app_data: ApplicationCreate, db: Session = Depends(get_db)):
    application = Application(
        company_name=app_data.company_name,
        role=app_data.role,
        source=app_data.source,
        user_id=app_data.user_id
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


#Get applications for a user - filter by user_id, return list of applications


@app.get('/applications', response_model=list[ApplicationResponse])
def get_applications(user_id: int, db: Session = Depends(get_db)):
    return db.query(Application).filter(
        Application.user_id == user_id
    ).all()



#Update application status - find application by ID, if not found return 404, otherwise update status and add entry to status history, commit changes and return updated application data


@app.put('/applications/{application_id}/status', response_model=ApplicationResponse)
def update_application_status(application_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = status_update.status


    #create new status history record linked to the application

    status_history = StatusHistory(
        status=status_update.status,
        note=status_update.note,
        application_id=application_id
    )
    db.add(status_history)

    db.commit()
    db.refresh(application)
    return application

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=3000)


#Entire code - FastAPI app with routes for creating users and applications, updating application status, and retrieving applications, with CORS middleware and database integration