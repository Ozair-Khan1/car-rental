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
import { registerUser } from "@/api/auth";

export default function SignupPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
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

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const res = await registerUser(form);

      if (res.error) {
        setError(res.error);
        toast.error("Registration failed", { description: res.error });
      } else if (res.success) {
        toast.success("Account created!", { description: res.success });
        router.push("/login");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Error", { description: "An unexpected error occurred." });
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

        <div className="stagger-item space-y-2 mb-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            How do you want to use DriveNow?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
              className={`p-3 border-2 transition-all text-left focus:outline-none ${
                formData.role === "CUSTOMER"
                  ? "border-[var(--border)] bg-[#e8b430] text-[var(--text-primary)] shadow-[4px_4px_0px_0px_var(--shadow-color)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
              }`}
            >
              <div className="font-black uppercase tracking-widest text-base">
                RENT A CAR
              </div>
              <div
                className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${formData.role === "CUSTOMER" ? "text-[var(--text-primary)]" : "text-[var(--text-primary)] opacity-70"}`}
              >
                Find and book cars from owners
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "OWNER" })}
              className={`p-3 border-2 transition-all text-left focus:outline-none ${
                formData.role === "OWNER"
                  ? "border-[var(--border)] bg-[#e8b430] text-[var(--text-primary)] shadow-[4px_4px_0px_0px_var(--shadow-color)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
              }`}
            >
              <div className="font-black uppercase tracking-widest text-base">
                LIST MY CAR
              </div>
              <div
                className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${formData.role === "OWNER" ? "text-[var(--text-primary)]" : "text-[var(--text-primary)] opacity-70"}`}
              >
                Rent out your car and earn money
              </div>
            </button>
          </div>
          <input type="hidden" name="role" value={formData.role} />
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Full Name
          </label>
          <input
            type="text"
            placeholder="JOHN DOE"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input-field w-full font-bold uppercase"
            required
          />
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Email
          </label>
          <input
            type="email"
            placeholder="YOU@EXAMPLE.COM"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field w-full font-bold uppercase"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="stagger-item space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Password
            </label>
            <input
              type="password"
              placeholder="STRONG PASSWORD"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field w-full font-bold uppercase"
              required
            />
          </div>

          <div className="stagger-item space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="CONFIRM PASSWORD"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field w-full font-bold uppercase"
              required
            />
          </div>
        </div>

        <div className="stagger-item pt-2">
          <BrutalistButton
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="py-3 text-lg"
            containerClassName="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
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
