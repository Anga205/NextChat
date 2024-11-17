// src/components/ContactList.jsx
import React from 'react';
import { Link } from 'react-router-dom';  // For linking to the chat with that contact
import './ContactList.css';  // Importing CSS for styling

const ContactList = () => {
    const contacts = [
        { id: 1, name: 'John Doe', status: 'Hey, how are you?', img: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Jane Smith', status: 'Available now', img: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Alice Johnson', status: 'Last seen at 2:45 PM', img: 'https://via.placeholder.com/40' },
        { id: 4, name: 'Bob Brown', status: 'Offline', img: 'https://via.placeholder.com/40' },
        { id: 5, name: 'Charlie Miller', status: 'Busy at the moment', img: 'https://via.placeholder.com/40' },
        { id: 6, name: 'Sophia Davis', status: 'At work', img: 'https://via.placeholder.com/40' },
        { id: 7, name: 'Liam Wilson', status: 'Available to chat', img: 'https://via.placeholder.com/40' },
        { id: 8, name: 'Emma White', status: 'Last seen 1 hour ago', img: 'https://via.placeholder.com/40' },
        { id: 9, name: 'Lucas Harris', status: 'Away', img: 'https://via.placeholder.com/40' },
        { id: 10, name: 'Mia Clark', status: 'Do not disturb', img: 'https://via.placeholder.com/40' },
        { id: 11, name: 'Ethan Lewis', status: 'In a meeting', img: 'https://via.placeholder.com/40' },
        { id: 12, name: 'Oliver Walker', status: 'Online', img: 'https://via.placeholder.com/40' },
        { id: 13, name: 'Amelia Allen', status: 'At the gym', img: 'https://via.placeholder.com/40' },
        { id: 14, name: 'James Scott', status: 'Not available', img: 'https://via.placeholder.com/40' },
        { id: 15, name: 'Isabella Young', status: 'Looking for a quick chat?', img: 'https://via.placeholder.com/40' },
        { id: 16, name: 'Benjamin King', status: 'Available', img: 'https://via.placeholder.com/40' },
        { id: 17, name: 'Harper Thompson', status: 'Busy, please leave a message', img: 'https://via.placeholder.com/40' },
        { id: 18, name: 'Alexander Rodriguez', status: 'No status', img: 'https://via.placeholder.com/40' },
        { id: 19, name: 'Charlotte Lee', status: 'At a coffee shop', img: 'https://via.placeholder.com/40' },
        { id: 20, name: 'Michael Perez', status: 'Offline', img: 'https://via.placeholder.com/40' },
        { id: 21, name: 'Ella Martin', status: 'In a call', img: 'https://via.placeholder.com/40' },
        { id: 22, name: 'William Carter', status: 'Just got back from vacation', img: 'https://via.placeholder.com/40' },
        { id: 23, name: 'Grace Evans', status: 'Taking a break', img: 'https://via.placeholder.com/40' },
        { id: 24, name: 'Noah Green', status: 'Not online', img: 'https://via.placeholder.com/40' },
        { id: 25, name: 'Ava White', status: 'Working on a project', img: 'https://via.placeholder.com/40' },
        { id: 26, name: 'Daniel Harris', status: 'Available for a chat', img: 'https://via.placeholder.com/40' },
        { id: 27, name: 'Zoe Adams', status: 'Out for lunch', img: 'https://via.placeholder.com/40' },
        { id: 28, name: 'Jack Miller', status: 'Not interested in chatting', img: 'https://via.placeholder.com/40' },
        { id: 29, name: 'Nora Nelson', status: 'In class', img: 'https://via.placeholder.com/40' },
        { id: 30, name: 'Henry King', status: 'Available', img: 'https://via.placeholder.com/40' },
        // Add more contacts as needed
      ];
      

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <Link to={`/chat/${contact.id}`} key={contact.id} className="contact-item">
          <img src={contact.img} alt={contact.name} className="contact-img" />
          <div className="contact-info">
            <div className="contact-name">{contact.name}</div>
            <div className="contact-status">{contact.status}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ContactList;
