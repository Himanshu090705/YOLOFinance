import * as React from "react";
import { useState, useMemo } from "react";
import {
    Typography,
    TextField,
    CardContent,
    CssBaseline,
    Stack,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
    borderRadius: 20,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

export default function IncomeTaxCalculator() {
    const [income, setIncome] = useState(800000);
    const [deduction80C, setDeduction80C] = useState(100000);
    const [deduction80D, setDeduction80D] = useState(20000);
    const [regime, setRegime] = useState("old");

    const result = useMemo(() => {
        let taxableIncome = income;
        let deductions = 0;

        if (regime === "old") {
            const stdDeduction = 50000;
            const d80C = Math.min(deduction80C, 150000);
            const d80D = Math.min(deduction80D, 25000);
            deductions = stdDeduction + d80C + d80D;
            taxableIncome = Math.max(income - deductions, 0);
        }

        let tax = 0;
        if (regime === "old") {
            if (taxableIncome <= 250000) tax = 0;
            else if (taxableIncome <= 500000)
                tax = (taxableIncome - 250000) * 0.05;
            else if (taxableIncome <= 1000000)
                tax = 12500 + (taxableIncome - 500000) * 0.2;
            else tax = 112500 + (taxableIncome - 1000000) * 0.3;

            if (taxableIncome <= 500000) tax = 0; // rebate u/s 87A
        } else {
            if (taxableIncome <= 300000) tax = 0;
            else if (taxableIncome <= 600000)
                tax = (taxableIncome - 300000) * 0.05;
            else if (taxableIncome <= 900000)
                tax = 15000 + (taxableIncome - 600000) * 0.1;
            else if (taxableIncome <= 1200000)
                tax = 45000 + (taxableIncome - 900000) * 0.15;
            else if (taxableIncome <= 1500000)
                tax = 90000 + (taxableIncome - 1200000) * 0.2;
            else tax = 150000 + (taxableIncome - 1500000) * 0.3;

            if (taxableIncome <= 700000) tax = 0; // rebate u/s 87A
        }

        const cess = tax * 0.04;
        const totalTax = Math.round(tax + cess);

        return {
            taxableIncome,
            deductions,
            tax: Math.round(tax),
            cess: Math.round(cess),
            totalTax,
        };
    }, [income, deduction80C, deduction80D, regime]);

    // Slab Data
    const oldRegimeSlabs = [
        { range: "₹0 – ₹2,50,000", rate: "0%" },
        { range: "₹2,50,001 – ₹5,00,000", rate: "5%" },
        { range: "₹5,00,001 – ₹10,00,000", rate: "20%" },
        { range: "Above ₹10,00,000", rate: "30%" },
    ];

    const newRegimeSlabs = [
        { range: "₹0 – ₹3,00,000", rate: "0%" },
        { range: "₹3,00,001 – ₹6,00,000", rate: "5%" },
        { range: "₹6,00,001 – ₹9,00,000", rate: "10%" },
        { range: "₹9,00,001 – ₹12,00,000", rate: "15%" },
        { range: "₹12,00,001 – ₹15,00,000", rate: "20%" },
        { range: "Above ₹15,00,000", rate: "30%" },
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
                            🧾 Income Tax Calculator
                        </Typography>

                        {/* Regime Toggle */}
                        <ToggleButtonGroup
                            value={regime}
                            exclusive
                            onChange={(e, val) => val && setRegime(val)}
                            sx={{ alignSelf: "center" }}
                        >
                            <ToggleButton value="old">Old Regime</ToggleButton>
                            <ToggleButton value="new">New Regime</ToggleButton>
                        </ToggleButtonGroup>

                        {/* Summary */}
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="primary.main"
                            >
                                ₹{result.totalTax.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tax Payable (including 4% cess)
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Taxable Income: ₹
                                {result.taxableIncome.toLocaleString()}
                            </Typography>
                            {regime === "old" && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Deductions applied: ₹
                                    {result.deductions.toLocaleString()}
                                </Typography>
                            )}
                        </Box>

                        {/* Input Fields */}
                        <Stack spacing={2}>
                            <TextField
                                label="Annual Income (₹)"
                                type="text"
                                fullWidth
                                value={income}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) setIncome(Number(val));
                                }}
                                InputProps={{
                                    inputProps: {
                                        inputMode: "numeric",
                                        pattern: "[0-9]*",
                                    },
                                    style: { textAlign: "left" },
                                }}
                            />
                            {regime === "old" && (
                                <>
                                    <TextField
                                        label="Deductions 80C (₹)"
                                        type="text"
                                        fullWidth
                                        value={deduction80C}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val))
                                                setDeduction80C(Number(val));
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                inputMode: "numeric",
                                                pattern: "[0-9]*",
                                            },
                                            style: { textAlign: "left" },
                                        }}
                                    />
                                    <TextField
                                        label="Deductions 80D (₹)"
                                        type="text"
                                        fullWidth
                                        value={deduction80D}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val))
                                                setDeduction80D(Number(val));
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                inputMode: "numeric",
                                                pattern: "[0-9]*",
                                            },
                                            style: { textAlign: "left" },
                                        }}
                                    />
                                </>
                            )}
                        </Stack>

                        {/* Tax Slab Table */}
                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ mt: 2, mb: 1 }}
                            >
                                {regime === "old"
                                    ? "Old Regime Tax Slabs"
                                    : "New Regime Tax Slabs"}
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{ fontWeight: "bold" }}
                                            >
                                                Income Range
                                            </TableCell>
                                            <TableCell
                                                sx={{ fontWeight: "bold" }}
                                            >
                                                Tax Rate
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(regime === "old"
                                            ? oldRegimeSlabs
                                            : newRegimeSlabs
                                        ).map((slab, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {slab.range}
                                                </TableCell>
                                                <TableCell>
                                                    {slab.rate}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </AppTheme>
    );
}
