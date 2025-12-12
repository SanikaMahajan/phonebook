-- Database: Phonebook

-- DROP DATABASE IF EXISTS "Phonebook";

CREATE DATABASE "Phonebook"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

    -- Table: public.contacts

-- DROP TABLE IF EXISTS public.contacts;

CREATE TABLE IF NOT EXISTS public.contacts
(
    id bigint NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
    name character varying(225) COLLATE pg_catalog."default" NOT NULL,
    phone_no character varying(15) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT contacts_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contacts
    OWNER to postgres;

  
--SQL Commands to run
SELECT setval('contacts_id_seq', (SELECT MAX(id) FROM contacts)); --set the counter to the heighest number of id

insert into contacts (id, name, phone_no, email)
values (01,'Sanika Mahajan', 1234567890, 'sanika2110mahajan@gmail.com'),
       (02,'Ananya Kulkarni', 9187654321, 'aanyaakulkarni1111@gmail.com'),
	   (03,'Archit Mahajan', 6543217890, 'maha.archit@gmail.com'),
	   (04,'Kedar Kulkarni', 6789054321, 'kedarvijaykulkarni@gmail.com'),
	   (05, 'J Balvin', 1213141516, 'josealvaroosoriobalvin@gmail.com')

     












