// LoanEligibilityCalculator.jsx
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
  InputAdornment,
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

// helper: keep only digits
const onlyDigits = (v = "") => v.replace(/[^\d]/g, "");

// helper: presentational formatting with commas
const formatDisplay = (digitsStr = "") => {
  if (!digitsStr) return "";
  const n = Number(digitsStr);
  if (!Number.isFinite(n)) return digitsStr;
  return n.toLocaleString();
};

export default function LoanEligibilityCalculator() {
  // storing input as digit-strings avoids spinner/leading-zero issues
  const [incomeStr, setIncomeStr] = useState("60000");
  const [existingEmiStr, setExistingEmiStr] = useState("5000");
  const [tenure, setTenure] = useState(20); // years
  const [interest, setInterest] = useState(8.5); // p.a.
  const [emiPct, setEmiPct] = useState(60); // percent of income allowed for EMI

  // numeric values used for calculations
  const income = Number(onlyDigits(incomeStr)) || 0;
  const existingEmi = Number(onlyDigits(existingEmiStr)) || 0;

  // eligible EMI and loan calculation (memoized)
  const { eligibleEmi, eligibleLoan } = useMemo(() => {
    const capacity = Math.max(0, (income * emiPct) / 100 - existingEmi); // monthly capacity for new EMI
    const monthlyRate = interest / 12 / 100;
    const months = tenure * 12;

    let loan = 0;
    if (capacity <= 0) {
      loan = 0;
    } else if (monthlyRate === 0) {
      loan = capacity * months;
    } else {
      // Present value of annuity: EMI * (1 - (1+r)^-n) / r
      loan = capacity * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
    }

    return { eligibleEmi: Math.round(capacity), eligibleLoan: Math.round(loan) };
  }, [income, existingEmi, tenure, interest, emiPct]);

  // Chart: how eligible loan changes with tenure (1..maxTenure)
  const chartData = useMemo(() => {
    const maxTenure = Math.max(tenure, 1);
    const arr = [];
    const monthlyRate = interest / 12 / 100;
    for (let y = 1; y <= maxTenure; y++) {
      const months = y * 12;
      let loanAtY = 0;
      if (eligibleEmi <= 0) loanAtY = 0;
      else if (monthlyRate === 0) loanAtY = eligibleEmi * months;
      else loanAtY = eligibleEmi * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);

      arr.push({ year: `${y}y`, "Eligible Loan": Math.round(loanAtY) });
    }
    return arr;
  }, [eligibleEmi, interest, tenure]);

  // handlers (strings -> sanitized digits)
  const onIncomeChange = (e) => setIncomeStr(onlyDigits(e.target.value));
  const onExistingEmiChange = (e) => setExistingEmiStr(onlyDigits(e.target.value));

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "100%", maxWidth: 700 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              🏦 Loan Eligibility Calculator
            </Typography>

            {/* Summary */}
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                ₹{eligibleLoan.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum eligible loan (based on EMI capacity ₹{eligibleEmi.toLocaleString()} / month)
              </Typography>
            </Box>

            {/* Chart */}
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="year" stroke="#aaa" />
                  <YAxis
                    tickFormatter={(val) => {
                      if (val >= 1e7) return `₹${Math.round(val / 1e7)}Cr`;
                      if (val >= 1e5) return `₹${Math.round(val / 1e5)}L`;
                      return `₹${(val / 1000).toFixed(0)}k`;
                    }}
                  />
                  <Tooltip
                    formatter={(val) => `₹${Number(val).toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "#222",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Eligible Loan"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Inputs */}
            <Stack spacing={2}>
              <TextField
                label="Monthly Income (₹)"
                value={formatDisplay(incomeStr)}
                onChange={onIncomeChange}
                type="text"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  inputProps: { inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "left" } },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.primary" },
                    "&.Mui-focused fieldset": { borderColor: "divider", boxShadow: "none" },
                  },
                }}
              />

              <TextField
                label="Existing EMIs (₹)"
                value={formatDisplay(existingEmiStr)}
                onChange={onExistingEmiChange}
                type="text"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  inputProps: { inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "left" } },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.primary" },
                    "&.Mui-focused fieldset": { borderColor: "divider", boxShadow: "none" },
                  },
                }}
              />
            </Stack>

            {/* Config sliders */}
            <Box>
              <Typography gutterBottom color="primary.main">
                % of Income allowed for EMI (policy)
              </Typography>
              <Slider
                value={emiPct}
                min={30}
                max={80}
                step={1}
                valueLabelDisplay="on"
                valueLabelFormat={(v) => `${v}%`}
                onChange={(e, v) => setEmiPct(v)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Loan Tenure (Years)
              </Typography>
              <Slider
                value={tenure}
                min={1}
                max={30}
                step={1}
                valueLabelDisplay="on"
                valueLabelFormat={(v) => `${v}y`}
                onChange={(e, v) => setTenure(v)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Interest Rate (% p.a.)
              </Typography>
              <Slider
                value={interest}
                min={4}
                max={15}
                step={0.1}
                valueLabelDisplay="on"
                valueLabelFormat={(v) => `${v}%`}
                onChange={(e, v) => setInterest(v)}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </AppTheme>
  );
}
