import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GroupPage from './pages/GroupPage';
import FriendsPage from './pages/FriendsPage';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';

import ProtectedLayout from './components/ProtectedLayout';
import RequireAuth from './components/RequireAuth';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/group/:id"
          element={
            <RequireAuth>
              <ProtectedLayout>
                <GroupPage />
              </ProtectedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/friends"
          element={
            <RequireAuth>
              <ProtectedLayout>
                <FriendsPage />
              </ProtectedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/activity"
          element={
            <RequireAuth>
              <ProtectedLayout>
                <ActivityPage />
              </ProtectedLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
