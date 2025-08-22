import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import SipCalculator from "./components/Home/SipCalculator";
import MarketingPage from "./components/Home/MarketingPage";

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<MarketingPage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/SipCalculator" element={<SipCalculator />} />
        </Routes>
    </Router>
);

export default App;
