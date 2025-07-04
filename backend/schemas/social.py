from pydantic import BaseModel

class SocialBase(BaseModel):
    name: str

class SocialCreate(SocialBase):
    pass

class SocialOut(SocialBase):
    id: int

    class Config:
        from_attributes = True  # ✅ for Pydantic v2
