"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { DatePicker } from "@/components/ui/date-picker";

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
        className="card-brutalist flex flex-col gap-5 w-full"
      >
        <div className="flex flex-col gap-2 relative">
          <label className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 relative">
            <label className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Pick-up date
            </label>
            <DatePicker value={pickup} onChange={setPickup} />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Drop-off date
            </label>
            <DatePicker
              value={dropoff}
              onChange={setDropoff}
              minDate={pickup || undefined}
            />
          </div>
        </div>

        {error && <div className="text-[13px] text-red-600 mt-1">{error}</div>}

        <BrutalistButton
          type="submit"
          containerClassName="w-full mt-2"
          className="py-4 text-sm"
        >
          <span>Search cars</span>
          <ArrowRight size={20} />
        </BrutalistButton>
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
          <label className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
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
          <label className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Pick-up date
          </label>
          <DatePicker value={pickup} onChange={setPickup} />
        </div>

        {/* Drop-off Date */}
        <div className="w-full lg:w-48 flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Drop-off date
          </label>
          <DatePicker
            value={dropoff}
            onChange={setDropoff}
            minDate={pickup || undefined}
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

      {/* How it works — 3-step visual flow */}
      <div className="flex items-center justify-center w-full gap-0 pt-4 pb-1">
        {/* Step 1 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--btn-primary-bg)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--shadow-color)]">
            <span className="text-[13px] font-bold text-black">1</span>
          </div>
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-primary)] hidden sm:inline">
            Choose a location
          </span>
          <span className="text-[13px] font-semibold text-[var(--text-primary)] sm:hidden">
            Location
          </span>
        </div>

        {/* Connector */}
        <div className="flex-1 max-w-[60px] h-[2px] bg-[var(--border)] mx-3" />

        {/* Step 2 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--btn-primary-bg)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--shadow-color)]">
            <span className="text-[13px] font-bold text-black">2</span>
          </div>
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-primary)] hidden sm:inline">
            Pick-up date
          </span>
          <span className="text-[13px] font-semibold text-[var(--text-primary)] sm:hidden">
            Pick-up
          </span>
        </div>

        {/* Connector */}
        <div className="flex-1 max-w-[60px] h-[2px] bg-[var(--border)] mx-3" />

        {/* Step 3 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--btn-primary-bg)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--shadow-color)]">
            <span className="text-[13px] font-bold text-black">3</span>
          </div>
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-primary)] hidden sm:inline">
            Drop-off date
          </span>
          <span className="text-[13px] font-semibold text-[var(--text-primary)] sm:hidden">
            Drop-off
          </span>
        </div>
      </div>
    </div>
  );
}
