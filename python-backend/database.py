from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

#(create engine) for connection

engine = create_engine(os.getenv("DATABASE_URL"))

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Sessionlocal creates new session objects

#session - transaction for all queries

class Base(DeclarativeBase):
    pass

#Base - parent class for models used to track which classes - which tables

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#entire code - DB engine
