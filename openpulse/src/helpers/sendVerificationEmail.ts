import {resend} from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import React from "react";

export async function sendVerificationEmail(username: string, email: string, VerifyCode: string): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: "<no-reply@openpulse.com>",
            to: email,
            subject: "OpenPulse Email Verification",
                react: React.createElement(VerificationEmail, { username, otp: VerifyCode })
            });
    
            return {
                success: true,
                message: "Verification email sent successfully"
            };
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            return {
                success: false,
                message: "Failed to send verification email"
            };
        }
    }