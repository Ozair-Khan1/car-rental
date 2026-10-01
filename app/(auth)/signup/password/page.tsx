"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { toast } from "sonner";
import { registerUser } from "@/api/auth";
import { signIn } from "next-auth/react";

function PasswordForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("CREATE ACCOUNT");
  const [error, setError] = useState("");

  useEffect(() => {
    // Read from search params or session storage
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

    if (!storedEmail && !storedName) {
      // If user navigated directly here without step 1, redirect back to step 1
      router.replace("/signup");
      return;
    }

    setFullName(storedName);
    setEmail(storedEmail);
  }, [searchParams, router]);

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
      setError("Please fill in all password fields.");
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
    setLoadingText("CREATING ACCOUNT...");

    try {
      const data = new FormData();
      data.append("fullName", fullName);
      data.append("email", email);
      data.append("password", formData.password);
      data.append("confirmPassword", formData.confirmPassword);
      data.append("role", formData.role);

      const res = await registerUser(data);

      if (res.error) {
        setError(res.error);
        toast.error("Registration failed", { description: res.error });
        setIsLoading(false);
        setLoadingText("CREATE ACCOUNT");
        return;
      }

      if (res.success) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("signup_name");
          sessionStorage.removeItem("signup_email");
        }

        setLoadingText("SIGNING IN...");

        // Automatically log in the user immediately
        const cleanEmail = email.toLowerCase().trim();
        const signInRes = await signIn("credentials", {
          email: cleanEmail,
          password: formData.password,
          redirect: false,
        });

        if (signInRes?.error) {
          toast.success("Account created!", {
            description: "Please sign in with your new credentials.",
          });
          router.push("/login");
        } else {
          toast.success("Welcome to DriveNow!", {
            description: "Your account is ready and you are logged in.",
          });
          const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Error", { description: "An unexpected error occurred." });
      setIsLoading(false);
      setLoadingText("CREATE ACCOUNT");
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
          href={`/signup/verify?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] opacity-70 hover:opacity-100 hover:text-[#e8b430] mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </Link>
        <h1 className="text-4xl uppercase tracking-widest text-[var(--text-primary)] mb-2 font-display">
          SET PASSWORD
        </h1>
        {email && (
          <div className="flex items-center justify-center gap-2 bg-[#e8b430] border-2 border-black shadow-[4px_4px_0px_0px_var(--shadow-color)] py-1.5 px-3 mb-1">
            <span className="text-lg md:text-xl font-mono font-semibold tracking-wider text-black truncate">
              {email}
            </span>
            <span className="bg-black text-[#e8b430] text-[10px] font-black uppercase px-2 py-0.5 tracking-widest border border-black shrink-0">
              VERIFIED
            </span>
          </div>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="stagger-item p-4 bg-red-600 border-2 border-[var(--border)] text-white font-bold uppercase text-sm shadow-[4px_4px_0px_0px_var(--shadow-color)]">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            How do you want to use DriveNow?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
              className={`p-3 border-2 transition-all text-left focus:outline-none ${
                formData.role === "CUSTOMER"
                  ? "border-[var(--border)] bg-[#e8b430] text-black shadow-[4px_4px_0px_0px_var(--shadow-color)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
              }`}
            >
              <div className="font-black uppercase tracking-widest text-base">
                RENT A CAR
              </div>
              <div
                className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                  formData.role === "CUSTOMER"
                    ? "text-black"
                    : "text-[var(--text-primary)] opacity-70"
                }`}
              >
                Find and book cars
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "OWNER" })}
              className={`p-3 border-2 transition-all text-left focus:outline-none ${
                formData.role === "OWNER"
                  ? "border-[var(--border)] bg-[#e8b430] text-black shadow-[4px_4px_0px_0px_var(--shadow-color)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
              }`}
            >
              <div className="font-black uppercase tracking-widest text-base">
                LIST MY CAR
              </div>
              <div
                className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                  formData.role === "OWNER"
                    ? "text-black"
                    : "text-[var(--text-primary)] opacity-70"
                }`}
              >
                Rent out and earn
              </div>
            </button>
          </div>
        </div>

        {/* Password Inputs */}
        <div className="stagger-item space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
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
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
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
              {isLoading ? loadingText : "CREATE ACCOUNT"}
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
    </div>
  );
}

export default function SignupPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center font-mono font-bold uppercase tracking-widest text-sm text-[var(--text-primary)]">
          LOADING...
        </div>
      }
    >
      <PasswordForm />
    </Suspense>
  );
}
