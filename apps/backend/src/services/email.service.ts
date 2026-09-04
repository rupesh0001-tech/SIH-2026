import { Resend } from "resend";
import { env } from "../config/env.js";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
  if (apiKey && apiKey !== "re_123456789") {
    return new Resend(apiKey);
  }
  return null;
}

/**
 * Internal helper function to dispatch emails via Resend and log in terminal for development.
 */
async function dispatchEmail(
  to: string,
  subject: string,
  html: string,
  textFallback: string
): Promise<boolean> {
  const rawFrom = process.env.EMAIL_FROM || env.EMAIL_FROM || "otp@rupeshhh.in";
  const fromEmail = rawFrom.includes("<") ? rawFrom : `Mandi Setu <${rawFrom}>`;

  // Always log outgoing email & OTP to terminal in development/testing mode
  if (env.NODE_ENV !== "test") {
    console.log(`\n==================================================`);
    console.log(`📧 [EMAIL DISPATCH - ${env.NODE_ENV.toUpperCase()}]`);
    console.log(`   From: ${fromEmail}`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${textFallback}`);
    console.log(`==================================================\n`);
  }

  const resend = getResendClient();
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
        text: textFallback,
      });

      if (error) {
        console.warn(`⚠️ Resend email dispatch notice (${error.name || "Error"}): ${error.message}`);
        return false;
      }
      return true;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`⚠️ Failed sending email via Resend: ${errMsg}`);
      return false;
    }
  }

  return true;
}

/**
 * Sends an account verification OTP email.
 */
export async function sendVerificationOtpEmail(
  to: string,
  name: string,
  otp: string
): Promise<boolean> {
  const subject = "Verify Your Account — Mandi Setu";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2e7d32;">Welcome to Mandi Setu, ${name}!</h2>
      <p>Thank you for registering. Please use the following 6-digit One-Time Password (OTP) to verify your account:</p>
      <div style="background-color: #f1f8e9; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1b5e20;">${otp}</span>
      </div>
      <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you did not create this account, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Mandi Setu Agricultural Marketplace. All rights reserved.</p>
    </div>
  `;

  return dispatchEmail(to, subject, html, `Your 6-digit verification code is: [ ${otp} ] (Valid for 10 minutes)`);
}

/**
 * Sends a password reset email with token link and optional OTP.
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetToken: string,
  otp?: string
): Promise<boolean> {
  const subject = "Reset Your Password — Mandi Setu";
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(to)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #c62828;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password on Mandi Setu. You can reset your password by clicking the button below or using the reset token.</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #2e7d32; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      ${
        otp
          ? `<p>Or enter this OTP on the password reset screen: <strong style="font-size: 18px; letter-spacing: 2px;">${otp}</strong></p>`
          : ""
      }
      <p style="color: #666; font-size: 14px;">This link and token are single-use and will expire in 15 minutes. If you did not request this, please secure your account immediately.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} Mandi Setu Agricultural Marketplace. All rights reserved.</p>
    </div>
  `;

  return dispatchEmail(
    to,
    subject,
    html,
    `Reset your password at: ${resetUrl}${otp ? ` | OTP: [ ${otp} ]` : ""}`
  );
}

