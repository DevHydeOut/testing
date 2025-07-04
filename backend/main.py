from database import Base, engine
from models import customer  # import your model

Base.metadata.create_all(bind=engine)

from fastapi import FastAPI
from routers import crm
from fastapi.middleware.cors import CORSMiddleware
from models.customer import Customer
from models.appointment import Appointment
from models.cat import Cat
from models.social import Social 

# Create tables for all models
Customer.metadata.create_all(bind=engine)
Appointment.metadata.create_all(bind=engine)



app = FastAPI()

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to CRM App API"}

app.include_router(crm.router, prefix="/crm")

