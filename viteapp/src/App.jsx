import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';  // Import WelcomePage
import Login from './components/Login';  // Import Login component
import SetProfile from './components/SetProfile';  // Import SetProfile component
import Chat from './components/Chat';  // Import Chat component
import Layout from './components/Layout';  // Import the Layout component
import './App.css';
import SettingsPage from './components/settingsPage';
import SendReq from './components/SendReq';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes without navbar */}
          <Route path="/" element={<WelcomePage />} />  {/* Default route to WelcomePage */}
          <Route path="/login" element={<Login />} />
          <Route path="/set-profile" element={<SetProfile />} />  {/* Login route */}

          {/* Routes with the persistent vertical navbar */}
          <Route element={<Layout />}> {/* All these routes will render inside Layout */}
          <Route path="/SettingsPage" element={<SettingsPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/SendReq" element={<SendReq />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import WelcomePage from './components/WelcomePage';  // Import WelcomePage
// import Login from './components/Login';  // Import Login component
// import SetProfile from './components/SetProfile';  // Import SetProfile component
// import Chat from './components/Chat';  // Import Chat component
// import Layout from './components/Layout';  // Import the Layout component
// import './App.css';
// import SettingsPage from './components/SettingsPage';
// import SendReq from './components/SendReq';

// // Import ProfileProvider
// import { ProfileProvider } from './contexts/ProfileContext';

// function App() {
//   return (
//     <ProfileProvider> {/* Wrap the app with ProfileProvider */}
//       <Router>
//         <div className="App">
//           <Routes>
//             {/* Routes without navbar */}
//             <Route path="/" element={<WelcomePage />} />  {/* Default route to WelcomePage */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/set-profile" element={<SetProfile />} />  {/* Login route */}

//             {/* Routes with the persistent vertical navbar */}
//             <Route element={<Layout />}> {/* All these routes will render inside Layout */}
//               <Route path="/SettingsPage" element={<SettingsPage />} />
//               <Route path="/chat" element={<Chat />} />
//               <Route path="/SendReq" element={<SendReq />} />
//             </Route>
//           </Routes>
//         </div>
//       </Router>
//     </ProfileProvider>
//   );
// }

// export default App;
