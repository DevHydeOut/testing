from pydantic import BaseModel

class CatCreate(BaseModel):
    name: str

class CatOut(CatCreate):
    id: int

    class Config:
        orm_mode = True