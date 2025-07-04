from sqlalchemy import Column, Integer, String
from database import Base

class Social(Base):
    __tablename__ = "socials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # ✅ Explicit
    name = Column(String, nullable=False, index=True)
