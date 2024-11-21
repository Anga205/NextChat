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

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showInputs, setShowInputs] = useState(true);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (e.target.value.trim()) {
      setShowInputs(false);
    } else {
      setShowInputs(true);
    }
  };

  const handleSaveChanges = () => {
    // Implement save changes logic here
    console.log('Changes saved');
  };


  return (
    <div className="p-5 font-sans text-left" style={{ width: '100%' }}>
      <h2 className="mb-5 text-2xl font-bold">Settings</h2>

      {/* Account Settings Section */}
      <div className="mb-5"></div>
        <h3 className="text-xl font-semibold">Account Settings</h3>
        <button className="p-2 mt-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={handleDelete}>
          Delete Account
        </button>
      </div>
  );
};

export default SettingsPage;
