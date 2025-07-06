import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        axios.get('/api/users/friends', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/users/friend-requests', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sendFriendRequest = async () => {
    try {
      await axios.post(
        '/api/users/friends/request',
        { username: searchUsername },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Friend request sent to ${searchUsername}`);
      setSearchUsername('');
      fetchData();
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Error sending friend request');
    }
  };

  const respondToRequest = async (requesterId: string, accept: boolean) => {
    try {
      await axios.post(
        '/api/users/friend-requests/respond',
        { requesterId, accept },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Friends</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="border bg-gray-800 text-white placeholder-gray-400 px-3 py-2 mr-2 rounded"
        />
        <button
          onClick={sendFriendRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Friend
        </button>
        {message && <p className="text-sm mt-2 text-gray-400">{message}</p>}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Incoming Friend Requests</h3>
        {requests.length === 0 ? (
          <p className="text-gray-400">No incoming requests.</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((req) => (
              <li key={req._id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span>{req.username}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => respondToRequest(req._id, true)}
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToRequest(req._id, false)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Your Friends</h3>
        {friends.length === 0 ? (
          <p className="text-gray-400">You have no friends yet.</p>
        ) : (
          <ul className="list-disc ml-6 text-gray-300">
            {friends.map((friend) => (
              <li key={friend._id}>{friend.username}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
