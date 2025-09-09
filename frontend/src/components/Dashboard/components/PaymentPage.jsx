import { useLocation } from "react-router-dom";
import { Card, Typography, Box, Button } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

export default function PaymentPage() {
  const location = useLocation();
  const { amount, schemeName, schemeCode, startDate,nextPaymentDate, nav, units } =
    location.state || {};

    const navigate = useNavigate();

  async function handlePurchase() {
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );
    const data = {
      schemeCode: schemeCode,
      schemeName: schemeName,
      frequency: "MONTHLY",
      startDate: startDate,
      nextDate: nextPaymentDate,
      amount: amount,
      nav: nav,
      units: units,
    };
    const res = await fetch("http://localhost:4000/api/investments/mf-buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const session = await res.json();

    if (res.status === 201) {
      navigate('/Dashboard');
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card sx={{ p: 4, minWidth: 350, textAlign: "center" }}>
        <PaymentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Payment Page
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Scheme: <b>{schemeName}</b>
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Scheme Code: {schemeCode}
        </Typography>
        <Typography variant="h6" sx={{ my: 2 }}>
          Amount: ₹{amount}
        </Typography>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handlePurchase}
        >
          Pay Now
        </Button>
      </Card>
    </Box>
  );
}
