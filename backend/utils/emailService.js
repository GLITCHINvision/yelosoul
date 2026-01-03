import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//  Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "yelosoulstore@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS,
  },
});

//  Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"YeloSoul Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(` Email sent to ${to}`);
  } catch (error) {
    console.error(" Email Error:", error);
  }
};

