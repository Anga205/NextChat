import React, { useState} from 'react'; // Import useState and useEffect
import './Login.css'; // Import the CSS file
import BGImage from "../assets/L1.svg";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    password: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Toggle between Login and Sign Up
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      display_name: '',
      username: '',
      password: ''
    });
  };

  // Handle login
  function handleLogin(e) {
    e.preventDefault();
    if (isLogin) {
      fetch('https://3000.angadbhalla.com/getUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            window.alert(data.error);
          } else if (data._id) {
            localStorage.setItem('id', data._id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('display_name', data.display_name);
            localStorage.setItem('password', formData.password);
            window.location.replace('/chat');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      fetch('https://3000.angadbhalla.com/newUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            window.alert(data.error);
          } else if (data.acknowledged) {
            localStorage.setItem('id', data.insertedId);
            localStorage.setItem('username', formData.username);
            localStorage.setItem('display_name', formData.display_name);
            localStorage.setItem('password', formData.password);
            window.location.replace('/chat');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  // Check if id exists in localStorage on page load
  React.useEffect(() => {
    const userId = localStorage.getItem('id');
    if (userId) {
      fetch('https://3000.angadbhalla.com/getUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        })
      }).then(response => response.json())
        .then(data => {
          if (data._id===userId) {
            window.location.replace('/chat');
          } else {
            localStorage.clear();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="left-panel">
      <img src={BGImage} alt="Login" className="illustration" />
      </div>
      <div className="right-panel">
        <div className="login-container">
          <h2>{isLogin ? 'Login to Chat' : 'Sign Up for Chat'}</h2>
          <form onSubmit={handleLogin}>
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="display_name">Display Name</label>
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  placeholder="Enter your Display Name"
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
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
      </div>
    </div>
  );
};

export default Login;
