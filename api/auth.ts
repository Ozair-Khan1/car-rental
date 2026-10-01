"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";

/**
 * 1. Checks if email is already taken.
 * 2. Generates a 6-digit code.
 * 3. Saves to VerificationToken in DB.
 * 4. Sends the email via Brevo.
 */
export async function sendVerificationCode(email: string, fullName?: string) {
  try {
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { error: "Please enter a valid email address" };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return { error: "This email is already registered. Please sign in instead." };
    }

    // Generate secure 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Clear previous tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: cleanEmail },
    });

    // Save token in DB
    await db.verificationToken.create({
      data: {
        identifier: cleanEmail,
        token: code,
        expires,
      },
    });

    // Send email via Brevo
    const emailResult = await sendVerificationEmail(cleanEmail, code, fullName);

    if (!emailResult.success) {
      return {
        error: emailResult.error || "Failed to deliver verification code. Please try again.",
      };
    }

    return { success: "Verification code sent to your email!" };
  } catch (err) {
    console.error("sendVerificationCode error:", err);
    return { error: "Something went wrong while sending verification code" };
  }
}

/**
 * Verifies the 6-digit code against the DB.
 */
export async function verifyCode(email: string, code: string) {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    if (!cleanEmail || !cleanCode) {
      return { error: "Email and verification code are required" };
    }

    const record = await db.verificationToken.findFirst({
      where: {
        identifier: cleanEmail,
        token: cleanCode,
      },
    });

    if (!record) {
      return { error: "Invalid verification code. Please double check and try again." };
    }

    if (new Date() > record.expires) {
      return {
        error: "Verification code has expired. Please click 'Resend Code' to receive a new one.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("verifyCode error:", err);
    return { error: "Failed to verify code" };
  }
}

/**
 * Final registration after email verification.
 */
export async function registerUser(formData: FormData) {
  try {
    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;

    if (!fullName || !email || !password || !confirmPassword) {
      return { error: "All fields are required" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long" };
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email is already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        emailVerified: new Date(),
        role: role === "OWNER" ? "OWNER" : "CUSTOMER",
      },
    });

    // Clean up used token
    try {
      await db.verificationToken.deleteMany({
        where: { identifier: email },
      });
    } catch {
      // Ignored if already cleaned up
    }

    return { success: "Account created successfully! You can now log in." };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration" };
  }
}

/**
 * Sends a password reset link to user's email via Brevo.
 */
export async function requestPasswordReset(email: string) {
  try {
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { error: "Please enter a valid email address." };
    }

    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return {
        error: "No account found with this email. Please check your spelling or sign up.",
      };
    }

    // Generate secure 32-byte hex token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // Remove any previous reset tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: `reset:${cleanEmail}` },
    });

    // Create fresh token
    await db.verificationToken.create({
      data: {
        identifier: `reset:${cleanEmail}`,
        token,
        expires,
      },
    });

    // Determine base URL dynamically
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const proto =
      headersList.get("x-forwarded-proto") ||
      (host.includes("localhost") ? "http" : "https");
    const origin = process.env.NEXTAUTH_URL || `${proto}://${host}`;

    const resetUrl = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(
      cleanEmail
    )}`;

    // Send email via Brevo
    const emailResult = await sendPasswordResetEmail(
      cleanEmail,
      resetUrl,
      user.name || undefined
    );

    if (!emailResult.success) {
      return {
        error:
          emailResult.error || "Failed to send password reset email. Please try again.",
      };
    }

    return {
      success: "A password reset link has been sent to your email!",
    };
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    return { error: "Failed to process password reset request. Please try again." };
  }
}

/**
 * Validates a reset token and email before allowing password change.
 */
export async function verifyResetToken(email: string, token: string) {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.trim();

    if (!cleanEmail || !cleanToken) {
      return { error: "Invalid password reset link." };
    }

    const record = await db.verificationToken.findFirst({
      where: {
        identifier: `reset:${cleanEmail}`,
        token: cleanToken,
      },
    });

    if (!record) {
      return {
        error: "This password reset link is invalid or has already been used.",
      };
    }

    if (new Date() > record.expires) {
      return {
        error: "This password reset link has expired. Please request a new one.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("verifyResetToken error:", err);
    return { error: "Failed to verify reset token." };
  }
}

/**
 * Updates the user's password and removes the reset token.
 */
export async function resetPassword(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const token = (formData.get("token") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !token || !password || !confirmPassword) {
      return { error: "All fields are required." };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long." };
    }

    // Verify token validity
    const record = await db.verificationToken.findFirst({
      where: {
        identifier: `reset:${email}`,
        token,
      },
    });

    if (!record) {
      return {
        error: "This reset link is invalid or has already been used.",
      };
    }

    if (new Date() > record.expires) {
      return {
        error: "This reset link has expired. Please request a new one.",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete used reset token
    await db.verificationToken.deleteMany({
      where: { identifier: `reset:${email}` },
    });

    return { success: "Password updated successfully! Logging you in..." };
  } catch (err) {
    console.error("resetPassword error:", err);
    return { error: "Something went wrong while resetting your password." };
  }
}

