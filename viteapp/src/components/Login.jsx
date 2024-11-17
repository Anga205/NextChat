import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate
import './Login.css'; // Import the CSS file

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate(); // Used for redirecting after sign up

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Logic for login (e.g., validate and redirect to chat)
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields!');
        return;
      }
      console.log('Logging In:', formData);
    } else {
      // Logic for sign up
      if (!formData.username || !formData.email || !formData.password) {
        alert('Please fill in all fields!');
        return;
      }
      console.log('Signing Up:', formData);
      // Redirect to Set Profile Page after sign-up
      navigate('/set-profile'); // Replace history.push with navigate
    }
  };

  // Toggle between Login and Sign Up
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login to Chat' : 'Sign Up for Chat'}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required={!isLogin}
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="toggle-link">
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span className="toggle-btn" onClick={toggleForm}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
