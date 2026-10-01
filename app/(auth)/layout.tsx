"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
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
          containerClassName="w-full lg:w-[150px]"
          className="h-[40px] px-4 py-0"
        >
          <span>Home</span>
        </BrutalistButton>
      </div>

      {/* Left side - Yellow Brutalist Block */}
      <div className="hidden md:flex flex-col w-1/2 relative bg-[var(--icon)] border-r-[8px] border-[var(--border)] p-12 lg:p-24 overflow-hidden">
        <div className="relative z-10 flex flex-col h-full justify-center">
          <Link
            href="/"
            className="inline-block mb-8 w-fit hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="DriveNow"
              width={260}
              height={72}
              className="h-16 lg:h-20 w-auto object-contain"
              priority
            />
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
          <div className="md:hidden mb-8 text-center flex justify-center">
            <Link
              href="/"
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="DriveNow"
                width={200}
                height={56}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
