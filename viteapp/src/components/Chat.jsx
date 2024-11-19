// import React from 'react';
// import VerticalNavbar from './VerticalNavbar';  // Import the navbar
// import ContactList from './ContactList';  // Import the contact list
// import './Chat.css';  // Import your chat styles

// const Chat = () => {
//   return (
//     <div className="chat-container">
//       <VerticalNavbar /> {/* Include the vertical navbar */}

//       <div className="chat-main">
//         {/* Contact List on the right side */}
//         <ContactList />

//         {/* Chat Section */}
//         <div className="chat-area">
//           <div className="chat-header">Chat with Person 1</div>
//           <div className="chat-messages">
//             {/* Display messages here */}
//           </div>
//           <div className="message-input">
//             <input type="text" placeholder="Type a message..." />
//             <button>Send</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';  // Import the navbar
import ContactList from './ContactList';  // Import the contact list
import './Chat.css';  // Import your chat styles

const Chat = () => {

  const username = localStorage.getItem('username');
  const display_name = localStorage.getItem('display_name');
  const password = localStorage.getItem('password');

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (username && password) {
      fetch('http://localhost:3000/getFriends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            window.alert(data.error);
          } else {
            setFriends(data);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    const storedFriend = JSON.parse(localStorage.getItem('selectedFriend'));
    if (storedFriend) {
      setSelectedFriend(storedFriend);
    } else if (friends.length >= 1) {
      setSelectedFriend({'id':friends[0]._id, 'display_name':friends[0].display_name, 'username':friends[0].username});
      localStorage.setItem('selectedFriend', JSON.stringify({'id':friends[0]._id, 'display_name':friends[0].display_name, 'username':friends[0].username}));
    } else {
      console.error('No friends available');
    }
  }, [friends]);

  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, how are you?', sender: 'other' },  // other for received message
    { id: 2, text: 'I am fine, thank you!', sender: 'user' },  // user for sent message
  ]);

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { id: messages.length + 1, text: message, sender: 'user' }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <VerticalNavbar /> {/* Include the vertical navbar */}

      <div className="chat-main">
        {/* Contact List on the right side */}
        <ContactList />

        {/* Chat Section */}
        <div className="chat-area">
          <div className="chat-header">Chat with {selectedFriend.display_name}</div>
          <div className="chat-messages">
            {/* Loop through messages and display them */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}
              >
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
