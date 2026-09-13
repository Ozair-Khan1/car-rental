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
import { Button } from "@/components/ui/button";
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
      <div className="stagger-item mb-8">
        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
        <p className="text-[var(--text-secondary)]">
          Join DriveNow to start hosting or renting premium vehicles.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="stagger-item flex items-center gap-2 p-3 text-sm text-[var(--error)] bg-[var(--error)]/10 border border-[var(--error)]/20 rounded-[var(--radius-md)]">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}

        <div className="stagger-item space-y-3 mb-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            How do you want to use DriveNow?
          </label>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
              className={`p-4 border rounded-[var(--radius-md)] text-left transition-all ${
                formData.role === "CUSTOMER"
                  ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-sm"
                  : "border-[var(--border-color)] bg-[var(--background)] hover:border-[var(--text-muted)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${formData.role === "CUSTOMER" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-[var(--surface-elevated)] text-[var(--text-muted)]"}`}
                >
                  <Car size={24} />
                </div>
                <div>
                  <div
                    className={`font-semibold ${formData.role === "CUSTOMER" ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}
                  >
                    Rent a car
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] mt-0.5">
                    Find and book cars from owners
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "OWNER" })}
              className={`p-4 border rounded-[var(--radius-md)] text-left transition-all ${
                formData.role === "OWNER"
                  ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-sm"
                  : "border-[var(--border-color)] bg-[var(--background)] hover:border-[var(--text-muted)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${formData.role === "OWNER" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-[var(--surface-elevated)] text-[var(--text-muted)]"}`}
                >
                  <Key size={24} />
                </div>
                <div>
                  <div
                    className={`font-semibold ${formData.role === "OWNER" ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}
                  >
                    List my car
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] mt-0.5">
                    Rent out your car and earn money
                  </div>
                </div>
              </div>
            </button>
          </div>
          <input type="hidden" name="role" value={formData.role} />
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Full Name
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="John Doe"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              required
            />
          </div>
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              required
            />
          </div>
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="password"
              placeholder="Create a strong password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              required
            />
          </div>
        </div>

        <div className="stagger-item space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              required
            />
          </div>
        </div>

        <div className="stagger-item pt-2">
          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-6 text-base group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </span>
          </Button>
        </div>
      </form>

      <div className="stagger-item mt-6 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          By creating an account, you agree to our{" "}
          <Link
            href="/legal/terms"
            className="underline hover:text-[var(--foreground)]"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            className="underline hover:text-[var(--foreground)]"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="stagger-item mt-8 flex items-center justify-center gap-4">
        <div className="h-px bg-[var(--border-color)] flex-1" />
        <span className="text-sm text-[var(--text-muted)]">
          Or sign up with
        </span>
        <div className="h-px bg-[var(--border-color)] flex-1" />
      </div>

      <div className="stagger-item mt-8 grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          disabled={isLoading || isGoogleLoading}
          className="py-5 font-medium hover:bg-[var(--surface-elevated)] flex items-center justify-center gap-2"
          onClick={handleGoogleSignup}
        >
          {isGoogleLoading ? (
            <Loader2
              size={16}
              className="animate-spin text-[var(--text-muted)]"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
          )}
          Google
        </Button>
      </div>

      <p className="stagger-item mt-10 text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
