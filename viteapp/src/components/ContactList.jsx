// src/components/ContactList.jsx
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';  // For linking to the chat with that contact
import './ContactList.css';  // Importing CSS for styling

const ContactList = () => {
    var [contacts, setContacts] = useState([
        { id: 1, display_name: 'John Doe', status: 'Hey, how are you?', img: 'https://via.placeholder.com/40' },
        { id: 2, display_name: 'Jane Smith', status: 'Available now', img: 'https://via.placeholder.com/40' },
        { id: 3, display_name: 'Alice Johnson', status: 'Last seen at 2:45 PM', img: 'https://via.placeholder.com/40' },
        { id: 4, display_name: 'Bob Brown', status: 'Offline', img: 'https://via.placeholder.com/40' },
        { id: 5, display_name: 'Charlie Miller', status: 'Busy at the moment', img: 'https://via.placeholder.com/40' },
        { id: 6, display_name: 'Sophia Davis', status: 'At work', img: 'https://via.placeholder.com/40' },
      ]);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
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
            setContacts(data);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <Link to={`/chat/${contact.id}`} key={contact.id} className="contact-item">
          <img src={"https://robohash.org/stefan-"+contact.username} alt={contact.display_name} className="contact-img" />
          <div className="contact-info">
            <div className="contact-name">{contact.display_name}</div>
            <div className="contact-status">{contact.status}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ContactList;
