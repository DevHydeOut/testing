from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    reason = Column(String)
    time = Column(DateTime)
