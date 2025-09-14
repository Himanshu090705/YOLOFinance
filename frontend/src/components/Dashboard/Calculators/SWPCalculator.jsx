import * as React from "react";
import { useState, useMemo } from "react";
import {
    Typography,
    Slider,
    CardContent,
    CssBaseline,
    Stack,
    Box,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
    borderRadius: 20,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

export default function SwpCalculator() {
    const [initialInvestment, setInitialInvestment] = useState(500000); // starting corpus
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(1000);
    const [expectedReturn, setExpectedReturn] = useState(8);
    const [years, setYears] = useState(10);

    // Calculate SWP
    const data = useMemo(() => {
        const monthlyRate = expectedReturn / 12 / 100;
        let balance = initialInvestment;
        const result = [];

        for (let m = 1; m <= years * 12; m++) {
            balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
            if (balance < 0) {
                balance = 0;
            }

            if (m % 12 === 0) {
                result.push({
                    year: `Year ${m / 12}`,
                    Balance: Math.max(balance, 0),
                });
            }
        }
        return result;
    }, [initialInvestment, monthlyWithdrawal, expectedReturn, years]);

    const finalBalance = data.length > 0 ? data[data.length - 1].Balance : 0;

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Card sx={{ p: 3, width: "45%", height: "70%" }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary.main"
                        >
                            💸 SWP Calculator
                        </Typography>

                        {/* Summary */}
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="primary.main"
                            >
                                ₹{finalBalance.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Balance after {years} years
                            </Typography>
                        </Box>

                        {/* Chart */}
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <XAxis dataKey="year" stroke="#aaa" />
                                    <YAxis
                                        tickFormatter={(val) =>
                                            `₹${val / 1000}k`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(val) =>
                                            `₹${val.toLocaleString()}`
                                        }
                                        contentStyle={{
                                            backgroundColor: "#222",
                                            borderRadius: "8px",
                                            border: "none",
                                            color: "#fff",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Balance"
                                        stroke="#00acc1"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>

                        {/* Input Fields */}
                        <Stack spacing={2}>
                            <TextField
                                label="Initial Investment (₹)"
                                type="text"
                                fullWidth
                                value={initialInvestment}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        // ✅ allow only numbers
                                        setInitialInvestment(Number(val));
                                    }
                                }}
                                InputProps={{
                                    inputProps: {
                                        inputMode: "numeric",
                                        pattern: "[0-9]*",
                                    }, // ✅ mobile-friendly
                                    style: { textAlign: "left" },
                                }}
                            />

                            <TextField
                                label="Monthly Withdrawal (₹)"
                                type="text"
                                fullWidth
                                value={monthlyWithdrawal}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        // ✅ allow only numbers
                                        setMonthlyWithdrawal(Number(val));
                                    }
                                }}
                                 InputProps={{
                                    inputProps: {
                                        inputMode: "numeric",
                                        pattern: "[0-9]*",
                                    }, // ✅ mobile-friendly
                                    style: { textAlign: "left" },
                                }}
                            />
                        </Stack>

                        {/* Sliders */}
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Expected Returns % (p.a.)
                            </Typography>
                            <Slider
                                value={expectedReturn}
                                min={4}
                                max={15}
                                step={0.5}
                                valueLabelDisplay="on"
                                valueLabelFormat={(val) => `${val}%`}
                                onChange={(e, val) => setExpectedReturn(val)}
                            />
                        </Box>

                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Duration (Years)
                            </Typography>
                            <Slider
                                value={years}
                                min={1}
                                max={30}
                                step={1}
                                valueLabelDisplay="on"
                                valueLabelFormat={(val) => `${val}y`}
                                onChange={(e, val) => setYears(val)}
                            />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </AppTheme>
    );
}
