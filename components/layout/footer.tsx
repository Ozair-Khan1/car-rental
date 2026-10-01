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
    <footer className="pt-24 pb-12 w-full bg-[var(--background)] relative z-10 flex flex-col items-center">
      <div className="container px-4 md:px-6 w-full max-w-[1350px]">
        {/* Yellow Footer Card */}
        <div className="bg-[#E8B42A] border-2 border-black shadow-[8px_8px_0px_0px_#000000] p-6 md:p-12 text-black w-full flex flex-col gap-12">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <h2 className="font-display text-h1 uppercase leading-none tracking-tight">
              DriveNow
            </h2>
            <div className="w-16 h-1 bg-black"></div>
          </div>

          {/* 4 Clean Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Reveal delay={0}>
              <h4 className="text-[14px] font-display uppercase mb-6 text-black tracking-widest font-bold">
                Company
              </h4>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium">
                <li>
                  <Link
                    href="/about"
                    className="hover:underline underline-offset-4"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:underline underline-offset-4"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:underline underline-offset-4"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={60}>
              <h4 className="text-[14px] font-display uppercase mb-6 text-black tracking-widest font-bold">
                Rentals
              </h4>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium">
                <li>
                  <Link
                    href="/cars"
                    className="hover:underline underline-offset-4"
                  >
                    Cars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations"
                    className="hover:underline underline-offset-4"
                  >
                    Locations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="hover:underline underline-offset-4"
                  >
                    Deals
                  </Link>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <h4 className="text-[14px] font-display uppercase mb-6 text-black tracking-widest font-bold">
                Support
              </h4>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium">
                <li>
                  <Link
                    href="/help"
                    className="hover:underline underline-offset-4"
                  >
                    Help center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cancellation"
                    className="hover:underline underline-offset-4"
                  >
                    Cancellation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/insurance"
                    className="hover:underline underline-offset-4"
                  >
                    Insurance
                  </Link>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={180}>
              <h4 className="text-[14px] font-display uppercase mb-6 text-black tracking-widest font-bold">
                Legal
              </h4>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium">
                <li>
                  <Link
                    href="/legal/terms"
                    className="hover:underline underline-offset-4"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="hover:underline underline-offset-4"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/cookies"
                    className="hover:underline underline-offset-4"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="w-full h-[2px] bg-black"></div>

          {/* Bottom row: Copyright & Language */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[14px] text-black font-medium">
            <div>
              &copy; {new Date().getFullYear()} DriveNow. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Globe size={16} className="text-black" />
                <span>English (US)</span>
              </button>
              <button className="hover:opacity-70 transition-opacity">
                $ USD
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
