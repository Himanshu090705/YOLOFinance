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
import AppTheme from "../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.background.default, // dark mode friendly
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

export default function SipCalculator() {
  const [monthlySip, setMonthlySip] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const years = [1, 3, 5, 10];

  // SIP formula
  const calculateSIP = (p, r, n) => {
    const monthlyRate = r / 12 / 100;
    const months = n * 12;
    return Math.round(
      p *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate)
    );
  };

  const data = useMemo(() => {
    return years.map((y) => {
      const totalValue = calculateSIP(monthlySip, expectedReturn, y);
      const invested = monthlySip * 12 * y;
      const gain = totalValue - invested;
      return { year: `${y}Y`, Invested: invested, Gain: gain, Total: totalValue };
    });
  }, [monthlySip, expectedReturn]);

  const total10Y = data[data.length - 1];

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "100%", height: "100%" }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              📈 SIP Calculator 
            </Typography>

            {/* Top Values */}
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                ₹{(total10Y.Total).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In 10 years @ {expectedReturn}% p.a.
              </Typography>
              <Typography variant="body2" sx={{ color: "success.main", mt: 1 }}>
                Invested: ₹{total10Y.Invested.toLocaleString()} | Gain: ₹
                {total10Y.Gain.toLocaleString()}
              </Typography>
            </Box>

            {/* Chart Section */}
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={data}
    margin={{ top: 30, right: 20, left: 0, bottom: 0 }} // extra top margin
  >
    <XAxis dataKey="year" stroke="#aaa" />
    <Tooltip
      formatter={(val) => `₹${val.toLocaleString()}`}
      contentStyle={{
        backgroundColor: "#222",
        borderRadius: "8px",
        border: "none",
        color: "#fff",
      }}
    />
    {/* Invested portion (flat top, no radius) */}
    <Bar
      dataKey="Invested"
      stackId="a"
      fill="#1565c0"
      radius={[0, 0, 0, 0]}
      isAnimationActive={true}
    />
    {/* Gain portion (curved top, labels for total) */}
    <Bar
      dataKey="Gain"
      stackId="a"
      fill="#00acc1"
      radius={[12, 12, 0, 0]} // curve only at top
      isAnimationActive={true}
    >
      {/* Show total only once at top of stacked bar */}
      <LabelList
        dataKey="Total"
        position="top"
        formatter={(val) => `₹${val.toLocaleString()}`}
        style={{ fill: "#fff", fontWeight: "bold" }}
      />
    </Bar>
  </BarChart>
</ResponsiveContainer>

            </Box>

            {/* SIP Amount Buttons */}
            <Stack direction="row" spacing={1}>
              {[1000, 2000, 5000, 10000].map((amt) => (
                <Box
                  key={amt}
                  onClick={() => setMonthlySip(amt)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor:
                      monthlySip === amt ? "primary.main" : "grey.700",
                    backgroundColor:
                      monthlySip === amt ? "primary.main" : "transparent",
                    color: monthlySip === amt ? "white" : "text.primary",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor:
                        monthlySip === amt ? "primary.dark" : "grey.800",
                      color: "white",
                    },
                  }}
                >
                  ₹{amt.toLocaleString()}
                </Box>
              ))}
            </Stack>

            {/* Expected Return Slider */}
            <Box>
              <Typography gutterBottom color="primary.main">
                Expected Returns % (p.a.)
              </Typography>
              <Slider
                value={expectedReturn}
                min={6}
                max={20}
                step={1}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}%`}
                onChange={(e, val) => setExpectedReturn(val)}
                sx={{
                  color: "primary.main",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#111",
                    border: "2px solid",
                    borderColor: "primary.main",
                  },
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </AppTheme>
  );
}
