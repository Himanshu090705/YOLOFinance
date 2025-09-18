import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant="h1" component="h1" sx={{ fontSize: "8rem", fontWeight: "bold" }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Oops! The page you’re looking for doesn’t exist.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
          It might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
          sx={{ borderRadius: "2rem", px: 4 }}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
}
