import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({ onBack }) {
  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={onBack}
      sx={{
        alignSelf: "flex-start",
        mb: 2,
        borderRadius: 3,
        fontWeight: "bold",
        textTransform: "none",
      }}
    >
      Back
    </Button>
  );
}
