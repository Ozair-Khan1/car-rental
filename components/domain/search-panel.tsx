"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";

export function SearchPanel({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError("Please enter a pick-up location.");
      return;
    }
    if (!pickup) {
      setError("Please select a pick-up date.");
      return;
    }
    if (!dropoff) {
      setError("Please select a drop-off date.");
      return;
    }
    if (new Date(dropoff) <= new Date(pickup)) {
      setError("Drop-off date must be after pick-up date.");
      return;
    }
    setError("");
    router.push(
      `/cars?location=${encodeURIComponent(location)}&pickup=${pickup}&dropoff=${dropoff}`,
    );
  };

  if (variant === "compact") {
    return (
      <form
        onSubmit={handleSearch}
        className="card-brutalist flex flex-col gap-6 w-full"
      >
        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-medium text-[var(--text-primary)] opacity-50 uppercase tracking-wider">
            Pick-up location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-wider">
            Pick-up date
          </label>
          <input
            type="date"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="input-field w-full [color-scheme:light]"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-wider">
            Drop-off date
          </label>
          <input
            type="date"
            value={dropoff}
            className="input-field w-full [color-scheme:light]"
          />
        </div>

        {error && <div className="text-[13px] text-red-600 mt-1">{error}</div>}

        <BrutalistButton
          type="submit"
          containerClassName="w-full mt-4"
        >
          <span>Search cars</span>
          <ArrowRight size={20} />
        </BrutalistButton>

        <div className="text-center mt-4">
          <button
            type="button"
            className="text-[14px] text-[var(--text-primary)] hover:underline transition-all focus-visible:outline-[var(--text-primary)]"
          >
            Return to a different location
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="w-full relative z-20 flex flex-col gap-6">
      <form
        onSubmit={handleSearch}
        className="card-brutalist flex flex-col lg:flex-row gap-6 items-end"
      >
        {/* Pick-up Location */}
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-wider">
            Pick-up location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, airport or address"
            className="input-field w-full"
          />
        </div>

        {/* Pick-up Date */}
        <div className="w-full lg:w-48 flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-wider">
            Pick-up date
          </label>
          <input
            type="date"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="input-field w-full [color-scheme:light]"
          />
        </div>

        {/* Drop-off Date */}
        <div className="w-full lg:w-48 flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-wider">
            Drop-off date
          </label>
          <input
            type="date"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="input-field w-full [color-scheme:light]"
          />
        </div>

        {/* Search Button */}
        <div className="w-full lg:w-auto h-full flex items-end">
          <BrutalistButton
            type="submit"
            containerClassName="w-full lg:w-[180px]"
            className="h-[56px] px-6 py-0"
          >
            <span>Search</span>
            <ArrowRight size={20} />
          </BrutalistButton>
        </div>
      </form>

      {error && <div className="text-[13px] text-red-600 px-2">{error}</div>}

      {/* Trust Line & Return location checkbox */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 pt-2">
        <div className="text-[14px] text-[var(--text-primary)] font-medium">
          Free cancellation &middot; No hidden fees
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="w-5 h-5 border-2 border-[var(--border)] bg-[var(--surface)] flex items-center justify-center group-hover:bg-[var(--text-primary)] transition-colors">
            {/* Checked state placeholder */}
          </div>
          <span className="text-[14px] font-medium select-none text-[var(--text-primary)] transition-colors">
            Return to a different location
          </span>
        </label>
      </div>
    </div>
  );
}
