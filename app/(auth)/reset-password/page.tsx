"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { toast } from "sonner";
import { gsap } from "gsap";
import { verifyResetToken, resetPassword } from "@/api/auth";
import { signIn } from "next-auth/react";

function ResetPasswordForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenError, setTokenError] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("RESET PASSWORD");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate the token on mount
  useEffect(() => {
    async function checkToken() {
      if (!token || !email) {
        setTokenError("Missing token or email in reset link. Please request a new one.");
        setIsVerifying(false);
        return;
      }

      const res = await verifyResetToken(email, token);
      if (res.error) {
        setTokenError(res.error);
      }
      setIsVerifying(false);
    }

    checkToken();
  }, [token, email]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    }, formRef);

    return () => ctx.revert();
  }, [isVerifying, tokenError, isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setLoadingText("UPDATING PASSWORD...");

    try {
      const data = new FormData();
      data.append("email", email);
      data.append("token", token);
      data.append("password", formData.password);
      data.append("confirmPassword", formData.confirmPassword);

      const res = await resetPassword(data);

      if (res.error) {
        setError(res.error);
        toast.error("Error", { description: res.error });
        setIsLoading(false);
        setLoadingText("RESET PASSWORD");
        return;
      }

      setIsSuccess(true);
      setLoadingText("SIGNING IN...");

      // Automatically sign the user in with their new password
      const cleanEmail = email.toLowerCase().trim();
      const signInRes = await signIn("credentials", {
        email: cleanEmail,
        password: formData.password,
        redirect: false,
      });

      if (signInRes?.error) {
        toast.success("Password reset!", {
          description: "Please sign in with your new password.",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.success("Password updated!", {
          description: "Logged in successfully. Redirecting to dashboard...",
        });
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Error", { description: "An unexpected error occurred." });
      setIsLoading(false);
      setLoadingText("RESET PASSWORD");
    }
  };

  if (isVerifying) {
    return (
      <div className="p-8 text-center font-mono font-bold uppercase tracking-widest text-sm text-[var(--text-primary)]">
        VERIFYING RESET LINK...
      </div>
    );
  }

  if (tokenError) {
    return (
      <div ref={formRef} className="w-full">
        <div className="stagger-item mb-4">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:text-[#e8b430] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>REQUEST NEW LINK</span>
          </Link>
          <h1 className="text-4xl uppercase tracking-widest text-[var(--text-primary)] mb-2 font-display">
            LINK EXPIRED
          </h1>
        </div>

        <div className="stagger-item p-5 bg-red-600 border-3 border-black text-white font-bold uppercase text-sm shadow-[5px_5px_0px_0px_#000000] mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-black">INVALID OR EXPIRED LINK</span>
          </div>
          <p className="normal-case font-medium text-xs leading-relaxed text-white/95">
            {tokenError}
          </p>
        </div>

        <div className="stagger-item space-y-3">
          <BrutalistButton
            href="/forgot-password"
            className="py-3 text-base"
            containerClassName="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              REQUEST NEW RESET LINK
              <ArrowRight className="w-4 h-4" />
            </span>
          </BrutalistButton>

          <Link
            href="/login"
            className="block w-full text-center py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:text-[#e8b430] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div ref={formRef} className="w-full">
        <div className="stagger-item bg-[#E8B42A] border-3 border-black p-6 shadow-[6px_6px_0px_0px_#000000] text-black text-center">
          <div className="w-12 h-12 bg-black text-[#E8B42A] flex items-center justify-center mx-auto mb-4 border-2 border-black">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-display font-black uppercase tracking-wider mb-2">
            PASSWORD RESET!
          </h2>
          <p className="text-sm font-bold uppercase tracking-wide opacity-90 mb-4">
            Your password has been updated and you are being redirected to your dashboard...
          </p>
          <div className="font-mono text-xs font-bold tracking-widest bg-black text-[#E8B42A] py-1.5 px-3 inline-block">
            AUTHENTICATING...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="w-full">
      <div className="stagger-item mb-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:text-[#e8b430] mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SIGN IN</span>
        </Link>
        <h1 className="text-4xl uppercase tracking-widest text-[var(--text-primary)] mb-2 font-display">
          NEW PASSWORD
        </h1>
        {email && (
          <div className="flex items-center justify-center gap-2 bg-[#e8b430] border-2 border-black shadow-[4px_4px_0px_0px_var(--shadow-color)] py-1.5 px-3 mb-2">
            <span className="text-sm md:text-base font-mono font-semibold tracking-wider text-black truncate">
              {email}
            </span>
          </div>
        )}
        <p className="text-[var(--text-primary)] font-medium uppercase tracking-wider text-xs opacity-75">
          Enter and confirm your new secure password.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="stagger-item p-4 bg-red-600 border-2 border-[var(--border)] text-white font-bold uppercase text-sm shadow-[4px_4px_0px_0px_var(--shadow-color)]">
            {error}
          </div>
        )}

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            New Password
          </label>
          <input
            type="password"
            placeholder="At least 6 characters"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field w-full font-bold"
            required
            autoFocus
          />
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field w-full font-bold"
            required
          />
        </div>

        <div className="stagger-item pt-2">
          <BrutalistButton
            type="submit"
            disabled={isLoading}
            className="py-3 text-lg"
            containerClassName="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? loadingText : "RESET PASSWORD"}
              <ArrowRight className="w-5 h-5" />
            </span>
          </BrutalistButton>
        </div>
      </form>

      <div className="stagger-item mt-4 text-center">
        <Link
          href="/login"
          className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:text-[#e8b430] transition-colors"
        >
          Cancel and return to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center font-mono font-bold uppercase tracking-widest text-sm text-[var(--text-primary)]">
          LOADING...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
