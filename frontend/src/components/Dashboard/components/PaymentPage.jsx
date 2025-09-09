import { useLocation } from "react-router-dom";
import { Card, Typography, Box, Button } from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';

export default function PaymentPage() {
  const location = useLocation();
  const { amount, schemeName, schemeCode } = location.state || {};

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ p: 4, minWidth: 350, textAlign: 'center' }}>
        <PaymentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>Payment Page</Typography>
        <Typography variant="subtitle1" gutterBottom>
          Scheme: <b>{schemeName}</b>
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Scheme Code: {schemeCode}
        </Typography>
        <Typography variant="h6" sx={{ my: 2 }}>
          Amount: ₹{amount}
        </Typography>
        <Button variant="contained" color="success" fullWidth>
          Pay Now
        </Button>
      </Card>
    </Box>
  );
}