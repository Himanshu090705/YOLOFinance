import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
  Stack,
  Avatar,
} from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";
import SideMenu from "../Dashboard/components/SideMenu.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import "./profile.css";

export default function Profile(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [idFile, setIdFile] = useState(null);

  const fileInputRef = useRef(null);
  const idFileInputRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("id_token");
    if (token) {
      const decoded = jwtDecode(token);
      setName(decoded.name || "");
      setEmail(decoded.email || "");
      setPhoto(decoded.picture || "");
    }
  }, []);

  const handleSave = () => {
    console.log("Updated Profile:", { name, email, mobile, photo, idFile });
    // TODO: Save to backend or update Firebase user profile
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIdFile(file);
    }
  };

 const handleSendOtp = () => {
  if (!mobile) {
    alert("Enter a valid mobile number");
    return;
  }

  // remove "+" and country code for validation
  const len=mobile.length;
  const nationalNumber = mobile.slice(len-10, len); // only for India
  console.log(nationalNumber);
  if (nationalNumber.length === 10) {
    alert(`OTP sent to ${mobile}`); // keep full number with +91
  } else {
    alert("Enter a valid 10-digit mobile number");
  }
};

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      setIsVerified(true);
      alert("Mobile number verified ✅");
    } else {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <AppTheme {...props}>
      <SideMenu />
      <CssBaseline enableColorScheme />

      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          variant="outlined"
          sx={{ p: 4, width: "100%", maxWidth: 500, textAlign: "center" }}
        >
          <Stack spacing={3} alignItems="center">
            {/* Profile Picture */}
            <Avatar sx={{ width: 100, height: 100 }} src={photo} alt={name}>
              {!photo && (name ? name.charAt(0) : email.charAt(0))}
            </Avatar>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />

            <Button
              variant="outlined"
              size="small"
              onClick={() => fileInputRef.current.click()}
            >
              Change Photo
            </Button>

            {/* Profile Heading */}
            <Typography variant="h5" fontWeight="bold">
              My Profile
            </Typography>

            {/* Form Fields */}
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField fullWidth label="Email" value={email} disabled />

            {/* Mobile Number + OTP */}
            <PhoneInput
              country={"in"} // default India 🇮🇳
              value={mobile}
              onChange={setMobile}
              
              inputStyle={{
                width: "100%",
                height: "56px",
              }}
              buttonStyle={{
                border: "1px solid #ccc",
              }}
            />
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={!mobile}
              />
              <Button
                variant="outlined"
                onClick={handleSendOtp}
                disabled={!mobile}
              >
                Send OTP
              </Button>
              <Button
                variant="outlined"
                onClick={handleVerifyOtp}
                disabled={!otp}
              >
                Verify
              </Button>
            </Stack>
            {isVerified && (
              <Typography variant="body2" color="green">
                ✅ Mobile Verified
              </Typography>
            )}

            {/* Photo ID Upload */}
            <Button
              variant="outlined"
              onClick={() => idFileInputRef.current.click()}
            >
              Upload ID (Aadhar / PAN)
            </Button>
            <input
              type="file"
              accept="image/*,.pdf"
              ref={idFileInputRef}
              style={{ display: "none" }}
              onChange={handleIdUpload}
            />
            {idFile && (
              <Typography variant="body2" color="text.secondary">
                Uploaded: {idFile.name}
              </Typography>
            )}

            {/* Save Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Card>
      </Container>
    </AppTheme>
  );
}
