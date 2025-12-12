import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './home.jsx';
import EditPage from './edit.jsx';
import NewPage from './new.jsx';
// UserData seems unused, you can likely remove it
// import UserData from "./components/UserData.jsx"; 

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/contacts');
        const data = await res.json();
        setContacts(data); 
        console.log("Data fetched successfully:", data);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleAddContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const handleUpdateContact = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
  };

  return (
    <Router>
      <Routes>
        {/* Pass the 'contacts' state to HomePage */}
        <Route path="/" element={<HomePage contact={contacts} />} />
        
        {/* Pass the update handler to EditPage */}
        <Route path="/edit/:id" element={<EditPage onUpdate={handleUpdateContact} />} />
        
        {/* Pass the add handler to NewPage (ONLY ONE ROUTE HERE) */}
        <Route path="/new" element={<NewPage onAdd={handleAddContact} />} />
      </Routes>
    </Router>
  );
};

export default App;