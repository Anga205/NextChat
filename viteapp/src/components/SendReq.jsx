import React, { useState, useEffect } from 'react';

const SendReq = () => {
  const [receivedRequests, setReceivedRequests] = useState([
    { display_name: 'Ananth Rama', id: 1 },
    { display_name: 'Kyued', id: 2 },
    { display_name: 'Dinoboii', id: 3 },
  ]);

  const [friends, setFriends] = useState([
    { display_name: 'Paras', id: 1 },
    { display_name: 'Erin', id: 2 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem('id');
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
      if (userId) {
        try {
          const response = await fetch('http://localhost:3000/getFriends', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          console.log(data);
          setFriends(data);
          
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }

      try {
        const response = await fetch('http://localhost:3000/getAllIncomingInvites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        console.log(data);
        setReceivedRequests(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to handle accept request
  const handleAccept = async (id, username) => {
    const response = await fetch('http://localhost:3000/sendInvite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "recipient": username, password: localStorage.getItem('password'), "sender": localStorage.getItem('username') }),
    })
    const request = receivedRequests.find(req => req.id === id);
    setFriends([...friends, request]);
    setReceivedRequests(receivedRequests.filter(req => req.id !== id));
  };

  // Function to handle deny request
  const handleDeny = (id) => {
    setReceivedRequests(receivedRequests.filter(req => req.id !== id));
  };

  // Function to handle delete friend
  const handleDeleteFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  // Function to filter the search results
  const filteredRequests = receivedRequests.filter(request => 
    request.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 w-full">
      <div className="mb-4 w-full">
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      {searchQuery && !friends.some(friend => friend.display_name.toLowerCase() === searchQuery.toLowerCase()) && (
        <button
          onClick={async () => {
            const response = await fetch('http://localhost:3000/sendInvite', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ recipient: searchQuery, password: localStorage.getItem('password'), sender: localStorage.getItem('username') }),
            });
            const data = await response.json();
            if (response.ok) {
              alert('Friend request sent');
            } else {
              alert(`Error sending friend request: ${data.error}`);
            }
          }}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Send Friend Request
        </button>
      )}
      </div>

      <div></div>
      <div className="mb-4 w-full">
        <h3 className="text-lg font-semibold mb-2">Received Requests</h3>
        {filteredRequests.length === 0 ? (
          <p className="text-gray-500">No requests found</p>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-2 border-b border-gray-200 w-full">
              <span>{request.display_name}</span>
              <div>
                <button
                  onClick={() => handleAccept(request.id, request.username)}
                  className="mr-2 p-1 bg-green-500 text-white rounded"
                >
                  ✔
                </button>
                <button
                  onClick={() => handleDeny(request.id)}
                  className="p-1 bg-gray-500 text-white rounded"
                >
                  ❌
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2">Friends</h3>
        {friends.length === 0 ? (
          <p className="text-gray-500">No friends yet</p>
        ) : (
          friends.map(friend => (
            <div key={friend.id} className="flex items-center justify-between p-2 border-b border-gray-200 w-full">
              <span>{friend.display_name}</span>
              <button
                onClick={() => handleDeleteFriend(friend.id)}
                className="p-1 bg-gray-500 text-white rounded"
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SendReq;
