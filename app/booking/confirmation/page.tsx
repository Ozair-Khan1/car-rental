"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { CheckCircle, Calendar, MapPin, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      gsap.set(containerRef.current, { opacity: 0, y: 20 });
      gsap.set(iconRef.current, { scale: 0, opacity: 0 });

      tl.to(iconRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.2 })
        .to(containerRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div ref={iconRef} className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--success)]/10 text-[var(--success)] mb-6">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-display text-4xl md:text-5xl mb-4">You're all set.</h1>
          <p className="text-lg text-[var(--text-secondary)]">Your reservation has been confirmed. Booking #DN-849204</p>
        </div>

        <div ref={containerRef} className="bg-[var(--surface-elevated)] rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)] border border-[var(--border-color)] overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border-color)]">
              <div>
                <h3 className="font-bold text-xl mb-1">BMW X5</h3>
                <p className="text-[var(--text-secondary)] text-sm">Luxury SUV • Automatic</p>
              </div>
              <div className="text-right">
                <p className="text-[var(--text-muted)] text-sm mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">$591</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--background)] flex items-center justify-center flex-shrink-0 text-[var(--text-muted)] border border-[var(--border-color)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)] mb-1">San Francisco Int. Airport (SFO)</p>
                  <p className="text-sm text-[var(--text-secondary)]">Terminal 2, Car Rental Center</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--background)] flex items-center justify-center flex-shrink-0 text-[var(--text-muted)] border border-[var(--border-color)]">
                  <Calendar size={18} />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-1">Pick-up</p>
                    <p className="font-semibold">Oct 24, 10:00 AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] mb-1">Drop-off</p>
                    <p className="font-semibold">Oct 27, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--background)] p-6 flex flex-col sm:flex-row gap-4 border-t border-[var(--border-color)]">
            <Button className="flex-1" asChild>
              <Link href="/dashboard">View in Dashboard</Link>
            </Button>
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <Download size={16} /> Download Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
