import * as React from "react";
import { useState, useMemo } from "react";
import {
    Typography,
    Slider,
    CardContent,
    CssBaseline,
    Stack,
    Box,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
    borderRadius: 20,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

const COLORS = ["#0088FE", "#FFBB28"]; // investment vs interest colors

export default function LumpsumCalculator() {
    const [amount, setAmount] = useState(400000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(12);
    const [interestType, setInterestType] = useState("compound");

    // Calculate values
    const { futureValue, interestEarned } = useMemo(() => {
        let fv = 0;
        if (interestType === "simple") {
            fv = amount + (amount * rate * years) / 100;
        } else {
            fv = amount * Math.pow(1 + rate / 100, years);
        }
        return {
            futureValue: Math.round(fv),
            interestEarned: Math.round(fv - amount),
        };
    }, [amount, rate, years, interestType]);

    // Pie chart data
    const pieData = [
        { name: "Investment", value: amount },
        { name: "Interest Earned", value: interestEarned },
    ];

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Card sx={{ p: 3, width: "55%", height: "80%" }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary.main"
                        >
                            💰 Lumpsum Calculator
                        </Typography>

                        {/* Summary */}
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="primary.main"
                            >
                                ₹{futureValue.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                In {years} years @ {rate}% p.a. ({interestType} interest)
                            </Typography>
                        </Box>

                        {/* Pie Chart */}
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={120}
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val) =>
                                            `₹${val.toLocaleString()}`
                                        }
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>

                        {/* Interest Type Toggle */}
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Interest Type
                            </Typography>
                            <ToggleButtonGroup
                                value={interestType}
                                exclusive
                                onChange={(e, val) => val && setInterestType(val)}
                                aria-label="interest type"
                            >
                                <ToggleButton value="simple">Simple Interest</ToggleButton>
                                <ToggleButton value="compound">Compound Interest</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* Amount Slider */}
                        <Box>
                            <Typography gutterBottom>Investment Amount</Typography>
                            <Slider
                                value={amount}
                                min={10000}
                                max={1000000}
                                step={10000}
                                valueLabelDisplay="on"
                                valueLabelFormat={(val) =>
                                    `₹${val.toLocaleString()}`
                                }
                                onChange={(e, val) => setAmount(val)}
                            />
                        </Box>

                        {/* Rate Slider */}
                        <Box>
                            <Typography gutterBottom>Expected Return %</Typography>
                            <Slider
                                value={rate}
                                min={1}
                                max={20}
                                step={0.5}
                                valueLabelDisplay="on"
                                valueLabelFormat={(val) => `${val}%`}
                                onChange={(e, val) => setRate(val)}
                            />
                        </Box>

                        {/* Years Slider */}
                        <Box>
                            <Typography gutterBottom>
                                Investment Duration (Years)
                            </Typography>
                            <Slider
                                value={years}
                                min={1}
                                max={30}
                                step={1}
                                valueLabelDisplay="on"
                                onChange={(e, val) => setYears(val)}
                            />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </AppTheme>
    );
}
