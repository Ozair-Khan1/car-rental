"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { DatePicker } from "@/components/ui/date-picker";

export function SearchPanel({
  variant = "hero",
  initialLocation = "",
  initialPickup = "",
  initialDropoff = "",
  onSearchSubmit,
}: {
  variant?: "hero" | "compact" | "bar";
  initialLocation?: string;
  initialPickup?: string;
  initialDropoff?: string;
  onSearchSubmit?: (params: {
    location: string;
    pickup: string;
    dropoff: string;
  }) => void;
}) {
  const router = useRouter();

  const [location, setLocation] = useState(initialLocation);
  const [pickup, setPickup] = useState(initialPickup);
  const [dropoff, setDropoff] = useState(initialDropoff);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (initialLocation !== undefined) setLocation(initialLocation);
  }, [initialLocation]);

  React.useEffect(() => {
    if (initialPickup !== undefined) setPickup(initialPickup);
  }, [initialPickup]);

  React.useEffect(() => {
    if (initialDropoff !== undefined) setDropoff(initialDropoff);
  }, [initialDropoff]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (variant !== "bar") {
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
    }

    if (pickup && dropoff && new Date(dropoff) <= new Date(pickup)) {
      setError("Drop-off date must be after pick-up date.");
      return;
    }

    setError("");

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (pickup) params.set("pickup", pickup);
    if (dropoff) params.set("dropoff", dropoff);

    const queryString = params.toString();
    const targetUrl = `/cars${queryString ? `?${queryString}` : ""}`;

    router.push(targetUrl);
    if (onSearchSubmit) {
      onSearchSubmit({ location, pickup, dropoff });
    }
  };

  if (variant === "bar") {
    return (
      <div className="w-full bg-[var(--card)] border-2 border-[var(--border)] shadow-[6px_6px_0px_0px_var(--shadow)] p-4 md:p-5">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 items-stretch md:items-end w-full"
        >
          {/* Pick-up location */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-[200px]">
            <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
              Pick-up location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, airport or address"
              className="w-full h-[52px] px-4 bg-[var(--card)] border-2 border-[var(--border)] text-[var(--card-ink)] font-semibold placeholder:text-[var(--muted)] placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Pick-up date */}
          <div className="w-full md:w-[200px] lg:w-[230px] flex flex-col gap-1.5 shrink-0">
            <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
              Pick-up date
            </label>
            <DatePicker value={pickup} onChange={setPickup} />
          </div>

          {/* Drop-off date */}
          <div className="w-full md:w-[200px] lg:w-[230px] flex flex-col gap-1.5 shrink-0">
            <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
              Drop-off date
            </label>
            <DatePicker
              value={dropoff}
              onChange={setDropoff}
              minDate={pickup || undefined}
            />
          </div>

          {/* Yellow SEARCH button */}
          <div className="w-full md:w-auto shrink-0 flex items-end">
            <BrutalistButton
              type="submit"
              variant="primary"
              containerClassName="w-full md:w-[150px]"
              className="h-[52px] px-6 text-sm font-black"
            >
              <span>Search</span>
              <ArrowRight size={18} />
            </BrutalistButton>
          </div>
        </form>
        {error && (
          <div className="text-[14px] font-bold text-red-500 mt-2 px-1">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form
        onSubmit={handleSearch}
        className="card-brutalist flex flex-col gap-5 w-full"
      >
        <div className="flex flex-col gap-2 relative">
          <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
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
            <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
              Pick-up date
            </label>
            <DatePicker value={pickup} onChange={setPickup} />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
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
          <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
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
          <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
            Pick-up date
          </label>
          <DatePicker value={pickup} onChange={setPickup} />
        </div>

        {/* Drop-off Date */}
        <div className="w-full lg:w-48 flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider">
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

      {error && <div className="text-[14px] text-red-500 px-2">{error}</div>}

      {/* How it works — 3-step visual flow */}
      <div className="flex items-center justify-center w-full gap-0 pt-4 pb-1">
        {/* Step 1 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--accent)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--shadow)]">
            <span className="text-[14px] font-bold text-[var(--on-accent)]">1</span>
          </div>
          <span className="text-[14px] font-semibold uppercase tracking-wider text-[var(--muted)] hidden sm:inline">
            Choose a location
          </span>
          <span className="text-[14px] font-semibold text-[var(--muted)] sm:hidden">
            Location
          </span>
        </div>

        {/* Connector */}
        <div className="flex-1 max-w-[60px] h-[2px] bg-[var(--border)] mx-3" />

        {/* Step 2 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--accent)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--shadow)]">
            <span className="text-[14px] font-bold text-[var(--on-accent)]">2</span>
          </div>
          <span className="text-[14px] font-semibold uppercase tracking-wider text-[var(--muted)] hidden sm:inline">
            Pick-up date
          </span>
          <span className="text-[14px] font-semibold text-[var(--muted)] sm:hidden">
            Pick-up
          </span>
        </div>

        {/* Connector */}
        <div className="flex-1 max-w-[60px] h-[2px] bg-[var(--border)] mx-3" />

        {/* Step 3 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--border)] bg-[var(--accent)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--shadow)]">
            <span className="text-[14px] font-bold text-[var(--on-accent)]">3</span>
          </div>
          <span className="text-[14px] font-semibold uppercase tracking-wider text-[var(--muted)] hidden sm:inline">
            Drop-off date
          </span>
          <span className="text-[14px] font-semibold text-[var(--muted)] sm:hidden">
            Drop-off
          </span>
        </div>
      </div>
    </div>
  );
}
