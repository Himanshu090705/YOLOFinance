import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
    Typography,
    Slider,
    CardContent,
    CssBaseline,
    Stack,
    Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Chart from "chart.js/auto";
import MuiCard from "@mui/material/Card";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";

// Styled Card
const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
    minHeight: "700px",
    height: "auto",
    overflowX: "hidden",
    overflowY: "auto",
}));

const CalculatorContainer = styled(Stack)(({ theme }) => ({
    height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
    minHeight: "100%",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        zIndex: -1,
        inset: 0,
        backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
        ...theme.applyStyles("dark", {
            backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
        }),
    },
}));

const SipCalculator = () => {
    const [monthlySip, setMonthlySip] = useState(1000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [years, setYears] = useState(10);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const calculateSipValue = (year) => {
        if (monthlySip <= 0 || expectedReturn <= 0 || year <= 0) {
            return { totalInvestment: 0, gain: 0, totalValue: 0 };
        }
        const months = year * 12;
        const totalInvestment = monthlySip * months;
        const monthlyRate = expectedReturn / 100 / 12;
        const futureValue =
            monthlySip *
            (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
                (1 + monthlyRate));
        return {
            totalInvestment: Math.round(totalInvestment),
            gain: Math.round(futureValue - totalInvestment),
            totalValue: Math.round(futureValue),
        };
    };

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");
        if (chartInstance.current) chartInstance.current.destroy();

        const data = {
            labels: ["1Y", "3Y", "5Y", "10Y"],
            datasets: [
                {
                    label: "Investment",
                    data: [
                        calculateSipValue(1).totalInvestment,
                        calculateSipValue(3).totalInvestment,
                        calculateSipValue(5).totalInvestment,
                        calculateSipValue(10).totalInvestment,
                    ],
                    backgroundColor: "#90CAF9", // Light Blue
                    borderColor: "#42A5F5",
                    borderWidth: 1,
                    borderRadius: 20,
                    borderSkipped: false,
                    stack: "Stack 0",
                },
                {
                    label: "Gain",
                    data: [
                        calculateSipValue(1).gain,
                        calculateSipValue(3).gain,
                        calculateSipValue(5).gain,
                        calculateSipValue(10).gain,
                    ],
                    backgroundColor: "#1976D2", // Dark Blue
                    borderColor: "#0D47A1",
                    borderWidth: 1,
                    borderRadius: 20,
                    borderSkipped: false,
                    stack: "Stack 0",
                },
            ],
        };

        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: "SIP Growth Over Time",
                        font: { size: 16, weight: "bold" },
                        color: "#333",
                        padding: 10,
                    },
                    legend: {
                        display: true,
                        position: "top",
                        labels: {
                            font: { size: 14, weight: "bold" },
                            color: "#444",
                            boxWidth: 20,
                            padding: 10,
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.85)",
                        titleFont: { size: 14 },
                        bodyFont: { size: 12 },
                        borderColor: "#555",
                        borderWidth: 1,
                        cornerRadius: 6,
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || "";
                                if (label) label += ": ";
                                if (context.parsed.y !== null)
                                    label +=
                                        "₹" +
                                        context.parsed.y.toLocaleString(
                                            "en-IN"
                                        );
                                return label;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: { font: { size: 12, weight: "bold" } },
                        grid: { display: false },
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            callback: (value) =>
                                "₹" + value.toLocaleString("en-IN"),
                            font: { size: 12 },
                        },
                        grid: {
                            color: "#E0E0E0",
                            borderDash: [5, 5],
                            drawBorder: false,
                        },
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [monthlySip, expectedReturn, years]);

    const { totalInvestment, gain, totalValue } = calculateSipValue(years);

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <CalculatorContainer
                direction="column"
                justifyContent="space-between"
            >
                <ColorModeSelect
                    sx={{ position: "fixed", top: "1rem", right: "1rem" }}
                />
                <Card variant="outlined">
                    <CardContent>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                        >
                            SIP Calculator
                        </Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Total Value: ₹{totalValue.toLocaleString("en-IN")}
                        </Typography>
                        <Typography variant="body2">
                            When you invest ₹
                            {monthlySip.toLocaleString("en-IN")}/month over{" "}
                            {years} years
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#42A5F5" }}>
                            Investment: ₹
                            {totalInvestment.toLocaleString("en-IN")}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#1976D2" }}>
                            Gain: ₹{gain.toLocaleString("en-IN")}
                        </Typography>

                        <canvas
                            ref={chartRef}
                            style={{
                                marginTop: "20px",
                                width: "100%",
                                maxHeight: "300px",
                            }}
                        ></canvas>

                        <Stack spacing={4} sx={{ mt: 3, width: "100%" }}>
                            {/* Monthly SIP */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                <Slider
                                    value={monthlySip}
                                    min={1000}
                                    max={10000}
                                    step={1000}
                                    onChange={(e, val) => setMonthlySip(val)}
                                    valueLabelDisplay="auto"
                                    marks={[
                                        { value: 1000, label: "₹1k" },
                                        { value: 5000, label: "₹5k" },
                                        { value: 10000, label: "₹10k" },
                                    ]}
                                    sx={{ width: "90%" }}
                                />
                            </Box>

                            {/* Expected Return */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                <Slider
                                    value={expectedReturn}
                                    min={1}
                                    max={20}
                                    step={0.5}
                                    onChange={(e, val) =>
                                        setExpectedReturn(val)
                                    }
                                    valueLabelDisplay="auto"
                                    marks={[
                                        { value: 1, label: "1%" },
                                        { value: 10, label: "10%" },
                                        { value: 20, label: "20%" },
                                    ]}
                                    sx={{ width: "90%" }}
                                />
                            </Box>

                            {/* Years */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                <Slider
                                    value={years}
                                    min={1}
                                    max={30}
                                    step={1}
                                    onChange={(e, val) => setYears(val)}
                                    valueLabelDisplay="auto"
                                    marks={[
                                        { value: 1, label: "1Y" },
                                        { value: 5, label: "5Y" },
                                        { value: 10, label: "10Y" },
                                        { value: 20, label: "20Y" },
                                        { value: 30, label: "30Y" },
                                    ]}
                                    sx={{ width: "90%" }}
                                />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </CalculatorContainer>
        </AppTheme>
    );
};

export default SipCalculator;
