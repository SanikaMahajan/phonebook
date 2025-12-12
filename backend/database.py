import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

password = "JBalvin@21"
encoded_password = urllib.parse.quote(password)


db_url = f"postgresql://postgres:{encoded_password}@localhost:5432/Phonebook"
engine = create_engine(db_url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
