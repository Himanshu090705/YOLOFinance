import express, { Request, Response } from "express";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID as string;

console.log("🔑 Twilio Config:");
console.log("  Account SID:", accountSid);
console.log("  Auth Token:", authToken ? "Loaded ✅" : "❌ Missing");
console.log("  Verify Service SID:", serviceSid);

const client = twilio(accountSid, authToken);

// ✅ Send OTP
router.post("/send-otp", async (req: Request, res: Response) => {
  const { phone } = req.body as { phone: string };

  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone number is required" });
  }

  try {
    console.log("📤 Sending OTP to:", phone);

    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone.startsWith("+") ? phone : `+${phone}`, channel: "sms" });

    console.log("✅ OTP send response:", verification.status);

    return res.json({ success: true, status: verification.status });
  } catch (err: any) {
    console.error("❌ Error sending OTP:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req: Request, res: Response) => {
  const { phone, code } = req.body as { phone: string; code: string };

  if (!phone || !code) {
    return res.status(400).json({ success: false, error: "Phone and code are required" });
  }

  try {
    console.log("📥 Verifying OTP for:", phone, "with code:", code);

    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone.startsWith("+") ? phone : `+${phone}`, code });

    console.log("🔎 OTP verify response:", verificationCheck.status);

    if (verificationCheck.status === "approved") {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, error: "Invalid OTP" });
    }
  } catch (err: any) {
    console.error("❌ Error verifying OTP:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
