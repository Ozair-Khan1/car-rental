"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { toast } from "sonner";
import { verifyCode, sendVerificationCode } from "@/api/auth";

function VerifyForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const paramName = searchParams.get("name");
    const paramEmail = searchParams.get("email");

    const storedName =
      paramName ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("signup_name") || ""
        : "");
    const storedEmail =
      paramEmail ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("signup_email") || ""
        : "");

    if (!storedEmail) {
      router.replace("/signup");
      return;
    }

    setFullName(storedName);
    setEmail(storedEmail);
  }, [searchParams, router]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyCode(email, cleanCode);

      if (res.error) {
        setError(res.error);
        toast.error("Verification failed", { description: res.error });
        return;
      }

      toast.success("Email verified successfully!");

      if (typeof window !== "undefined") {
        sessionStorage.setItem("signup_verified", "true");
      }

      const query = new URLSearchParams({
        name: fullName,
        email,
        verified: "true",
      }).toString();

      router.push(`/signup/password?${query}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError("");

    try {
      const res = await sendVerificationCode(email, fullName);
      if (res.error) {
        setError(res.error);
        toast.error("Failed to resend code", { description: res.error });
      } else {
        toast.success("New code sent!", {
          description: `A fresh 6-digit code was sent to ${email}`,
        });
        setResendCooldown(60); // 60s cooldown
      }
    } catch {
      setError("Could not resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stagger-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={formRef} className="w-full">
      <div className="stagger-item mb-4">
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:text-[#e8b430] mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </Link>
        <h1 className="text-4xl uppercase tracking-widest text-[var(--text-primary)] mb-2 font-display">
          VERIFY EMAIL
        </h1>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
          We sent a 6-digit code to your email:
        </p>
        {email && (
          <p className="text-xl font-mono font-semibold tracking-wider text-black bg-[#e8b430] border-2 border-black shadow-[4px_4px_0px_0px_var(--shadow-color)] text-center w-full py-1.5 mb-1">
            {email}
          </p>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="stagger-item p-4 bg-red-600 border-2 border-[var(--border)] text-white font-bold uppercase text-sm shadow-[4px_4px_0px_0px_var(--shadow-color)]">
            {error}
          </div>
        )}

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Enter 6-Digit Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => {
              // Only allow numbers
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(val);
            }}
            className="input-field w-full text-center font-mono text-3xl font-black tracking-[12px] py-4 bg-[var(--surface)] text-[var(--text-primary)] border-2 border-[var(--border)]"
            required
            autoFocus
          />
        </div>

        <div className="stagger-item pt-2">
          <BrutalistButton
            type="submit"
            disabled={isLoading || code.trim().length !== 6}
            className="py-3 text-lg"
            containerClassName="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? "VERIFYING..." : "VERIFY CODE"}
              <ArrowRight className="w-5 h-5" />
            </span>
          </BrutalistButton>
        </div>
      </form>

      {/* Resend Section */}
      <div className="stagger-item mt-6 pt-4 border-t-2 border-[var(--border)] flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-70">
          Didn&apos;t receive the code? Check spam or resend.
        </p>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || isResending}
          className="text-xs font-bold uppercase tracking-widest text-[#e8b430] hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1.5 transition-opacity"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
          />
          <span>
            {resendCooldown > 0
              ? `RESEND CODE IN ${resendCooldown}S`
              : isResending
                ? "SENDING..."
                : "RESEND CODE"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center font-mono font-bold uppercase tracking-widest text-sm text-[var(--text-primary)]">
          LOADING...
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}
