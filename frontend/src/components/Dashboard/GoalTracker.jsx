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
import SideMenu from './components/SideMenu.jsx';
import AppNavbar from './components/AppNavbar.jsx';
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
        <AppTheme>
            <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'background.default' }}>
                {/* Sidebar */}
                <Box sx={{ width: 260, bgcolor: 'background.paper', display: { xs: 'none', md: 'block' }, height: '100vh', boxShadow: 3, zIndex: 2 }}>
                    <SideMenu />
                </Box>
                {/* Main Content */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Box sx={{ width: '100%', zIndex: 3 }}>
                        <AppNavbar />
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', px: { xs: 1, md: 4 }, py: 4, overflowY: 'auto' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            🎯 Goal Tracker
                        </Typography>
                        <Card
                            sx={{
                                mb: 4,
                                p: 2,
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #2a2a2a',
                                borderRadius: 3,
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.4)',
                                width: '100%',
                                maxWidth: 600,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Add a New Goal
                                </Typography>
                                <Box component="form" onSubmit={addGoal} noValidate sx={{ mt: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="Goal Name"
                                                value={goalName}
                                                onChange={(e) => setGoalName(e.target.value)}
                                                InputProps={{ style: { color: 'white' } }}
                                                InputLabelProps={{ style: { color: '#aaa' } }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: '#333' },
                                                        '&:hover fieldset': { borderColor: '#555' },
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Target Amount (₹)"
                                                value={targetAmount}
                                                onChange={(e) => setTargetAmount(e.target.value)}
                                                InputProps={{ style: { color: 'white' } }}
                                                InputLabelProps={{ style: { color: '#aaa' } }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: '#333' },
                                                        '&:hover fieldset': { borderColor: '#555' },
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="Target Date"
                                                InputLabelProps={{ shrink: true, style: { color: '#aaa' } }}
                                                value={targetDate}
                                                onChange={(e) => {
                                                    setTargetDate(e.target.value);
                                                    setDateError('');
                                                }}
                                                InputProps={{ style: { color: 'white' } }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: '#333' },
                                                        '&:hover fieldset': { borderColor: '#555' },
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Add Goal
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Show error alert below the form */}
                                {dateError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {dateError}
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Goals List with LinearProgress */}
                        <Typography variant="h6" gutterBottom color="primary">
                            Your Goals
                        </Typography>
                        {goals.length === 0 ? (
                            <Typography color="gray" sx={{ mt: 4 }}>No goals added yet.</Typography>
                        ) : (
                            goals.map((goal, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        mb: 2,
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #2a2a2a',
                                        borderRadius: 3,
                                        boxShadow: '0px 4px 20px rgba(0,0,0,0.4)',
                                        width: '100%',
                                        maxWidth: 600,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold" color="#fff">
                                            {goal.name}
                                        </Typography>
                                        <Typography variant="body2" color="gray">
                                            Target: ₹{goal.targetAmount.toLocaleString()} | Date: {goal.targetDate}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={0}
                                                sx={{
                                                    height: 12,
                                                    borderRadius: 5,
                                                    backgroundColor: '#333',
                                                    '& .MuiLinearProgress-bar': {
                                                        background: 'linear-gradient(90deg,#00c853,#64dd17)',
                                                    },
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                                                0% achieved
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </Box>
                </Box>
            </Box>
        </AppTheme>
    );
};

export default GoalTracker;
