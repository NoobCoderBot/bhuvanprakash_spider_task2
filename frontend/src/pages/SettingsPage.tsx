import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-gray-800 p-4 rounded shadow max-w-sm border border-gray-700">
          <p><span className="font-semibold">Username:</span> {username}</p>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
