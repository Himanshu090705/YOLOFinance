import * as React from "react";
import { useState, useMemo } from "react";
import {
  Typography,
  CardContent,
  CssBaseline,
  Stack,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DeleteIcon from "@mui/icons-material/Delete";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

// Helpers
const onlyDigits = (v = "") => v.replace(/[^\d]/g, "");
const formatDisplay = (v = "") => {
  if (!v) return "";
  const n = Number(v);
  return isNaN(n) ? v : n.toLocaleString();
};

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState([
    { id: 1, name: "Credit Card", balance: "50000", rate: 18, minPayment: "2000" },
    { id: 2, name: "Car Loan", balance: "300000", rate: 10, minPayment: "8000" },
  ]);
  const [extraPayment, setExtraPayment] = useState("10000");
  const [method, setMethod] = useState("snowball"); // snowball | avalanche

  // Core calculation
  const result = useMemo(() => {
    let accounts = debts.map((d) => ({
      ...d,
      balance: Number(onlyDigits(d.balance)) || 0,
      minPayment: Number(onlyDigits(d.minPayment)) || 0,
      rate: d.rate / 12 / 100, // monthly
    }));
    const timeline = [];

    let month = 0;
    let totalInterest = 0;
    let balancesExist = accounts.some((a) => a.balance > 0);

    while (balancesExist && month < 600) {
      month++;
      // interest accrual
      accounts.forEach((a) => {
        const interest = a.balance * a.rate;
        totalInterest += interest;
        a.balance += interest;
      });

      // choose priority order
      let ordered = [...accounts];
      if (method === "snowball") {
        ordered.sort((a, b) => a.balance - b.balance);
      } else {
        ordered.sort((a, b) => b.rate - a.rate);
      }

      // pay minimums
      accounts.forEach((a) => {
        const pay = Math.min(a.minPayment, a.balance);
        a.balance -= pay;
      });

      // apply extra to top priority
      let extra = Number(onlyDigits(extraPayment)) || 0;
      for (let i = 0; i < ordered.length && extra > 0; i++) {
        const a = ordered[i];
        if (a.balance > 0) {
          const pay = Math.min(extra, a.balance);
          a.balance -= pay;
          extra -= pay;
        }
      }

      // track progress
      const totalDebt = accounts.reduce((sum, a) => sum + a.balance, 0);
      timeline.push({
        month,
        "Remaining Debt": Math.round(totalDebt),
      });

      balancesExist = accounts.some((a) => a.balance > 0);
    }

    return { months: month, totalInterest, timeline };
  }, [debts, extraPayment, method]);

  // handlers
  const updateDebt = (id, field, value) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const removeDebt = (id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const addDebt = () => {
    const newId = debts.length ? Math.max(...debts.map((d) => d.id)) + 1 : 1;
    setDebts([
      ...debts,
      { id: newId, name: "New Debt", balance: "0", rate: 12, minPayment: "0" },
    ]);
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "100%", maxWidth: 800 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              💳 Debt Payoff Calculator
            </Typography>

            {/* Summary */}
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                Debt free in {result.months} months (~{Math.floor(result.months / 12)}y {result.months % 12}m)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Interest Paid: ₹{result.totalInterest.toLocaleString()}
              </Typography>
            </Box>

            {/* Chart */}
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.timeline}>
                  <XAxis dataKey="month" stroke="#aaa" />
                  <YAxis
                    tickFormatter={(val) =>
                      val >= 1e5 ? `₹${Math.round(val / 1e5)}L` : `₹${Math.round(val / 1000)}k`
                    }
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
                  <Line type="monotone" dataKey="Remaining Debt" stroke="#d32f2f" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Extra Payment */}
            <TextField
              label="Extra Monthly Payment (₹)"
              type="text"
              value={formatDisplay(extraPayment)}
              onChange={(e) => setExtraPayment(onlyDigits(e.target.value))}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                style: { textAlign: "left" },
              }}
            />

            {/* Method */}
            {/* <ToggleButtonGroup
              value={method}
              exclusive
              onChange={(e, val) => val && setMethod(val)}
              fullWidth
            >
              <ToggleButton value="snowball" sx={{ flex: 1 }}>
                Snowball (smallest balance first)
              </ToggleButton>
              <ToggleButton value="avalanche" sx={{ flex: 1 }}>
                Avalanche (highest rate first)
              </ToggleButton>
            </ToggleButtonGroup> */}

            {/* Debt List */}
            <Stack spacing={2}>
              {debts.map((d) => (
                <Stack key={d.id} direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Name"
                    value={d.name}
                    onChange={(e) => updateDebt(d.id, "name", e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Balance (₹)"
                    value={formatDisplay(d.balance)}
                    onChange={(e) => updateDebt(d.id, "balance", onlyDigits(e.target.value))}
                    type="text"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                      style: { textAlign: "left" },
                    }}
                  />
                  <TextField
                    label="Rate %"
                    value={d.rate}
                    onChange={(e) => updateDebt(d.id, "rate", Number(e.target.value))}
                    type="number"
                    sx={{ width: 100 }}
                  />
                  <TextField
                    label="Min Payment (₹)"
                    value={formatDisplay(d.minPayment)}
                    onChange={(e) => updateDebt(d.id, "minPayment", onlyDigits(e.target.value))}
                    type="text"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                      style: { textAlign: "left" },
                    }}
                  />
                  <IconButton onClick={() => removeDebt(d.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  textAlign: "center",
                  border: "1px dashed",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
                onClick={addDebt}
              >
                ➕ Add Debt
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </AppTheme>
  );
}
