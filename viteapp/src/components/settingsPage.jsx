import React, { useState } from 'react';
import './SettingsPage.css'; // Include the styling for the page

const SettingsPage = () => {
  const [bio, setBio] = useState('This is your initial bio');  // Default bio
  const [newBio, setNewBio] = useState('');
  const [profilePic, setProfilePic] = useState('https://www.example.com/default-profile.jpg'); // Default profile pic
  const [theme, setTheme] = useState('light'); // Default theme
  const [notifications, setNotifications] = useState(true); // Default notifications status

  const handleBioChange = () => {
    if (newBio.trim()) {
      setBio(newBio);
      setNewBio('');
    }
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.body.setAttribute('data-theme', e.target.value); // Change theme dynamically
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {/* Profile Picture Section */}
      <div className="profile-section">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        <span>Change Profile Picture</span>
      </div>

      {/* Bio Section */}
      <div className="bio-section">
        <h3>Your Bio</h3>
        <p>{bio}</p>
        <input
          type="text"
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          placeholder="Update your bio"
        />
        <button onClick={handleBioChange}>Save Bio</button>
      </div>

      {/* Theme Section */}
      <div className="theme-section">
        <h3>Theme</h3>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>

      {/* Notification Section */}
      <div className="notification-section">
        <h3>Notifications</h3>
        <label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={handleNotificationToggle}
          />
          Receive Notifications
        </label>
      </div>

      {/* Account Settings Section */}
      <div className="account-section">
        <h3>Account Settings</h3>
        <button className="delete-account-btn">Delete Account</button>
      </div>
    </div>
  );
};

export default SettingsPage;

