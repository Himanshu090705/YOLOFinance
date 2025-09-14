// /src/Dashboard/Calculators/LifeInsuranceCalculator.jsx
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
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import MuiCard from "@mui/material/Card";
import AppTheme from "../../shared-theme/AppTheme";

const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 20,
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
}));

export default function LifeInsuranceCalculator() {
  const [income, setIncome] = useState(1000000); // annual income
  const [years, setYears] = useState(15);
  const [liabilities, setLiabilities] = useState(2000000);
  const [futureGoals, setFutureGoals] = useState(3000000);
  const [savings, setSavings] = useState(1000000);

  const result = useMemo(() => {
    const incomeReplacement = income * years;
    const totalNeed = incomeReplacement + liabilities + futureGoals;
    const suggestedCover = totalNeed - savings;

    return {
      incomeReplacement,
      liabilities,
      futureGoals,
      savings,
      totalNeed,
      suggestedCover: suggestedCover > 0 ? suggestedCover : 0,
    };
  }, [income, years, liabilities, futureGoals, savings]);

  const data = [
    { name: "Income Replacement", value: result.incomeReplacement },
    { name: "Liabilities", value: result.liabilities },
    { name: "Future Goals", value: result.futureGoals },
    { name: "Savings/Investments", value: -result.savings },
  ];

  const COLORS = ["#1565c0", "#ef5350", "#00acc1", "#66bb6a"];

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Card sx={{ p: 3, width: "50%", height: "80%" }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              🛡️ Life Insurance Coverage Calculator
            </Typography>

            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                Suggested Coverage: ₹{result.suggestedCover.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Need: ₹{result.totalNeed.toLocaleString()} | Existing
                Savings: ₹{result.savings.toLocaleString()}
              </Typography>
            </Box>

            {/* Pie Chart */}
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) =>
                      `${name}: ₹${value.toLocaleString()}`
                    }
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `₹${val.toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Sliders */}
            <Box>
              <Typography gutterBottom color="primary.main">
                Annual Income
              </Typography>
              <Slider
                value={income}
                min={100000}
                max={5000000}
                step={50000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setIncome(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Years of Income Replacement
              </Typography>
              <Slider
                value={years}
                min={5}
                max={30}
                step={1}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `${val}Y`}
                onChange={(e, val) => setYears(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Current Liabilities
              </Typography>
              <Slider
                value={liabilities}
                min={0}
                max={10000000}
                step={50000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setLiabilities(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Future Goals (Children, Retirement etc.)
              </Typography>
              <Slider
                value={futureGoals}
                min={0}
                max={10000000}
                step={50000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setFutureGoals(val)}
              />
            </Box>

            <Box>
              <Typography gutterBottom color="primary.main">
                Existing Savings/Investments
              </Typography>
              <Slider
                value={savings}
                min={0}
                max={10000000}
                step={50000}
                valueLabelDisplay="on"
                valueLabelFormat={(val) => `₹${val.toLocaleString()}`}
                onChange={(e, val) => setSavings(val)}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </AppTheme>
  );
}
