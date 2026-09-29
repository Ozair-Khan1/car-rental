"use client";

import React from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { Reveal } from "@/components/ui/reveal";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on auth routes
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] pt-24 pb-12 text-[var(--text-primary)]">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">

        {/* 4 Clean Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          <Reveal delay={0}>
            <h4 className="text-[13px] font-semibold mb-6 text-black/50 tracking-wider">
              Company
            </h4>
            <ul className="flex flex-col gap-4 text-[14px] text-black/65">
              <li>
                <Link href="/about" className="link-underline">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="link-underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-underline">
                  Contact
                </Link>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={60}>
            <h4 className="text-[13px] font-semibold mb-6 text-black/50 tracking-wider">
              Rentals
            </h4>
            <ul className="flex flex-col gap-4 text-[14px] text-black/65">
              <li>
                <Link href="/cars" className="link-underline">
                  Cars
                </Link>
              </li>
              <li>
                <Link href="/locations" className="link-underline">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/deals" className="link-underline">
                  Deals
                </Link>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <h4 className="text-[13px] font-semibold mb-6 text-black/50 tracking-wider">
              Support
            </h4>
            <ul className="flex flex-col gap-4 text-[14px] text-black/65">
              <li>
                <Link href="/help" className="link-underline">
                  Help center
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="link-underline">
                  Cancellation
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="link-underline">
                  Insurance
                </Link>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={180}>
            <h4 className="text-[13px] font-semibold mb-6 text-black/50 tracking-wider">
              Legal
            </h4>
            <ul className="flex flex-col gap-4 text-[14px] text-black/65">
              <li>
                <Link href="/legal/terms" className="link-underline">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="link-underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="link-underline">
                  Cookies
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* Bottom row: Copyright & Language */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[13px] text-black/50">
          <div>
            &copy; {new Date().getFullYear()} DriveNow. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors">
              <Globe size={14} className="text-[var(--icon)]" />
              <span className="font-medium">English (US)</span>
            </button>
            <button className="hover:text-[var(--text-primary)] transition-colors font-medium">
              $ USD
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
