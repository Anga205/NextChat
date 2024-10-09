import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Chat from './pages/chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element= {<Login />} />
        <Route path="/chat" element= {<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
