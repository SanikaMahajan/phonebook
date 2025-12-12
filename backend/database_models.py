from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Contact(Base):

    __tablename__ = "contacts" #phonebook
    id = Column (Integer, primary_key=True, index=True)
    name = Column (String(255))
    phone_no = Column(String(15))
    email = Column(String(50))