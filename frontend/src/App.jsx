import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/Login" />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default App;
