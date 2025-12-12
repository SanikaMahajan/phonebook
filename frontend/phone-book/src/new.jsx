import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000/contacts";

const NewPage = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  
  const nameRef = useRef(null);
  const navigate = useNavigate();

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setFieldErrors({});
    setError("");
    setTimeout(() => nameRef.current?.focus(), 0);
  };

  const buildPayload = () => ({
    name: name.trim(),
    phone_no: phone.trim(),
    email: email.trim(),
  });

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required.";
    //if (!validatePhone(phone.trim())) errs.phone = "Phone number looks invalid.";
    //if (!validateEmail(email.trim())) errs.email = "Email address looks invalid.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 2. API Call Logic
  const postContact = async (data) => {
    const response = await fetch("http://127.0.0.1:8000/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Server returned " + response.status);
    }
    
    return await response.json();
}

  const handleSaveCommon = async ({ returnToHome = true, clearAfter = false } = {}) => {
    setError("");
    setSuccessMessage("");
    if (!validate()) return;

    const payload = buildPayload();

    try {
      setSubmitting(true);
      
      // A. Send to Backend
      const savedData = await postContact(payload);

      // B. Update Parent State (Vital for Home Page to show new data)
      // If server returned data, use it (it has the real ID). 
      // If not, use payload with a temp ID.
      if (onAdd) {
         onAdd(savedData || { ...payload, id: Date.now() });
      }

      // C. Handle UI Feedback
      if (clearAfter) {
        setSuccessMessage("Saved — you can add another.");
        resetForm();
      } else {
        setSuccessMessage("Saved successfully.");
      }

      if (returnToHome) {
        setTimeout(() => navigate("/"), 500);
      }
    } catch (err) {
      console.error("Create contact error:", err);
      // Fallback: If API fails, maybe we still want to add it locally for demo purposes?
      // Uncomment below if you want to allow adding even if backend is offline:
      /* if (onAdd) {
         onAdd({ ...payload, id: Date.now() });
         if (returnToHome) navigate("/");
         return;
      }
      */
      setError("Failed to save contact. Is the backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async () => {
    await handleSaveCommon({ returnToHome: true, clearAfter: false });
  };

  const handleSaveAddNew = async () => {
    await handleSaveCommon({ returnToHome: false, clearAfter: true });
  };

  const onCancel = () => {
    if (submitting) return;
    navigate("/");
  };

  // 3. Updated Styling (Tailwind) to match your Home Page
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-6 border-b pb-2">New Contact</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} noValidate>
        
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="name"
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.name ? 'border-red-500' : ''}`}
            autoComplete="name"
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.name}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone No</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.phone ? 'border-red-500' : ''}`}
            autoComplete="tel"
          />
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.email ? 'border-red-500' : ''}`}
            autoComplete="email"
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Server/General Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="status">
            {successMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={handleSaveAddNew}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save & Add New"}
          </button>

          <button
            type="button"
            onClick={onCancel}
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

export default NewPage;
