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
import MuiCard from "@mui/material/Card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

const COLORS = ["#1565c0", "#00acc1"]; // Invested, Interest

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [rate, setRate] = useState(11);
  const [years, setYears] = useState(10);

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    const emiCalc =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const total = emiCalc * months;
    const interest = total - loanAmount;

    return {
      emi: Math.round(emiCalc),
      totalPayment: Math.round(total),
      totalInterest: Math.round(interest),
    };
  }, [loanAmount, rate, years]);

  const pieData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
  ];

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "100%", maxWidth: 500 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
            >
              🏦 EMI Calculator
            </Typography>

            {/* Top Values */}
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary.main"
              >
                ₹{emi.toLocaleString()} / month
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Loan: ₹{loanAmount.toLocaleString()} | {years} years @ {rate}% p.a.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "success.main", mt: 1 }}
              >
                Total Payment: ₹{totalPayment.toLocaleString()} | Interest: ₹
                {totalInterest.toLocaleString()}
              </Typography>
            </Box>

            {/* Pie Chart */}
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name}: ₹${value.toLocaleString()}`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Loan Amount Slider */}
            <Box>
              <Typography gutterBottom>Loan Amount</Typography>
              <Slider
                value={loanAmount}
                min={50000}
                max={5000000}
                step={50000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setLoanAmount(val)}
              />
            </Box>

            {/* Interest Rate Slider */}
            <Box>
              <Typography gutterBottom>Interest Rate % (p.a.)</Typography>
              <Slider
                value={rate}
                min={5}
                max={20}
                step={0.5}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}%`}
                onChange={(e, val) => setRate(val)}
              />
            </Box>

            {/* Tenure Slider */}
            <Box>
              <Typography gutterBottom>Tenure (Years)</Typography>
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
