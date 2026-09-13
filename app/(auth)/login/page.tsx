"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="stagger-item mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-[var(--text-secondary)]">
          Enter your details to access your account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleCredentialsLogin}>
        {error && (
          <div className="stagger-item flex items-center gap-2 p-3 text-sm text-[var(--error)] bg-[var(--error)]/10 border border-[var(--error)]/20 rounded-[var(--radius-md)]">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              required
            />
          </div>
        </div>

        <div className="stagger-item space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In{" "}
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

      <div className="stagger-item mt-8 flex items-center justify-center gap-4">
        <div className="h-px bg-[var(--border-color)] flex-1" />
        <span className="text-sm text-[var(--text-muted)]">
          Or continue with
        </span>
        <div className="h-px bg-[var(--border-color)] flex-1" />
      </div>

      <div className="stagger-item mt-8 grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          disabled={isLoading || isGoogleLoading}
          className="py-5 font-medium hover:bg-[var(--surface-elevated)] flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
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
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
