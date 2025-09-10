import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Box,
    Grid,
    Alert
} from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
// import SideMenu from './components/SideMenu.jsx';
// import AppNavbar from './components/AppNavbar.jsx';
import LinearProgress from '@mui/material/LinearProgress';

const GoalTracker = () => {
    const [goals, setGoals] = useState([]);
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [dateError, setDateError] = useState('');

    const isDateValid = (dateStr) => {
        if (!dateStr) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(dateStr);
        inputDate.setHours(0, 0, 0, 0);
        return inputDate >= today;
    };

    const addGoal = (e) => {
        e.preventDefault();
        setDateError('');
        if (!goalName || !targetAmount || !targetDate) return;
        if (!isDateValid(targetDate)) {
            setDateError('Target date must be today or a future date.');
            return;
        }
        const newGoal = {
            name: goalName,
            targetAmount: parseFloat(targetAmount),
            targetDate,
        };
        setGoals([...goals, newGoal]);
        setGoalName('');
        setTargetAmount('');
        setTargetDate('');
    };

    return (
       <></>
    );
};

export default GoalTracker;
