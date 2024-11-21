import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css"; // Import the CSS file
import BGImage from "../assets/welcome.svg";


const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/Login"); // Replace '/chat' with your desired route
  };

//   return (
//     <div className="welcome-container">
//       <div className="welcome-box">
//         <h1 className="welcome-title">Welcome to QuickChat</h1>
//         <p className="welcome-description">
//           Connect and communicate seamlessly with QuickChat, your go-to chat application.
//         </p>
//         <button className="welcome-button" onClick={handleGetStarted}>
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// };
return (
  <div className="app-container">
    <header className="navbar">
    </header>

    <main className="main-content">
      <div className="text-section">
        <h1>Welcome to QuickChat</h1>
        <p>
        Connect and communicate seamlessly with QuickChat, your go-to chat application.
        </p>
        <button className="welcome-button" onClick={handleGetStarted}>Get Started</button>
      </div>
      <div className="image-section">
      <img src={BGImage} alt="Chatbot Illustration" className="illustration" />
      </div>
    </main>
  </div>
);
}

export default WelcomePage;
