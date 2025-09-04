<<<<<<< Updated upstream
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import MarketingPage from './components/Home/MarketingPage';
import MutualFundDashboard from './components/Dashboard/MutualFundDashboard';
import MutualFunds from './components/Dashboard/MutualFunds';
import SipCalculator from './components/Home/SipCalculator';
import GoalTracker from './components/Dashboard/GoalTracker';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MarketingPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path='/MutualFunds' element={<MutualFunds />}></Route>
      <Route path="/SipCalculator" element={<SipCalculator />} />
      <Route path="/GoalTracker" element={<GoalTracker />} />
    </Routes>
  </Router>
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import MarketingPage from "./components/Home/MarketingPage";
import MutualFunds from "./components/Dashboard/MutualFunds";
import SipCalculator from "./components/Home/SipCalculator";
import ChatBot from "./components/Common/ChatBot"; // portal-based chatbot

const App = () => (
    <Router>
        <div className="relative min-h-screen">
            <Routes>
                <Route path="/" element={<MarketingPage />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Signup" element={<SignUp />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/MutualFunds" element={<MutualFunds />} />
                <Route path="/SipCalculator" element={<SipCalculator />} />
            </Routes>

            {/* Chatbot now renders via React Portal, 
          so it always floats above every page */}
            <ChatBot />
        </div>
    </Router>
>>>>>>> Stashed changes
);

export default App;
