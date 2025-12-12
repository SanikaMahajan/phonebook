from pydantic import BaseModel

class Contact(BaseModel):
    
    name: str
    email: str
    phone_no: str 
    class Config:
        from_attributes = True