import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { render } from "@react-email/render";
import React from "react";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Generate HTML from React email component
    const emailHtml: string = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    // Send email via Resend
    await resend.emails.send({
      from: "no-reply@openpulse.com", // must match your verified sender in Resend
      to: email,
      subject: "OpenPulse Email Verification",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error: unknown) {
    console.error("Error sending verification email:", error);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
