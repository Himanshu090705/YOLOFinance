// src/Calculators/CurrencyConverter.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY;

  // Convert whenever dropdown or amount changes
  useEffect(() => {
    const convert = async () => {
      try {
        const res = await fetch(
          `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}`
        );

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const rate = data.data[toCurrency].value;
        setResult(amount * rate);
      } catch (err) {
        setError("Conversion failed: " + err.message);
      }
    };

    if (fromCurrency && toCurrency) convert();
  }, [amount, fromCurrency, toCurrency]);

  // Fetch 30-day history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const today = new Date();
        const dates = [];

        // collect last 30 days
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          dates.push(d.toISOString().split("T")[0]);
        }

        const historyResults = [];

        for (const date of dates) {
          const res = await fetch(
            `https://api.currencyapi.com/v3/historical?apikey=${API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}&date=${date}`
          );

          if (res.ok) {
            const data = await res.json();
            historyResults.push({
              date: new Date(date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              }),
              rate: data.data[toCurrency].value,
            });
          }
        }

        setHistoryData(historyResults);
      } catch (err) {
        console.error("History fetch failed", err.message);
      }
    };

    if (fromCurrency && toCurrency) fetchHistory();
  }, [fromCurrency, toCurrency]);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencies = [
    { code: "USD", name: "United States Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "INR", name: "Indian Rupee" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "ZAR", name: "South African Rand" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "AED", name: "UAE Dirham" },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        maxWidth: 600,
        width: "100%",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        💱 Currency Converter
      </Typography>

      <Stack spacing={3}>
        {/* Amount Input */}
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
        />

        {/* Currency Selection with Swap */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            fullWidth
          >
            {currencies.map((c) => (
              <MenuItem key={c.code} value={c.code}>
                {c.code} — {c.name}
              </MenuItem>
            ))}
          </Select>

          <IconButton onClick={handleSwap}>
            <SwapHoriz fontSize="large" />
          </IconButton>

          <Select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            fullWidth
          >
            {currencies.map((c) => (
              <MenuItem key={c.code} value={c.code}>
                {c.code} — {c.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {/* Result */}
        {error && (
          <Typography color="error" fontWeight="bold">
            {error}
          </Typography>
        )}
        {result !== null && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 3,
              bgcolor: "primary.light",
              color: "primary.contrastText",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
            </Typography>
          </Box>
        )}

        {/* 30-day Chart */}
        {historyData.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              📊 Last 30 Days Exchange Rate ({fromCurrency} → {toCurrency})
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(val) => val.toFixed(2)}
                />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
