import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './VerticalNavbar.css'; // Import the CSS file for styling

const VerticalNavbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login');
  };

  const display_name = localStorage.getItem('display_name');
  const username = localStorage.getItem('username');

  return (
    <div className="h-screen w-64 fixed left-0 top-0 bg-gray-800 text-white flex flex-col items-center pt-8">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-5">
        <img className="w-20 h-20 mb-2" src={"https://robohash.org/stefan-"+username} alt="Profile Icon" />
        <div className="text-lg font-bold">{ display_name }</div>
        <div className="text-lg">({ username })</div>
      </div>

      {/* Navigation Links / Contacts List */}
      <div className="w-full flex flex-col items-center">
        <Link to="/chat" className="w-full text-center py-2 border-b border-gray-700 hover:bg-gray-700">
          Chat
        </Link>
        <Link to="/SettingsPage" className="w-full text-center py-2 border-b border-gray-700 hover:bg-gray-700">
          Settings
        </Link>
        <Link to="/SendReq" className="w-full text-center py-2 border-b border-gray-700 hover:bg-gray-700">
          Requests
        </Link>
        {/* Add more links as needed */}
      </div>

      {/* Logout Section */}
      <div className="mt-auto pb-8">
        <button className="bg-red-600 px-4 py-2 text-white text-lg rounded hover:bg-red-500" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default VerticalNavbar;