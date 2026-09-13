"use client";

import React from "react";
import Link from "next/link";
import { Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on auth routes
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <footer className="bg-[var(--surface-elevated)] border-t border-[var(--border-color)] pt-16 pb-8 text-[var(--foreground)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tight mb-6">
              DriveNow
            </Link>
            <p className="text-[var(--text-secondary)] text-sm max-w-sm mb-6 leading-relaxed">
              Premium vehicles, flexible rentals, and a smarter way to get where you're going. Experience the future of mobility today.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"><Mail size={20} /></a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"><Phone size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <li><Link href="/about" className="hover:text-[var(--foreground)] transition-colors">About</Link></li>
              <li><Link href="/careers" className="hover:text-[var(--foreground)] transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-[var(--foreground)] transition-colors">Press</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Rentals</h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <li><Link href="/cars" className="hover:text-[var(--foreground)] transition-colors">Browse Cars</Link></li>
              <li><Link href="/locations" className="hover:text-[var(--foreground)] transition-colors">Locations</Link></li>
              <li><Link href="/deals" className="hover:text-[var(--foreground)] transition-colors">Deals</Link></li>
              <li><Link href="/long-term" className="hover:text-[var(--foreground)] transition-colors">Long-Term Rentals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <li><Link href="/help" className="hover:text-[var(--foreground)] transition-colors">Help Center</Link></li>
              <li><Link href="/cancellation" className="hover:text-[var(--foreground)] transition-colors">Cancellation</Link></li>
              <li><Link href="/insurance" className="hover:text-[var(--foreground)] transition-colors">Insurance</Link></li>
              <li><Link href="/contact-support" className="hover:text-[var(--foreground)] transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-6">
            <span>&copy; {new Date().getFullYear()} DriveNow. All rights reserved.</span>
            <div className="hidden md:flex gap-4">
              <Link href="/legal/terms" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
              <Link href="/legal/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
              <Link href="/legal/cookies" className="hover:text-[var(--foreground)] transition-colors">Cookies</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 hover:text-[var(--foreground)] transition-colors">
              <Globe size={16} />
              <span>English (US)</span>
            </button>
            <button className="hover:text-[var(--foreground)] transition-colors">
              <span>$ USD</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
