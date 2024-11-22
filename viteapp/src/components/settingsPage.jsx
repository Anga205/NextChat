import React from 'react';
import './SettingsPage.css'; // Import the new CSS file
import mySvg from '../assets/Settings.svg'; // Import SVG from src/assets

const SettingsPage = () => {
  // Handle delete account functionality
  const handleDelete = () => {
    console.log("Delete Account: " + localStorage.getItem('id'));
    fetch('http://localhost:3000/removeUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.href = '/';
      });
  };

  // Handle logout functionality
  const handleLogout = () => {
    console.log("Logging out user");
    localStorage.clear(); // Clear all user-related data
    window.location.href = '/login'; // Redirect to the login page
  };

  return (
    <div className="settings-page">
      <div className="settings-content">
        <div className="account-settings">
          <h2>Account Settings</h2><br/><br/>

          {/* Catchy line for Delete Account */}
          <p className="catchy-line">
            Tired of QuickChat?
          </p> 
          <p className="catchy-line"> Take the ultimate step and delete your account!</p>
          <button className="delete-btn" onClick={handleDelete}>
            Delete Account
          </button> <br/> <br/><br/><br/><br/>

          {/* Catchy line for Logout */}
          <p className="catchy-line">
            Tired of chatting? Wanna logout? Click below!
          </p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="settings-svg">
        <img src={mySvg} alt="Settings Icon" />
      </div>
    </div>
  );
};

export default SettingsPage;
