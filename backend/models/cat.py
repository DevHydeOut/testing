from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Cat(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)