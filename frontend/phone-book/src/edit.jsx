import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://127.0.0.1:8000/contacts";

// 1. Accept 'onUpdate' prop to sync changes with App.jsx
const EditPage = ({ onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  // State
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation Logic
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required.";
    // Simple phone/email regex check
    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) errs.phone = "Invalid phone format.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email format.";
    
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 2. Fetch Data on Mount
  useEffect(() => {

    //if (!id || id === "undefined") return;

    const fetchContact = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Contact not found");
        
        const data = await res.json();
        setName(data.name || "");
        setPhone(data.phone_no || "");
        setEmail(data.email || "");
        
        // Focus name field
        setTimeout(() => nameRef.current?.focus(), 0);
      } catch (err) {
        console.error(err);
        setError("Could not load contact data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchContact();
  }, [id]);

  // 3. Update API Logic
  const updateContact = async () => {
    const body = { 
        id: parseInt(id), // Ensure ID is included
        name, 
        phone_no: phone, 
        email 
    };

    const res = await fetch(`${API}/${id}`, {
      method: "PUT", // or PATCH depending on your backend
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed to update");
    
    return await res.json(); // Return updated object
  };

  // 4. Handle Save
  const handleSaveCommon = async (redirectToNew) => {
    setError("");
    setFieldErrors({});
    
    if (!validate()) return;

    try {
      setSubmitting(true);
      const updatedData = await updateContact();

      // Update Parent State (Vital!)
      if (onUpdate) {
        onUpdate(updatedData);
      }

      // Navigation Logic 
      if (redirectToNew) {
        // "Save & Add New" -> Go to /new
        navigate("/new");
      } else {
        // "Save" -> Go to Home
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to update contact. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading contact...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-6 border-b pb-2">Edit Contact</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSaveCommon(false); }}>
        
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
             Name <span className="text-red-500">*</span>
          </label>
          <input 
            ref={nameRef} 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.name ? 'border-red-500' : ''}`}
          />
          {fieldErrors.name && <p className="text-red-500 text-xs italic mt-1">{fieldErrors.name}</p>}
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone No</label>
          <input 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
           {fieldErrors.phone && <p className="text-red-500 text-xs italic mt-1">{fieldErrors.phone}</p>}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
           {fieldErrors.email && <p className="text-red-500 text-xs italic mt-1">{fieldErrors.email}</p>}
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button 
            type="button"
            onClick={() => handleSaveCommon(false)} 
            disabled={submitting} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
          
          <button 
            type="button"
            onClick={() => handleSaveCommon(true)} 
            disabled={submitting} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
             Save & Add New
          </button>
          
          <button 
            type="button"
            onClick={() => navigate("/")} 
            disabled={submitting}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditPage;