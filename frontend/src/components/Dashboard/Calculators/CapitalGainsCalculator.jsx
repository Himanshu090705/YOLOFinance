// CapitalGainsCalculator.jsx
import * as React from "react";
import { useState, useMemo } from "react";
import {
  Typography,
  TextField,
  CardContent,
  CssBaseline,
  Stack,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

const COLORS = ["#1565c0", "#00acc1", "#f9a825"]; // investment, gain, tax

export default function CapitalGainsCalculator() {
  const [purchaseStr, setPurchaseStr] = useState("100000");
  const [saleStr, setSaleStr] = useState("500000");
  const [isLongTerm, setIsLongTerm] = useState(true);

  const onlyDigits = (value = "") => value.replace(/[^\d]/g, "");
  const formatDisplay = (digitsStr) => {
    if (!digitsStr) return "";
    const num = Number(digitsStr);
    if (!Number.isFinite(num)) return digitsStr;
    return num.toLocaleString();
  };

  const purchase = Number(onlyDigits(purchaseStr)) || 0;
  const sale = Number(onlyDigits(saleStr)) || 0;

  const { gain, tax, netAmount } = useMemo(() => {
    const profit = Math.max(sale - purchase, 0);
    let calculatedTax = 0;

    if (isLongTerm) {
      const exempt = 100000;
      calculatedTax = profit > exempt ? Math.round((profit - exempt) * 0.1) : 0;
    } else {
      calculatedTax = Math.round(profit * 0.15);
    }

    return {
      gain: profit,
      tax: calculatedTax,
      netAmount: sale - calculatedTax,
    };
  }, [purchase, sale, isLongTerm]);

  const pieData = [
    { name: "Investment", value: purchase },
    { name: "Capital Gain", value: gain },
    { name: "Tax", value: tax },
  ].filter((d) => d.value > 0);

  const handlePurchaseChange = (e) => setPurchaseStr(onlyDigits(e.target.value));
  const handleSaleChange = (e) => setSaleStr(onlyDigits(e.target.value));

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "100%", maxWidth: 600 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              💰 Capital Gains Tax Calculator
            </Typography>

            {/* Summary */}
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                Net Amount: ₹{Number(netAmount).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gain: ₹{gain.toLocaleString()} | Tax: ₹{tax.toLocaleString()}{" "}
                ({isLongTerm ? "LTCG: 10% (₹1L exempt)" : "STCG: 15%"})
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
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name}: ₹${Number(value).toLocaleString()}`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Inputs */}
            <Stack spacing={2}>
              <TextField
                label="Purchase Price (₹)"
                value={formatDisplay(purchaseStr)}
                onChange={handlePurchaseChange}
                type="text"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  style: { textAlign: "left" }, // ✅ numbers aligned left
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true, // ✅ keeps label floated above
                  sx: { mb: 0.5 }, // moves label slightly up
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
                label="Sale Price (₹)"
                value={formatDisplay(saleStr)}
                onChange={handleSaleChange}
                type="text"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  style: { textAlign: "left" }, // ✅ numbers aligned left
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  sx: { mb: 0.5 },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "text.primary" },
                    "&.Mui-focused fieldset": { borderColor: "divider", boxShadow: "none" },
                  },
                }}
              />

              {/* Long/Short toggle */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  onClick={() => setIsLongTerm(true)}
                  role="button"
                  tabIndex={0}
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    p: 1.25,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isLongTerm ? "primary.main" : "grey.700",
                    backgroundColor: isLongTerm ? "primary.main" : "transparent",
                    color: isLongTerm ? "white" : "text.primary",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": {
                      backgroundColor: isLongTerm ? "primary.dark" : "grey.800",
                      color: "white",
                    },
                  }}
                >
                  Long Term
                </Box>

                <Box
                  onClick={() => setIsLongTerm(false)}
                  role="button"
                  tabIndex={0}
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    p: 1.25,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: !isLongTerm ? "primary.main" : "grey.700",
                    backgroundColor: !isLongTerm ? "primary.main" : "transparent",
                    color: !isLongTerm ? "white" : "text.primary",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": {
                      backgroundColor: !isLongTerm ? "primary.dark" : "grey.800",
                      color: "white",
                    },
                  }}
                >
                  Short Term
                </Box>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </AppTheme>
  );
}
