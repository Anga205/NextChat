import React, { useState, useEffect } from 'react';
import VerticalNavbar from './VerticalNavbar';  // Import the navbar
import ContactList from './ContactList';  // Import the contact list
import './Chat.css';  // Import your chat styles

const Chat = () => {

  const username = localStorage.getItem('username');
  const display_name = localStorage.getItem('display_name');
  const password = localStorage.getItem('password');
  const userId = localStorage.getItem('id');

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

  var [selectedFriendUsername, setSelectedFriendUsername] = useState('{SELECTED_FRIEND_USERNAME}');
  var [selectedFriendDisplayName, setSelectedFriendDisplayName] = useState('{SELECTED_FRIEND_DISPLAY_NAME}');
  var [selectedFriendId, setSelectedFriendId] = useState('{SELECTED_FRIEND_ID}');

  function updateMessages() {
    fetch('http://localhost:3000/getMessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        messagesWith: selectedFriendUsername,
      })
    }).then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].sender = data[i].senderId === userId ? 'user' : 'other';
          data[i].text = data[i].message.text;
        }
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(data);
      })
  }

  useEffect(() => {
    if (selectedFriend) {
      setSelectedFriendUsername(selectedFriend.username);
      setSelectedFriendDisplayName(selectedFriend.display_name);
      setSelectedFriendId(selectedFriend.id);
      updateMessages();
    }
  }, [selectedFriend]);

  useEffect(() => {
    const storedFriend = localStorage.getItem('selectedFriend')
    if (storedFriend) {
      setSelectedFriend(JSON.parse(storedFriend));
    } else if (friends.length >= 1 && storedFriend === null) {
      setSelectedFriend({'id':friends[0]._id, 'display_name':friends[0].display_name, 'username':friends[0].username});
      localStorage.setItem('selectedFriend', JSON.stringify({'id':friends[0]._id, 'display_name':friends[0].display_name, 'username':friends[0].username}));
    } else {
      console.error('No friends available');
    }
  }, [friends]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedFriend) {
        const storedFriend = JSON.parse(localStorage.getItem('selectedFriend'))
        setSelectedFriend({'id':storedFriend._id, 'display_name':storedFriend.display_name, 'username':storedFriend.username});
        updateMessages();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedFriend]);

  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, how are you?', sender: 'other' },  // other for received message
    { id: 2, text: 'I am fine, thank you!', sender: 'user' },  // user for sent message
  ]);

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      fetch('http://localhost:3000/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "senderUsername": username,
          "senderPassword": password,
          "recipientUsername": selectedFriendUsername,
          "message": {
            "text": message,
            "b64attachment": null,
          },
        }),
      })
      setMessage('');
    }
  }; 

  return (
    <div className="chat-container">
      
      <div className="chat-main">
        {/* Contact List on the right side */}
        <ContactList />

        {/* Chat Section */}
        <div className="chat-area">
          <div className="chat-header">Chat with {selectedFriendDisplayName} ({selectedFriendUsername})</div>
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
