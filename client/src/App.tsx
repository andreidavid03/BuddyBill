import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Trip from './pages/Trips';
import Status from './pages/Status';
import Notifications from './components/notifications/NotificationList';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import EditTrip from './pages/EditTrip';

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip" element={<Trip />} />
          <Route path="/status" element={<Status />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trip/:id/edit" element={<EditTrip />} />
        </Routes>
      
    </Router>
  );
}

export default App;