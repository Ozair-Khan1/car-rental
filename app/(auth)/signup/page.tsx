"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  Car,
  Key,
} from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { sendVerificationCode } from "@/api/auth";

export default function SignupPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const name = formData.fullName.trim();
    const email = formData.email.trim();

    if (!name || !email) {
      setError("Please fill in both name and email.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendVerificationCode(email, name);

      if (res.error) {
        setError(res.error);
        toast.error("Registration issue", { description: res.error });
        return;
      }

      // Store in sessionStorage and pass to verification page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("signup_name", name);
        sessionStorage.setItem("signup_email", email);
      }

      toast.success("Verification code sent!", {
        description: `Check your inbox at ${email}`,
      });

      const query = new URLSearchParams({
        name,
        email,
      }).toString();

      router.push(`/signup/verify?${query}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animate all children with the 'stagger-item' class
      gsap.fromTo(
        ".stagger-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={formRef} className="w-full">
      <div className="stagger-item mb-4">
        <h1 className="text-4xl uppercase tracking-widest text-[var(--text-primary)] mb-4">
          CREATE ACCOUNT
        </h1>
        <p className="text-[var(--text-primary)] font-medium uppercase tracking-wider text-sm">
          Join DriveNow to start hosting or renting.
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {error && (
          <div className="stagger-item p-4 bg-red-600 border-2 border-[var(--border)] text-white font-bold uppercase text-sm shadow-[4px_4px_0px_0px_var(--shadow-color)]">
            {error}
          </div>
        )}

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input-field w-full font-bold"
            required
          />
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field w-full font-bold"
            required
          />
        </div>

        <div className="stagger-item pt-2">
          <BrutalistButton
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="py-3 text-lg"
            containerClassName="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? "PROCESSING..." : "CONTINUE"}
              <ArrowRight className="w-5 h-5" />
            </span>
          </BrutalistButton>
        </div>
      </form>

      <div className="stagger-item mt-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60">
          By creating an account, you agree to our{" "}
          <Link
            href="/legal/terms"
            className="text-[var(--text-primary)] hover:text-[#e8b430] underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            className="text-[var(--text-primary)] hover:text-[#e8b430] underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="stagger-item mt-4 flex items-center justify-center gap-4">
        <div className="h-[2px] bg-[var(--text-primary)] flex-1" />
        <span className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          OR
        </span>
        <div className="h-[2px] bg-[var(--text-primary)] flex-1" />
      </div>

      <div className="stagger-item mt-4">
        <BrutalistButton
          type="button"
          disabled={isLoading || isGoogleLoading}
          onClick={handleGoogleSignup}
          className="py-3 text-base"
          containerClassName="w-full"
        >
          <span className="flex items-center justify-center gap-3">
            {isGoogleLoading ? "LOADING..." : "SIGN UP WITH GOOGLE"}
          </span>
        </BrutalistButton>
      </div>

      <p className="stagger-item mt-4 text-center text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#e8b430] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
