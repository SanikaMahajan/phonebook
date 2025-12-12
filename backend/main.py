from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import Contact
from database import session, engine
import database_models
from sqlalchemy.orm import Session

database_models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3030"],
    allow_credentials=True,
    allow_methods=["*"],  # Fixes the 400 Bad Request on OPTIONS
    allow_headers=["*"],  # Allows JSON content headers
)

@app.get("/")
def greet():
    return "Hello World"

#contacts = [
#Contact(id = 1, name = "Sanika Mahajan", phone_no = 1234567890, email= "sanikabhushanmahajan@gmail.com"),
#Contact(id = 2, name = "Archit Mahajan", phone_no = 9876543210, email= "sanikabhushanmahajan@gmail.com"),
#Contact(id = 3, name = "Ananya Kulkarni", phone_no =5432167890, email= "sanikabhushanmahajan@gmail.com"),
#Contact(id = 4, name = "Anushka Shelar", phone_no = 6789054321, email= "sanikabhushanmahajan@gmail.com")
#]

def get_db():
    db = session()
    try:
       yield db
    finally:
       db.close()
  
def init_db():
    db = session()

    count = db.query(database_models.Contact).count()

    if count == 0:
       for contact in contacts:
        db.add(database_models.Contact(**contact.model_dump()))

    db.commit()

init_db()        

@app.get("/contacts")
def get_all_contacts(db: Session = Depends(get_db)):

    db_contacts = db.query(database_models.Contact).all()

    return db_contacts

@app.get("/contacts/{id}")
def get_contact_by_id(id: int, db: Session = Depends(get_db)):
    db_contact = db.query(database_models.Contact).filter(database_models.Contact.id == id).first()
    if db_contact:
        return db_contact    
    return "contact not found"

@app.post("/contacts")
def add_contacts(contact: Contact, db: Session = Depends(get_db)):
    db.add(database_models.Contact(**contact.model_dump()))
    db.commit()
    return contact

@app.put("/contacts/{id}")
def update_contact(id: int, contact: Contact, db: Session = Depends(get_db)):
    db_contact = db.query(database_models.Contact).filter(database_models.Contact.id == id).first()
    if db_contact:
        #db_contact.id = contact.id
        db_contact.name = contact.name
        db_contact.phone_no = contact.phone_no
        db_contact.email = contact.email
        db.commit()

        return "Contact updated"
    else:
        return "No contact found"

@app.delete("/contacts")
def delete_contact(id: int, db: Session = Depends(get_db)):
     db_contact = db.query(database_models.Contact).filter(database_models.Contact.id == id).first()
     if db_contact:
            db.delete(db_contact)
            db.commit()
            return "Contat Deleted"
     else:
         return " Contact Not Found"