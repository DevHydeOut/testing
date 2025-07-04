from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.customer import Customer
from schemas.customer import CustomerCreate, CustomerOut
from typing import List
from models.appointment import Appointment
from schemas.appointment import AppointmentCreate, AppointmentOut
from datetime import datetime
from typing import List
from models.cat import Cat
from schemas.cat import CatCreate, CatOut
from models.social import Social
from schemas.social import SocialCreate, SocialOut


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_crm_data():
    return {"message": "Hello from CRM module"}

@router.post("/customers")
def create_customer(customer: CustomerCreate):
    db = SessionLocal()
    new_customer = Customer(name=customer.name, email=customer.email, phone=customer.phone)
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    db.close()
    return {"id": new_customer.id}

@router.get("/customers", response_model=List[CustomerOut])
def read_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

@router.put("/customers/{customer_id}")
def update_customer(customer_id: int, customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not db_customer:
        return {"error": "Customer not found"}
    db_customer.name = customer.name
    db_customer.email = customer.email
    db_customer.phone = customer.phone
    db.commit()
    return {"message": "Customer updated"}

@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not db_customer:
        return {"error": "Customer not found"}
    db.delete(db_customer)
    db.commit()
    return {"message": "Customer deleted"}

@router.post("/customers/bulk", response_model=List[CustomerOut])
def bulk_create_customers(customers: List[CustomerCreate], db: Session = Depends(get_db)):
    new_customers = [Customer(**c.dict()) for c in customers]
    db.add_all(new_customers)
    db.commit()
    for c in new_customers:
        db.refresh(c)
    return new_customers


@router.get("/appointments", response_model=List[AppointmentOut])
def read_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

@router.post("/appointments", response_model=AppointmentOut)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    db_appointment = Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


@router.post("/cats", response_model=CatOut)
def create_cat(cat: CatCreate, db: Session = Depends(get_db)):
    new_cat = Cat(**cat.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.get("/cats", response_model=List[CatOut])
def get_cats(db: Session = Depends(get_db)):
    return db.query(Cat).all()


@router.post("/socials", response_model=SocialOut)
def create_social(social: SocialCreate, db: Session = Depends(get_db)):
    new_social = Social(**social.dict())
    db.add(new_social)
    db.commit()
    db.refresh(new_social)
    return new_social 

@router.get("/socials", response_model=List[SocialOut])
def get_socials(db: Session = Depends(get_db)):
    return db.query(Social).order_by(Social.id.desc()).all()

