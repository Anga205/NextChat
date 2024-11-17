import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate
import './SetProfile.css'; // Import the CSS file

const SetProfile = () => {
  const [profileData, setProfileData] = useState({
    bio: '',
    profilePic: null
  });
  const navigate = useNavigate(); // Used for redirecting after setting up profile

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle file change (profile picture)
  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      profilePic: e.target.files[0]
    });
  };

  // Handle form submission (after profile is set)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Set:', profileData);
    // Redirect to chat page or home
    navigate('/chat'); // Replace history.push with navigate
  };

  return (
    <div className="set-profile-container">
      <h2>Set Up Your Profile</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            placeholder="Tell us a bit about yourself"
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Set Profile
        </button>
      </form>
    </div>
  );
};

export default SetProfile;
