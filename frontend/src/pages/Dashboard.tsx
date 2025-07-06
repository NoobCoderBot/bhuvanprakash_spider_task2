import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await axios.get('/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch groups');
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get('/api/users/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error('Failed to fetch friends');
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchFriends();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      await axios.post(
        '/api/groups',
        {
          name: groupName,
          members: selectedFriends, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroupName('');
      setSelectedFriends([]);
      fetchGroups();
    } catch (err: any) {
      console.error('Create group error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">My Groups</h2>

      <div className="bg-gray-800 p-4 rounded mb-8">
        <h3 className="text-lg font-semibold mb-2">Create New Group</h3>
        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
        />

        <label className="block text-sm mb-1">Add Friends</label>
        <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
          {friends.length === 0 ? (
            <p className="text-gray-400">You have no friends to add.</p>
          ) : (
            friends.map((friend) => (
              <label key={friend._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={friend._id}
                  checked={selectedFriends.includes(friend._id)}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedFriends((prev) =>
                      prev.includes(id)
                        ? prev.filter((fid) => fid !== id)
                        : [...prev, id]
                    );
                  }}
                />
                <span>{friend.username}</span>
              </label>
            ))
          )}
        </div>

        <button
          onClick={handleCreateGroup}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Create Group
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Your Groups</h3>
        {groups.length === 0 ? (
          <p className="text-gray-400">No groups yet.</p>
        ) : (
          <ul className="space-y-2">
            {groups.map((group) => (
              <li
                key={group._id}
                onClick={() => navigate(`/group/${group._id}`)}
                className="bg-gray-800 p-3 rounded hover:bg-gray-700 cursor-pointer"
              >
                {group.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
