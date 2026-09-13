import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 text-white md:text-[var(--text-secondary)] md:hover:text-[var(--foreground)] transition-colors bg-black/20 md:bg-transparent backdrop-blur-md md:backdrop-blur-none px-3 py-2 rounded-full text-sm font-medium">
          <ChevronLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Left side - Image / Branding (Hidden on mobile) */}
      <div className="hidden md:flex flex-col w-1/2 relative bg-[var(--foreground)] text-[var(--background)]">
        <Image
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1600&auto=format&fit=crop"
          alt="Premium luxury car"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)] via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-24 z-10">
          <Link href="/" className="text-3xl font-bold tracking-tight mb-6">
            DriveNow
          </Link>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
            The premium standard in mobility.
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-md">
            Join thousands of hosts and renters experiencing a smarter way to get where they're going.
          </p>
        </div>
      </div>

      {/* Right side - Form Container */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-[var(--background)] relative">
        {/* Mobile Background Image (Only visible on small screens) */}
        <div className="md:hidden absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1000&auto=format&fit=crop"
            alt="Premium luxury car"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-[var(--background)]/40" />
        </div>
        
        <div className="w-full max-w-md relative z-10 bg-[var(--surface)] md:bg-transparent p-8 md:p-0 rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)] md:shadow-none border border-[var(--border-color)] md:border-none">
          {/* Mobile Logo */}
          <div className="md:hidden mb-8 text-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              DriveNow
            </Link>
          </div>
          
          {children}
        </div>
      </div>
      
    </div>
  );
}
