import { createTransport } from "nodemailer";
export async function sendEmail(mailOptions: object) {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    await transporter.sendMail(mailOptions);
}
