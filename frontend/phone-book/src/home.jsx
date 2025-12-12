import React from 'react';
import { Link } from 'react-router-dom';
import "./index.css";

const HomePage = ({ contact = [] }) => {
  
  console.log("HomePage received contacts:", contact);

  return (
    <div className="container mx-auto p-6 bg-black shadow rounded-lg max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">PhoneBook</h2>
        <Link to="/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Contact
        </Link>
      </div>

      <table border="1" style={{ borderCollapse: "collapse", width: "100%", textAlign: "left" }}>
  <thead>
          <tr style={{ backgroundColor: "#070707ff" }}>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Phone No</th>
            <th style={{ padding: "10px" }}>Email</th>
            <th style={{ padding: "10px" }}>Action</th>
          </tr>
        </thead>
  <tbody>
    {contact.map((contacts) => (
      <tr key={contacts.id} className="border-b border-gray-700 hover:bg-gray-800">
        <td className="p-4 text-white">{contacts.name}</td>
        <td className="p-4 text-white">{contacts.phone_no}</td>
        <td className="p-4 text-white">{contacts.email}</td>
        <td className="p-4">
           {/* Style your links/buttons too */}
           <Link to={`/edit/${contacts.id}`} className="text-blue-400 hover:underline">
           Edit </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default HomePage;