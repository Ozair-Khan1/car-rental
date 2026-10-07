"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { name: "Cars", href: "/cars" },
  { name: "Locations", href: "/locations" },
  { name: "Deals", href: "/deals" },
  { name: "How It Works", href: "/how-it-works" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/signup") ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (isAuthRoute) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out",
        isScrolled
          ? "bg-[var(--bg)] shadow-[4px_4px_0px_0px_var(--shadow)] border-b-2 border-[var(--border)] py-4"
          : "bg-transparent py-6 border-b border-transparent",
      )}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 relative z-50 -ml-1.5" aria-label="DriveNow Home">
            <Logo className="h-10 sm:h-11 md:h-12 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isCars = link.href === "/cars";
              const isActive =
                pathname === link.href ||
                (isCars && pathname.startsWith("/cars"));
              const isCarsActive = isActive && isCars;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-bold uppercase tracking-widest transition-colors relative py-1",
                    isCarsActive
                      ? "text-[var(--ink)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[var(--accent)]"
                      : isActive
                        ? "text-[var(--accent)] link-underline"
                        : "text-[var(--ink)] hover:text-[var(--accent)] link-underline",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                className="text-sm font-bold uppercase tracking-widest text-[var(--ink)] hover:text-[var(--accent)] transition-colors link-underline"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold uppercase tracking-widest text-[var(--ink)] hover:text-[var(--accent)] transition-colors link-underline"
              >
                Sign In
              </Link>
            )}
            <BrutalistButton
              href="/cars"
              className="px-6 py-2.5 text-sm h-auto rounded-none hidden sm:inline-flex"
              containerClassName="rounded-none hidden sm:inline-block"
            >
              <span>Rent a car</span>
            </BrutalistButton>
            <ThemeToggle />
          </div>

          <div className="flex lg:hidden items-center gap-2 relative z-50">
            <ThemeToggle />
            <button
              className="p-2 text-[var(--ink)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-[72px] z-40 bg-[var(--bg)] p-6 h-[calc(100vh-72px)] overflow-y-auto border-t-2 border-[var(--border)] transition-all duration-200 ease-out",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible",
        )}
      >
        <div className="flex flex-col gap-6 pt-4">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link, idx) => (
              <div
                key={link.name}
                style={{
                  transitionDelay: isMobileMenuOpen
                    ? `${100 + idx * 75}ms`
                    : "0ms",
                }}
                className={cn(
                  "transition-all duration-400 ease-out",
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-6",
                )}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-3xl font-black uppercase tracking-tighter block w-full transition-colors",
                    link.href === "/cars" &&
                      (pathname === "/cars" || pathname.startsWith("/cars"))
                      ? "text-[var(--ink)] border-b-[3px] border-[var(--accent)] pb-1 w-fit"
                      : "text-[var(--ink)] hover:text-[var(--accent)]",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </nav>

          <div
            style={{
              transitionDelay: isMobileMenuOpen
                ? `${100 + navLinks.length * 75}ms`
                : "0ms",
            }}
            className={cn(
              "h-[2px] w-full bg-[var(--border)] my-6 origin-left transition-all duration-500 ease-out",
              isMobileMenuOpen
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0",
            )}
          />

          <div className="flex flex-col gap-6">
            <div
              style={{
                transitionDelay: isMobileMenuOpen
                  ? `${100 + (navLinks.length + 1) * 75}ms`
                  : "0ms",
              }}
              className={cn(
                "transition-all duration-400 ease-out",
                isMobileMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-6",
              )}
            >
              {status !== "authenticated" ? (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-2xl font-black uppercase text-[var(--ink)] hover:text-[var(--accent)]"
                >
                  <User size={24} />
                  Sign In
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black uppercase text-[var(--ink)] hover:text-[var(--accent)]"
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div
              style={{
                transitionDelay: isMobileMenuOpen
                  ? `${100 + (navLinks.length + 2) * 75}ms`
                  : "0ms",
              }}
              className={cn(
                "transition-all duration-400 ease-out mt-4",
                isMobileMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-6",
              )}
            >
              <BrutalistButton
                href="/cars"
                className="py-5 text-xl"
                containerClassName="w-full text-center"
              >
                <span onClick={() => setIsMobileMenuOpen(false)}>
                  Rent a car
                </span>
              </BrutalistButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
