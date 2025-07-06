import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `block px-4 py-3 rounded hover:bg-green-700 ${
      location.pathname === path ? 'bg-green-700' : 'bg-green-600'
    }`;

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-green-600 text-white shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-green-700">SplitWise</div>
      <nav className="mt-4 flex flex-col space-y-2">
        <Link to="/dashboard" className={linkClass('/dashboard')}>
          Dashboard
        </Link>
        <Link to="/friends" className={linkClass('/friends')}>
          Friends
        </Link>
        <Link to="/activity" className={linkClass('/activity')}>
          Activity Log
        </Link>
        <Link to="/settings" className={linkClass('/settings')}>
          Settings
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="mt-6 block px-4 py-3 rounded bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
