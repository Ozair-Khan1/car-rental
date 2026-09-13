"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
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
        role: role === "OWNER" ? "OWNER" : "CUSTOMER",
      },
    });

    return { success: "Account created successfully! You can now log in." };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration" };
  }
}
