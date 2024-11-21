import React, { useState } from 'react';

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

  function handleDelete(){
    console.log("Delete Account: "+localStorage.getItem('id'));
    fetch('http://localhost:3000/removeUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: localStorage.getItem('username'), password: localStorage.getItem('password')}),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      window.location.href = '/';
    })
  }

  return (
    <div className="p-5 font-sans text-left" style={{ width: '200%' }}>
      <h2 className="mb-5 text-2xl font-bold">Settings</h2>

      {/* Profile Picture Section */}
      <div className="mb-5">
        <img src={profilePic} alt="Profile" className="w-30 h-30 rounded-full object-cover mb-2" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className="mt-2" />
        <span className="block mt-2">Change Profile Picture</span>
      </div>

      <hr className="my-4" />

      {/* Bio Section */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold">Your Bio</h3>
        <p className="mb-2">{bio}</p>
        <input
          type="text"
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          placeholder="Update your bio"
          className="w-full p-2 mt-2 rounded border border-gray-300"
        />
        <button onClick={handleBioChange} className="p-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Save Bio
        </button>
      </div>

      <hr className="my-4" />

      {/* Theme Section */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold">Theme</h3>
        <select value={theme} onChange={handleThemeChange} className="p-2 mt-2 rounded border border-gray-300">
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>

      <hr className="my-4" />

      {/* Notification Section */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold">Notifications</h3>
        <label className="text-lg">
          <input
            type="checkbox"
            checked={notifications}
            onChange={handleNotificationToggle}
            className="mr-2"
          />
          Receive Notifications
        </label>
      </div>

      <hr className="my-4" />

      {/* Account Settings Section */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold">Account Settings</h3>
        <button className="p-2 mt-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={handleDelete}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
