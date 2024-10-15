import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Add signup logic here
  };

  return (
    <div className="Login">
      {isLogin ? (
        <div className="item">
          <h2>Welcome back</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">Sign In</button>
          </form>
          <p>
            Don't have an account?{" "}
            <span className="toggle" onClick={() => setIsLogin(false)}>
              Sign Up
            </span>
          </p>
        </div>
      ) : (
        <div className="item">
          <h2>Create an Account</h2>
          <form onSubmit={handleSignup}>
            <label htmlFor="file">
              <img src={avatar.url || "./avatar.png"} alt="" />
              Upload an image
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input type="text" placeholder="Username" name="username" />
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <span className="toggle" onClick={() => setIsLogin(true)}>
              Sign In
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
