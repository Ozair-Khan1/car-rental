"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        toast.error("Sign in failed", {
          description: "Please check your email and password and try again.",
        });
      } else {
        toast.success("Welcome back!", {
          description: "You have successfully signed in.",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Error", { description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div ref={formRef} className="w-full">
      <div className="stagger-item mb-6">
        <h1 className="text-4xl uppercase tracking-widest text-[var(--text-primary)] mb-4">
          SIGN IN
        </h1>
        <p className="text-[var(--text-primary)] font-medium uppercase tracking-wider text-sm">
          Access your account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleCredentialsLogin}>
        {error && (
          <div className="stagger-item p-4 bg-red-600 border-2 border-[var(--border)] text-white font-bold uppercase text-sm shadow-[4px_4px_0px_0px_var(--shadow-color)]">
            {error}
          </div>
        )}

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Email
          </label>
          <input
            type="email"
            placeholder="YOU@EXAMPLE.COM"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full font-bold uppercase"
            required
          />
        </div>

        <div className="stagger-item space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold uppercase tracking-widest text-[#e8b430] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full font-bold uppercase"
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
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </span>
          </BrutalistButton>
        </div>
      </form>

      <div className="stagger-item mt-6 flex items-center justify-center gap-4">
        <div className="h-[2px] bg-[var(--text-primary)] flex-1" />
        <span className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          OR
        </span>
        <div className="h-[2px] bg-[var(--text-primary)] flex-1" />
      </div>

      <div className="stagger-item mt-6">
        <BrutalistButton
          type="button"
          disabled={isLoading || isGoogleLoading}
          onClick={handleGoogleLogin}
          className="py-3 text-base"
          containerClassName="w-full"
        >
          <span className="flex items-center justify-center gap-3">
            {isGoogleLoading ? "LOADING..." : "SIGN IN WITH GOOGLE"}
          </span>
        </BrutalistButton>
      </div>

      <p className="stagger-item mt-6 text-center text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
        Don't have an account?{" "}
        <Link href="/signup" className="text-[#e8b430] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
