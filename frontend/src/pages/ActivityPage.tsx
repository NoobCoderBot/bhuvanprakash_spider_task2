import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/activities', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6 ml-64 min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
      {logs.length === 0 ? (
        <p className="text-gray-400">No recent activity.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li
              key={log._id}
              className="p-4 bg-gray-800 border border-gray-700 rounded shadow hover:bg-gray-700 transition"
            >
              <p>{log.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                 {new Date(log.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityPage;
