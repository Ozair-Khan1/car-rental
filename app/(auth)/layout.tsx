"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row overflow-hidden relative font-sans">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <BrutalistButton
          href="/"
          variant="white"
          containerClassName="w-full lg:w-[180px]"
          className="h-[56px] px-6 py-0"
        >
          <span>Home</span>
        </BrutalistButton>
      </div>

      {/* Left side - Yellow Brutalist Block */}
      <div className="hidden md:flex flex-col w-1/2 relative bg-[var(--icon)] border-r-[8px] border-[var(--border)] p-12 lg:p-24 overflow-hidden">
        <div className="relative z-10 flex flex-col h-full justify-center">
          <Link
            href="/"
            className="text-4xl font-display tracking-widest text-black mb-8 border-2 border-black inline-block w-fit px-6 py-2 bg-[var(--surface)] shadow-[4px_4px_0px_0px_#000000]"
          >
            DriveNow
          </Link>
          <h2 className="text-[5rem] lg:text-[7rem] mb-8 leading-[0.85] text-black uppercase tracking-tighter">
            No Limits.
            <br />
            Just Drive.
          </h2>
          <p className="text-xl font-bold text-black max-w-md border-l-8 border-black pl-6 uppercase tracking-wider">
            Join the most hardcore car rental platform on the planet. Elite
            fleet. Zero bullshit.
          </p>
        </div>
      </div>

      {/* Right side - Form Container */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[var(--background)] relative animate-grid bg-[size:40px_40px] bg-[image:linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)]">
        <div className="w-full max-w-md relative z-10 card-brutalist">
          {/* Mobile Logo */}
          <div className="md:hidden mb-12 text-center">
            <Link
              href="/"
              className="text-4xl font-display uppercase tracking-widest text-black bg-[var(--icon)] border-2 border-[var(--border)] inline-block px-6 py-2 shadow-[4px_4px_0px_0px_var(--shadow-color)]"
            >
              DRIVENOW
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
