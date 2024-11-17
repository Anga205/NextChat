import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './VerticalNavbar.css'; // Import the CSS file for styling

const VerticalNavbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing user data, token, etc.)
    // After that, navigate to the Login page
    navigate('/login'); // Redirect to Login page
  };

  return (
    <div className="vertical-navbar">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-icon">👤</div>
        <div className="profile-name">User Name</div>
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

      {/* Logout Section */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default VerticalNavbar;