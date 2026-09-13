"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { MapPin, Calendar, Clock, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchPanel() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Note: In a real implementation this animation might be coordinated by a parent layout.
    // For standalone testing, we can animate it subtly on mount if it's not part of a larger timeline.
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );
    }
  }, []);

  return (
    <div 
      ref={panelRef}
      className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)] border border-[var(--border-color)] max-w-5xl mx-auto w-full relative z-20"
      style={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        {/* Pickup Location */}
        <div className="flex flex-col gap-2">
          <label className="text-[var(--text-label)] flex items-center gap-2">
            <MapPin size={16} className="text-[var(--accent)]" />
            Pick-up location
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="City, airport, or address" 
              className="w-full h-12 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] px-4 text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Drop-off Location */}
        <div className="flex flex-col gap-2">
          <label className="text-[var(--text-label)] flex items-center gap-2">
            <MapPin size={16} className="text-[var(--text-muted)]" />
            Drop-off location
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Same as pick-up" 
              className="w-full h-12 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] px-4 text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-2">
          <label className="text-[var(--text-label)] flex items-center gap-2">
            <Calendar size={16} className="text-[var(--accent)]" />
            Pick-up & Drop-off
          </label>
          <div className="relative flex gap-2 h-12">
            <input 
              type="date" 
              className="w-1/2 h-full bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] px-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            />
            <input 
              type="date" 
              className="w-1/2 h-full bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] px-3 text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            />
          </div>
        </div>

        {/* Search CTA */}
        <div className="flex flex-col gap-2">
          <Button size="lg" className="w-full h-12 flex items-center justify-center gap-2 text-base font-semibold group">
            Search Cars
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
        <p className="text-[var(--text-caption)] flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--success)]"></span>
          Free cancellation on selected vehicles
        </p>
        
        {/* Optional AI Planner hook as requested */}
        <button className="text-[var(--text-caption)] text-[var(--accent)] hover:underline font-medium flex items-center gap-1">
          <Zap size={12} />
          Try AI Trip Planner
        </button>
      </div>
    </div>
  );
}
