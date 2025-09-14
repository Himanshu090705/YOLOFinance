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
import MarketingPage from "./components/Home/MarketingPage";
import MutualFundDashboard from "./components/Dashboard/MutualFundDashboard";
import MutualFunds from "./components/Dashboard/MutualFunds";
import GoalTracker from "./components/Dashboard/GoalTracker";
import NewsLetter from "./components/Home/NewsLetter";
import Chatbot from "./components/Common/ChatBot";
import PaymentPage from "./components/Dashboard/components/PaymentPage";
import Profile from "./components/Auth/Profile";
import GoalDashboard from "./components/Dashboard/GoalDashboard";
import InsuranceDashboard from "./components/Dashboard/InsuranceDashboard";
import SWPDashboard from "./components/Dashboard/SWPDashboard";
import ReportsDashboard from "./components/Dashboard/ReportsDashboard";
import CalcDashboard from "./components/Dashboard/CalcDashboard";

const App = () => (
    <Router>
        <div className="relative min-h-screen">
            <Routes>
                <Route path="/" element={<MarketingPage />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Signup" element={<SignUp />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/MutualFunds" element={<MutualFunds />} />
                <Route path="/CalcDashboard" element={<CalcDashboard />} />
                <Route path="/GoalDashboard" element={<GoalDashboard />} />
                <Route path="/InsuranceDashboard" element={<InsuranceDashboard />} />
                <Route path="/SWPDashboard" element={<SWPDashboard />} />
                <Route path="/ReportsDashboard" element={<ReportsDashboard />} />
                <Route path="/NewsLetter" element={<NewsLetter />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
            <Chatbot />
        </div>
    </Router>
);

export default App;
