"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navLinks = [
  { name: "Browse Cars", href: "/cars" },
  { name: "Locations", href: "/locations" },
  { name: "Deals", href: "/deals" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Background logic
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide/Show logic based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down & passed threshold
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const ctx = gsap.context(() => {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
          display: "block",
        });
        // Stagger links
        gsap.fromTo(
          ".mobile-link",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power3.out",
            delay: 0.1,
          },
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            if (mobileMenuRef.current) {
              mobileMenuRef.current.style.display = "none";
            }
          },
        });
      }
    }, mobileMenuRef);

    return () => ctx.revert();
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Hide navbar on auth routes
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        isScrolled
          ? "bg-[var(--surface-elevated)] border-b border-[var(--border-color)] py-4 shadow-sm"
          : "bg-transparent py-6",
        isHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 relative z-50">
            <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              DriveNow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--accent)]",
                  pathname === link.href
                    ? "text-[var(--foreground)] font-semibold"
                    : "text-[var(--text-secondary)]",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {status === "authenticated" ? (
              <Button asChild variant="secondary">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                Sign In
              </Link>
            )}
            <Button asChild variant="primary">
              <Link href="/cars">Rent a Car</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden relative z-50 p-2 text-[var(--foreground)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 top-[72px] z-40 bg-[var(--background)] p-6 hidden h-[calc(100vh-72px)] overflow-y-auto border-t border-[var(--border-color)]"
        style={{ opacity: 0, transform: "translateY(-20px)" }}
      >
        <div className="flex flex-col gap-6 pt-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="mobile-link text-2xl font-semibold text-[var(--foreground)]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="h-px w-full bg-[var(--border-color)] my-4" />

          <div className="flex flex-col gap-4">
            {status !== "authenticated" ? (
              <Link
                href="/login"
                className="mobile-link flex items-center gap-2 text-lg font-medium text-[var(--text-secondary)]"
              >
                <User size={20} />
                Sign In / Account
              </Link>
            ) : (
              <Button asChild variant="secondary">
                <Link href="/dashboard" className="text-[16px] font-bold">
                  Dashboard
                </Link>
              </Button>
            )}
            <Button asChild size="lg" className="mobile-link w-full mt-4">
              <Link href="/cars">Rent a Car</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
