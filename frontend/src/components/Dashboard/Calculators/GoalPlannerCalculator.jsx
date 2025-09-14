import * as React from "react";
import { useState, useMemo } from "react";
import {
  Typography,
  Slider,
  CardContent,
  CssBaseline,
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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

export default function GoalPlannerCalculator() {
  const [goalAmount, setGoalAmount] = useState(1000000); // in today's value
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [returnRate, setReturnRate] = useState(12);
  const [mode, setMode] = useState("simple");
  const [lumpsum, setLumpsum] = useState(0);

  const monthlyRate = returnRate / 12 / 100;
  const months = years * 12;

  // Future cost of goal
  const futureGoal = useMemo(
    () => goalAmount * Math.pow(1 + inflation / 100, years),
    [goalAmount, inflation, years]
  );

  // Simple mode calculations
  const simpleCalc = useMemo(() => {
    const lumpsumRequired =
      futureGoal / Math.pow(1 + returnRate / 100, years);

    const sipRequired =
      (futureGoal * monthlyRate) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return { lumpsumRequired, sipRequired };
  }, [futureGoal, returnRate, years, monthlyRate, months]);

  // Advanced mode calculations
  const advancedCalc = useMemo(() => {
    const lumpsumFV = lumpsum * Math.pow(1 + returnRate / 100, years);
    const remaining = Math.max(futureGoal - lumpsumFV, 0);

    const sipRequired =
      remaining > 0
        ? (remaining * monthlyRate) /
          (Math.pow(1 + monthlyRate, months) - 1)
        : 0;

    return { lumpsumFV, sipRequired, remaining };
  }, [futureGoal, lumpsum, returnRate, years, monthlyRate, months]);

  // Chart Data
  const chartData = useMemo(() => {
    if (mode === "simple") {
      return [
        { name: "Future Goal", value: futureGoal },
        { name: "SIP Required (Total)", value: simpleCalc.sipRequired * months },
        { name: "Lumpsum Required", value: simpleCalc.lumpsumRequired },
      ];
    } else {
      return [
        { name: "Future Goal", value: futureGoal },
        { name: "From Lumpsum", value: advancedCalc.lumpsumFV },
        { name: "From SIP (Total)", value: advancedCalc.sipRequired * months },
      ];
    }
  }, [mode, futureGoal, simpleCalc, advancedCalc, months]);

  // Format Y axis & tooltip
  const formatNumber = (val) => {
    if (val >= 10000000) return (val / 10000000).toFixed(1) + " Cr";
    if (val >= 100000) return (val / 100000).toFixed(1) + " L";
    if (val >= 1000) return (val / 1000).toFixed(1) + " K";
    return val;
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "45%", height: "75%" }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              align="center"
            >
              🎯 Goal Planner Calculator
            </Typography>

            {/* Mode Toggle */}
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, val) => val && setMode(val)}
              sx={{ alignSelf: "center" }}
            >
              <ToggleButton value="simple">Simple</ToggleButton>
              <ToggleButton value="advanced">Advanced</ToggleButton>
            </ToggleButtonGroup>

            {/* Top Result */}
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                Future Goal Value: ₹{futureGoal.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adjusted for {inflation}% inflation over {years} years
              </Typography>
            </Box>

            {/* Results Section */}
            {mode === "simple" ? (
              <Box>
                <Typography color="success.main">
                  Required SIP: ₹{Math.round(simpleCalc.sipRequired).toLocaleString()} / month
                </Typography>
                <Typography color="secondary.main">
                  OR Lumpsum Today: ₹{Math.round(simpleCalc.lumpsumRequired).toLocaleString()}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography color="secondary.main">
                  Lumpsum FV: ₹{Math.round(advancedCalc.lumpsumFV).toLocaleString()}
                </Typography>
                <Typography color="success.main">
                  Required SIP: ₹{Math.round(advancedCalc.sipRequired).toLocaleString()} / month
                </Typography>
              </Box>
            )}

            {/* Chart */}
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#1565c0" radius={[8, 8, 0, 0]}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={formatNumber}
                      style={{ fill: "#222", fontWeight: "bold" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Sliders */}
            <Box>
              <Typography gutterBottom>Goal Amount (Today's Value)</Typography>
              <Slider
                value={goalAmount}
                min={100000}
                max={10000000}
                step={50000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setGoalAmount(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Years</Typography>
              <Slider
                value={years}
                min={1}
                max={40}
                step={1}
                valueLabelDisplay="on"
                onChange={(e, val) => setYears(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Inflation %</Typography>
              <Slider
                value={inflation}
                min={3}
                max={10}
                step={0.5}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}%`}
                onChange={(e, val) => setInflation(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Expected Return %</Typography>
              <Slider
                value={returnRate}
                min={6}
                max={20}
                step={0.5}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}%`}
                onChange={(e, val) => setReturnRate(val)}
              />
            </Box>

            {mode === "advanced" && (
              <Box>
                <Typography gutterBottom>Lumpsum Investment Today</Typography>
                <Slider
                  value={lumpsum}
                  min={0}
                  max={5000000}
                  step={50000}
                  valueLabelDisplay="on"
                  valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                  onChange={(e, val) => setLumpsum(val)}
                />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </AppTheme>
  );
}
