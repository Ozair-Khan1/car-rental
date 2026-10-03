"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Reveal } from "@/components/ui/reveal";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on auth routes
  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/signup") ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (isAuthRoute) {
    return null;
  }

  return (
    <footer className="pt-24 pb-12 w-full bg-[var(--background)] relative z-10 flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
        {/* Yellow Footer Card */}
        <div className="bg-[#E8B42A] border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-6 md:p-12 text-black w-full flex flex-col gap-12">
          {/* Top row: Inverted Logo */}
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <Link
              href="/"
              className="inline-flex items-center hover:opacity-90 transition-opacity select-none"
              aria-label="DriveNow Home"
            >
              <Image
                src="/logo-footer.svg"
                alt="DriveNow"
                width={200}
                height={56}
                className="h-[42px] sm:h-[50px] md:h-[56px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* 4 Clean Columns: perfectly aligned baselines */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
            <Reveal delay={0} className="flex flex-col">
              <h3 className="font-display font-normal text-[20px] uppercase tracking-[0.04em] text-black m-0 p-0 leading-none mb-5">
                Company
              </h3>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium list-none m-0 p-0">
                <li>
                  <Link
                    href="/about"
                    className="link-underline transition-colors w-fit"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="link-underline transition-colors w-fit"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="link-underline transition-colors w-fit"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={60} className="flex flex-col">
              <h3 className="font-display font-normal text-[20px] uppercase tracking-[0.04em] text-black m-0 p-0 leading-none mb-5">
                Rentals
              </h3>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium list-none m-0 p-0">
                <li>
                  <Link
                    href="/cars"
                    className="link-underline transition-colors w-fit"
                  >
                    Cars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations"
                    className="link-underline transition-colors w-fit"
                  >
                    Locations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="link-underline transition-colors w-fit"
                  >
                    Deals
                  </Link>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={120} className="flex flex-col">
              <h3 className="font-display font-normal text-[20px] uppercase tracking-[0.04em] text-black m-0 p-0 leading-none mb-5">
                Support
              </h3>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium list-none m-0 p-0">
                <li>
                  <Link
                    href="/help"
                    className="link-underline transition-colors w-fit"
                  >
                    Help center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cancellation"
                    className="link-underline transition-colors w-fit"
                  >
                    Cancellation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/insurance"
                    className="link-underline transition-colors w-fit"
                  >
                    Insurance
                  </Link>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={180} className="flex flex-col">
              <h3 className="font-display font-normal text-[20px] uppercase tracking-[0.04em] text-black m-0 p-0 leading-none mb-5">
                Legal
              </h3>
              <ul className="flex flex-col gap-4 text-[16px] text-black font-medium list-none m-0 p-0">
                <li>
                  <Link
                    href="/legal/terms"
                    className="link-underline transition-colors w-fit"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="link-underline transition-colors w-fit"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="w-full h-[2px] bg-black"></div>

          {/* Bottom row: Copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[14px] text-black font-medium">
            <div>
              &copy; {new Date().getFullYear()} DriveNow. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
