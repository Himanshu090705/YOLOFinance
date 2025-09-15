import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import AppTheme from "../../shared-theme/AppTheme";
import { Gauge } from "@mui/x-charts/Gauge";
import { useNavigate } from "react-router-dom";

export default function InsuranceDetailsDialog({ open, onClose, rowData }) {
  if (!rowData) return null;

  const navigate = useNavigate();

  const claimRatioValue = rowData.claimRatio
    ? parseFloat(rowData.claimRatio.replace("%", ""))
    : 0;

  // Risk label logic
  let riskLabel = "Low";
  let riskColor = "green";
  if (claimRatioValue < 70) {
    riskLabel = "High";
    riskColor = "red";
  } else if (claimRatioValue < 90) {
    riskLabel = "Moderate";
    riskColor = "orange";
  } else {
    riskLabel = "Low";
    riskColor = "green";
  }

  const handleBuyPolicy = () => {
    navigate("/insurance-payment", {
      state: { ...rowData, claimRatio: claimRatioValue },
    });
  };

  return (
    <AppTheme sx={{ width: "100%" }}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* ✅ Show Insurer Logo */}
            {rowData.insurerLogo && (
              <Box
                component="img"
                src={rowData.insurerLogo}
                alt={rowData.insurer}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "8px",
                  objectFit: "contain",
                  backgroundColor: "#fff",
                  // p: 0.5,
                  border: "1px solid #ddd",
                }}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/48?text=🏦";
                }}
              />
            )}
            <Typography variant="h6" fontWeight={600}>
              {rowData.planName}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            {/* Left: Policy Info */}
            <Stack spacing={2} flex={1}>
              <Typography><b>Policy ID:</b> {rowData.policyId}</Typography>
              <Typography><b>Insurer:</b> {rowData.insurer}</Typography>
              <Typography><b>Plan Type:</b> {rowData.planType}</Typography>
              <Typography><b>Premium:</b> {rowData.premium} ({rowData.premiumFrequency})</Typography>
              <Typography><b>Coverage:</b> {rowData.coverage}</Typography>
              <Typography><b>Claim Settlement Ratio:</b> {rowData.claimRatio}</Typography>
              <Typography><b>Last Updated:</b> {rowData.lastUpdatedText}</Typography>
            </Stack>

            {/* Right: Risk Meter */}
            <Box flex={1} textAlign="center">
              <Gauge
                width={250}
                height={250}
                value={claimRatioValue}
                valueMin={0}
                valueMax={100}
                startAngle={-120}
                endAngle={120}
                innerRadius="80%"
                outerRadius="100%"
                sx={{
                  "& .MuiGauge-valueArc": { fill: riskColor },
                  "& .MuiGauge-referenceArc": {
                    stroke: "#ddd",
                    strokeWidth: 8,
                  },
                }}
                text={() => `${riskLabel}`}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                This policy is considered <b style={{ color: riskColor }}>{riskLabel}</b> risk
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button variant="contained" color="primary" onClick={handleBuyPolicy}>
            Buy Policy
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
}
