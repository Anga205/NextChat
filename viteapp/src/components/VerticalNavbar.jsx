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
    <div className="vertical-navbar">
      {/* Profile Section */}
      <div className="profile-section">
        <img className="profile-icon" src={"https://robohash.org/stefan-"+username}></img>
        <div className="profile-name">{ display_name }</div>
        <div className="profile-name">({ username })</div>
      </div>

      {/* Navigation Links / Contacts List */}
      <div className="nav-links">
        <Link to="/chat" className="nav-link">
          Chat
        </Link>
        <Link to="/SettingsPage" className="nav-link">
          Settings
        </Link>
        <Link to="/SendReq" className="nav-link">
          Requests
        </Link>
        {/* Add more links as needed */}
      </div>


    </div>
  );
};

export default VerticalNavbar;