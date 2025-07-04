from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
    customer_id: int
    reason: str
    time: datetime

class AppointmentOut(AppointmentCreate):
    id: int

    class Config:
        orm_mode = True
