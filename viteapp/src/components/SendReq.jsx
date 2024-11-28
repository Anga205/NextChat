import React, { useState, useEffect } from "react";
import "./SendReq.css";

const SendReq = () => {
  const [receivedRequests, setReceivedRequests] = useState([
    { display_name: "Ananth Rama", id: 1 },
    { display_name: "Kyued", id: 2 },
    { display_name: "Dinoboii", id: 3 },
  ]);

  const [friends, setFriends] = useState([
    { display_name: "Paras", id: 1 },
    { display_name: "Erin", id: 2 },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      // Simulated fetch data logic
      const userId = localStorage.getItem("id");
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      if (userId) {
        try {
          const response = await fetch("http://localhost:3000/getFriends", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          setFriends(data);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }

      try {
        const response = await fetch(
          "http://localhost:3000/getAllIncomingInvites",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          }
        );
        const data = await response.json();
        setReceivedRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAccept = (id) => {
    const request = receivedRequests.find((req) => req.id === id);
    setFriends([...friends, request]);
    setReceivedRequests(receivedRequests.filter((req) => req.id !== id));
  };

  const handleDeny = (id) => {
    setReceivedRequests(receivedRequests.filter((req) => req.id !== id));
  };

  const handleDeleteFriend = (id) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  const filteredRequests = receivedRequests.filter((request) =>
    request.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && !friends.some((friend) =>
          friend.display_name.toLowerCase() === searchQuery.toLowerCase()
        ) && (
          <button
            onClick={() => alert("Friend request sent!")}
          >
            Send Friend Request
          </button>
        )}
      </div>

      <div className="section">
        <h3>Received Requests</h3>
        {filteredRequests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="request-item">
              <span>{request.display_name}</span>
              <div>
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(request.id)}
                >
                  Confirm
                </button>
                <button
                  className="deny-btn"
                  onClick={() => handleDeny(request.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>Friends</h3>
        {friends.length === 0 ? (
          <p>No friends yet</p>
        ) : (
          friends.map((friend) => (
            <div key={friend.id} className="friend-item">
              <span>{friend.display_name}</span>
              <button
                className="delete-btn"
                onClick={() => handleDeleteFriend(friend.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SendReq;
