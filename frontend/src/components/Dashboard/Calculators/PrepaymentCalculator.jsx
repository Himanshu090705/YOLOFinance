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
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import MuiCard from "@mui/material/Card";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

export default function PrepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(8);
  const [tenureYears, setTenureYears] = useState(12);
  const [prepayment, setPrepayment] = useState(200000);
  const [prepaymentYear, setPrepaymentYear] = useState(5);

  // EMI formula
  const calculateEMI = (P, r, n) => {
    const monthlyRate = r / 12 / 100;
    return (
      P *
      monthlyRate *
      Math.pow(1 + monthlyRate, n) /
      (Math.pow(1 + monthlyRate, n) - 1)
    );
  };

  const result = useMemo(() => {
    const totalMonths = tenureYears * 12;
    const monthlyRate = interestRate / 12 / 100;
    const emi = calculateEMI(loanAmount, interestRate, totalMonths);

    // total interest without prepayment
    const totalPayable = emi * totalMonths;
    const totalInterest = totalPayable - loanAmount;

    // with prepayment
    let balance = loanAmount;
    let months = 0;
    let totalPaid = 0;
    while (balance > 0 && months < totalMonths) {
      months++;
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;
      totalPaid += emi;

      // prepayment at given year
      if (months === prepaymentYear * 12) {
        balance -= prepayment;
      }
    }

    const newTotalInterest = totalPaid - loanAmount - prepayment;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      newTotalInterest: Math.round(newTotalInterest),
      months,
    };
  }, [loanAmount, interestRate, tenureYears, prepayment, prepaymentYear]);

  const data = [
    {
      name: "Before Prepayment",
      Interest: result.totalInterest,
    },
    {
      name: "After Prepayment",
      Interest: result.newTotalInterest,
    },
  ];

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "45%", height: "75%" }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              💰 Loan Prepayment Calculator
            </Typography>

            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                EMI: ₹{result.emi.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Original Tenure: {tenureYears} years | New Tenure: {(
                  result.months / 12
                ).toFixed(1)} years
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "success.main", mt: 1 }}
              >
                Interest Saved: ₹{(
                  result.totalInterest - result.newTotalInterest
                ).toLocaleString()}
              </Typography>
            </Box>

            {/* Chart */}
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#aaa" />
                  <Tooltip
                    formatter={(val) => `₹${val.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "#222",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="Interest" fill="#1565c0" radius={[12, 12, 0, 0]}>
                    <LabelList
                      dataKey="Interest"
                      position="top"
                      formatter={(val) => `₹${val.toLocaleString()}`}
                      style={{ fill: "#222", fontWeight: "bold" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Sliders */}
            <Box>
              <Typography gutterBottom color="primary.main">
                Loan Amount
              </Typography>
              <Slider
                value={loanAmount}
                min={100000}
                max={10000000}
                step={50000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setLoanAmount(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Interest Rate % (p.a.)
              </Typography>
              <Slider
                value={interestRate}
                min={5}
                max={15}
                step={0.1}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}%`}
                onChange={(e, val) => setInterestRate(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Loan Tenure (Years)
              </Typography>
              <Slider
                value={tenureYears}
                min={5}
                max={30}
                step={1}
                valueLabelDisplay="on"
                onChange={(e, val) => setTenureYears(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Prepayment Amount
              </Typography>
              <Slider
                value={prepayment}
                min={50000}
                max={1000000}
                step={10000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setPrepayment(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Prepayment Year
              </Typography>
              <Slider
                value={prepaymentYear}
                min={1}
                max={tenureYears}
                step={1}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}Y`}
                onChange={(e, val) => setPrepaymentYear(val)}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </AppTheme>
  );
}
