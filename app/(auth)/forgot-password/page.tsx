"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { toast } from "sonner";
import { gsap } from "gsap";
import { requestPasswordReset } from "@/api/auth";

export default function ForgotPasswordPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    }, formRef);

    return () => ctx.revert();
  }, [isSubmitted]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await requestPasswordReset(email);

      if (res.error) {
        setError(res.error);
        toast.error("Error", { description: res.error });
      } else {
        setIsSubmitted(true);
        setCooldown(60);
        toast.success("Reset link sent!", {
          description: "Check your inbox for password reset instructions.",
        });
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Error", { description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await requestPasswordReset(email);
      if (res.error) {
        toast.error("Error", { description: res.error });
      } else {
        setCooldown(60);
        toast.success("New reset link sent!", {
          description: "A fresh link has been delivered to your email.",
        });
      }
    } catch {
      toast.error("Failed to resend. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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
          FORGOT PASSWORD
        </h1>
        <p className="text-[var(--text-primary)] font-medium uppercase tracking-wider text-sm opacity-80">
          {isSubmitted
            ? "Check your email for reset instructions."
            : "Enter your email to receive a password reset link."}
        </p>
      </div>

      {!isSubmitted ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="stagger-item p-4 bg-red-600 border-2 border-[var(--border)] text-white font-bold uppercase text-sm shadow-[4px_4px_0px_0px_var(--shadow-color)]">
              {error}
            </div>
          )}

          <div className="stagger-item space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full font-bold"
              required
              autoFocus
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
                {isLoading ? "SENDING LINK..." : "SEND RESET LINK"}
                <ArrowRight className="w-5 h-5" />
              </span>
            </BrutalistButton>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="stagger-item bg-[#E8B42A] border-3 border-black p-5 shadow-[5px_5px_0px_0px_#000000] text-black">
            <div className="flex items-center gap-2.5 mb-2 font-black uppercase text-base tracking-wider">
              <CheckCircle2 className="w-5 h-5" />
              <span>LINK DELIVERED</span>
            </div>
            <p className="text-sm font-bold leading-relaxed mb-3">
              We&apos;ve sent a password reset link to:
            </p>
            <div className="bg-white border-2 border-black px-3 py-1.5 font-mono font-bold text-sm tracking-wide break-all shadow-[2px_2px_0px_0px_#000000]">
              {email}
            </div>
            <p className="text-xs font-semibold mt-3 opacity-90">
              The link will expire in <strong>1 hour</strong>. Don&apos;t see it?
              Check your spam folder.
            </p>
          </div>

          <div className="stagger-item flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isLoading}
              className="w-full py-3 bg-[var(--surface)] text-[var(--text-primary)] border-2 border-[var(--border)] font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-[#E8B42A] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cooldown > 0
                ? `RESEND LINK IN ${cooldown}S`
                : isLoading
                ? "SENDING..."
                : "RESEND RESET LINK"}
            </button>

            <Link
              href="/login"
              className="w-full text-center py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:text-[#e8b430] transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      )}

      <div className="stagger-item mt-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-[var(--text-primary)] hover:text-[#e8b430] underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
