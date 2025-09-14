// /src/Dashboard/Calculators/RetirementCorpusCalculatorDetailed.jsx
import * as React from "react";
import { useState, useMemo } from "react";
import {
    Typography,
    Slider,
    CardContent,
    CssBaseline,
    Stack,
    Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import MuiCard from "@mui/material/Card";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
    borderRadius: 20,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

export default function RetirementCorpusCalculator() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(60);
    const [lifeExpectancy, setLifeExpectancy] = useState(85);
    const [monthlyExpense, setMonthlyExpense] = useState(40000);
    const [inflation, setInflation] = useState(6);
    const [returnRate, setReturnRate] = useState(8);

    const { corpusNeeded, data } = useMemo(() => {
        const yearsAfterRetire = lifeExpectancy - retireAge;
        const inflatedExpense =
            monthlyExpense *
            Math.pow(1 + inflation / 100, retireAge - currentAge);
        const annualExpenseAtRetirement = inflatedExpense * 12;

        let corpus = annualExpenseAtRetirement;
        const r = (returnRate - inflation) / 100;
        if (r > 0) {
            corpus =
                annualExpenseAtRetirement *
                ((1 - Math.pow(1 + r, -yearsAfterRetire)) / r);
        } else {
            corpus = annualExpenseAtRetirement * yearsAfterRetire;
        }

        let yearlyData = [];
        let expense = annualExpenseAtRetirement;
        let remainingCorpus = corpus;
        for (let i = 1; i <= yearsAfterRetire; i++) {
            remainingCorpus =
                remainingCorpus * (1 + returnRate / 100) - expense;
            yearlyData.push({
                year: `Y${i}`,
                Expense: Math.round(expense),
                Corpus: Math.max(0, Math.round(remainingCorpus)),
            });
            expense *= 1 + inflation / 100;
        }

        return { corpusNeeded: Math.round(corpus), data: yearlyData };
    }, [
        currentAge,
        retireAge,
        lifeExpectancy,
        monthlyExpense,
        inflation,
        returnRate,
    ]);

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Card sx={{ p: 3, width: "65%", height: "85%" }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary.main"
                        >
                            🧓 Retirement Corpus Calculator (Detailed)
                        </Typography>

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="primary.main"
                            >
                                Corpus Required: ₹
                                {corpusNeeded.toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Line Chart for Yearly Breakdown */}
                        <Box sx={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <XAxis dataKey="year" stroke="#aaa" />
                                    <YAxis
                                        tickFormatter={(val) => {
                                            if (val >= 10000000)
                                                return (
                                                    (val / 10000000).toFixed(
                                                        1
                                                    ) + " Cr"
                                                ); // Crores
                                            if (val >= 100000)
                                                return (
                                                    (val / 100000).toFixed(1) +
                                                    " L"
                                                ); // Lakhs
                                            if (val >= 1000)
                                                return (
                                                    (val / 1000).toFixed(1) +
                                                    " K"
                                                ); // Thousands
                                            return val;
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(val) =>
                                            `₹${val.toLocaleString()}`
                                        }
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="Expense"
                                        stroke="#ef5350"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Corpus"
                                        stroke="#1565c0"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>

                        {/* Sliders */}
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Current Age
                            </Typography>
                            <Slider
                                value={currentAge}
                                min={20}
                                max={50}
                                step={1}
                                valueLabelDisplay="on"
                                onChange={(e, val) => setCurrentAge(val)}
                            />
                        </Box>
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Retirement Age
                            </Typography>
                            <Slider
                                value={retireAge}
                                min={50}
                                max={70}
                                step={1}
                                valueLabelDisplay="on"
                                onChange={(e, val) => setRetireAge(val)}
                            />
                        </Box>
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Life Expectancy
                            </Typography>
                            <Slider
                                value={lifeExpectancy}
                                min={70}
                                max={100}
                                step={1}
                                valueLabelDisplay="on"
                                onChange={(e, val) => setLifeExpectancy(val)}
                            />
                        </Box>
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Current Monthly Expenses
                            </Typography>
                            <Slider
                                value={monthlyExpense}
                                min={10000}
                                max={200000}
                                step={5000}
                                valueLabelDisplay="on"
                                valueLabelFormat={(val) =>
                                    `₹${val.toLocaleString()}`
                                }
                                onChange={(e, val) => setMonthlyExpense(val)}
                            />
                        </Box>
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Inflation Rate % (p.a.)
                            </Typography>
                            <Slider
                                value={inflation}
                                min={2}
                                max={12}
                                step={0.5}
                                valueLabelDisplay="on"
                                valueLabelFormat={(val) => `${val}%`}
                                onChange={(e, val) => setInflation(val)}
                            />
                        </Box>
                        <Box>
                            <Typography gutterBottom color="primary.main">
                                Post-Retirement Return % (p.a.)
                            </Typography>
                            <Slider
                                value={returnRate}
                                min={2}
                                max={12}
                                step={0.5}
                                valueLabelDisplay="on"
                                valueLabelFormat={(val) => `${val}%`}
                                onChange={(e, val) => setReturnRate(val)}
                            />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </AppTheme>
    );
}
