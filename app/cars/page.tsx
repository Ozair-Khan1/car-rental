"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Check, X } from "lucide-react";
import { VehicleCard } from "@/components/domain/vehicle-card";
import { SearchPanel } from "@/components/domain/search-panel";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { mockVehicles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Economy",
  "Sedan",
  "SUV",
  "Luxury",
  "Sports",
  "Electric",
];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

function calculateRentalDays(pickupStr: string, dropoffStr: string): number {
  if (!pickupStr || !dropoffStr) return 0;
  const p = new Date(pickupStr + "T00:00:00");
  const d = new Date(dropoffStr + "T00:00:00");
  if (isNaN(p.getTime()) || isNaN(d.getTime())) return 0;
  const diff = d.getTime() - p.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function CarsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial values from URL query parameters
  const initialLocation = searchParams.get("location") || "";
  const initialPickup = searchParams.get("pickup") || "";
  const initialDropoff = searchParams.get("dropoff") || "";

  const [pickupDate, setPickupDate] = useState(initialPickup);
  const [dropoffDate, setDropoffDate] = useState(initialDropoff);
  const [searchLocation, setSearchLocation] = useState(initialLocation);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTransmission, setActiveTransmission] = useState<string[]>([]);
  const [activeFuel, setActiveFuel] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<"low-to-high" | "high-to-low">(
    "low-to-high",
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state if URL query params change externally
  useEffect(() => {
    setPickupDate(searchParams.get("pickup") || "");
    setDropoffDate(searchParams.get("dropoff") || "");
    setSearchLocation(searchParams.get("location") || "");
  }, [searchParams]);

  const rentalDays = useMemo(
    () => calculateRentalDays(pickupDate, dropoffDate),
    [pickupDate, dropoffDate],
  );

  const toggleFilter = (
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    value: string,
  ) => {
    if (current.includes(value)) {
      setFn(current.filter((item) => item !== value));
    } else {
      setFn([...current, value]);
    }
  };

  const clearAllFilters = () => {
    setActiveCategory("All");
    setActiveTransmission([]);
    setActiveFuel([]);
    setMaxPrice(300);
    setSearchQuery("");
  };

  const isFilterActive =
    activeCategory !== "All" ||
    activeTransmission.length > 0 ||
    activeFuel.length > 0 ||
    maxPrice < 300 ||
    searchQuery.trim() !== "";

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let result = [...mockVehicles];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter(
        (v) =>
          v.category === activeCategory ||
          (activeCategory === "Electric" && v.fuel === "Electric"),
      );
    }

    // Transmission filter
    if (activeTransmission.length > 0) {
      result = result.filter((v) => activeTransmission.includes(v.transmission));
    }

    // Fuel filter
    if (activeFuel.length > 0) {
      result = result.filter((v) => activeFuel.includes(v.fuel));
    }

    // Price range filter
    result = result.filter((v) => v.dailyPrice <= maxPrice);

    // Sorting
    result.sort((a, b) =>
      sortBy === "low-to-high"
        ? a.dailyPrice - b.dailyPrice
        : b.dailyPrice - a.dailyPrice,
    );

    return result;
  }, [
    searchQuery,
    activeCategory,
    activeTransmission,
    activeFuel,
    maxPrice,
    sortBy,
  ]);

  // Active filter chips list
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    if (activeCategory !== "All") {
      chips.push({
        id: "cat",
        label: `TYPE: ${activeCategory}`,
        onRemove: () => setActiveCategory("All"),
      });
    }

    activeTransmission.forEach((trans) => {
      chips.push({
        id: `trans-${trans}`,
        label: trans,
        onRemove: () =>
          setActiveTransmission((prev) => prev.filter((item) => item !== trans)),
      });
    });

    activeFuel.forEach((fuel) => {
      chips.push({
        id: `fuel-${fuel}`,
        label: fuel,
        onRemove: () =>
          setActiveFuel((prev) => prev.filter((item) => item !== fuel)),
      });
    });

    if (maxPrice < 300) {
      chips.push({
        id: "price",
        label: `≤ $${maxPrice}/DAY`,
        onRemove: () => setMaxPrice(300),
      });
    }

    if (searchQuery.trim()) {
      chips.push({
        id: "search",
        label: `"${searchQuery.trim()}"`,
        onRemove: () => setSearchQuery(""),
      });
    }

    return chips;
  }, [activeCategory, activeTransmission, activeFuel, maxPrice, searchQuery]);

  const handleDateBarSubmit = ({
    location,
    pickup,
    dropoff,
  }: {
    location: string;
    pickup: string;
    dropoff: string;
  }) => {
    setSearchLocation(location);
    setPickupDate(pickup);
    setDropoffDate(dropoff);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen flex flex-col font-sans relative selection:bg-[var(--text-primary)] selection:text-[var(--background)] overflow-x-hidden">
      {/* Container aligned with navbar, header, datebar, cards and footer (max-width 1200px, px-4 md:px-6, centered) */}
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 flex flex-col gap-8">
        {/* 1. PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pt-4">
          <div className="flex flex-col">
            <h1 className="font-display font-normal text-[clamp(56px,7vw,96px)] leading-[0.95] tracking-normal uppercase text-black m-0 p-0">
              FLEET
            </h1>
            {/* 12px space between FLEET and subtitle line */}
            <p className="text-[14px] font-bold uppercase tracking-widest text-black opacity-70 mt-3 m-0 leading-none">
              {filteredVehicles.length} vehicles available
            </p>
          </div>

          {/* Search field aligned to bottom of the subtitle line */}
          <div className="w-full md:w-[320px] lg:w-[360px] relative flex gap-3 self-end md:self-auto">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black opacity-60"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand or model..."
                className="w-full pl-11 pr-4 h-[52px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] text-[16px] text-black font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#E8B42A]"
              />
            </div>
            <button
              type="button"
              className="md:hidden shrink-0 h-[52px] px-5 border-2 border-black bg-white text-black font-bold uppercase shadow-[4px_4px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* 2. DATE BAR */}
        <SearchPanel
          variant="bar"
          initialLocation={searchLocation}
          initialPickup={pickupDate}
          initialDropoff={dropoffDate}
          onSearchSubmit={handleDateBarSubmit}
        />

        {/* 3. MAIN SECTION: SIDEBAR + GRID */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 items-start pt-2">
          {/* SIDEBAR FILTERS (Sticky top: 112px if fits in viewport, self-start, no inner scrollbar) */}
          <aside
            className={cn(
              "w-full md:w-64 lg:w-72 shrink-0 self-start [@media(min-height:720px)]:md:sticky [@media(min-height:720px)]:md:top-[112px]",
              isMobileFiltersOpen ? "block" : "hidden md:block",
            )}
          >
            <div>
              {/* Heading FILTERS (display font, weight 400, 22px, uppercase, black) + CLEAR ALL */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-normal text-[22px] uppercase text-black m-0 leading-none tracking-normal">
                  Filters
                </h2>
                {isFilterActive && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[12px] font-black uppercase tracking-wider text-black underline hover:text-[#E8B42A] transition-colors"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {/* GROUP 1: TYPE (compact 2 columns, 8px gap, 40px tall boxes, 14px text, ALL spanning full width) */}
              <div>
                <h3 className="font-display font-normal text-[22px] uppercase text-black m-0 mb-4 leading-none tracking-normal">
                  Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category;
                    const isAll = category === "All";
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          "h-[40px] px-3 flex items-center justify-between text-left border-2 border-black font-bold uppercase text-[14px] tracking-wider transition-all select-none shadow-[2px_2px_0px_0px_#000000]",
                          isAll ? "col-span-2" : "col-span-1",
                          isActive
                            ? "bg-black text-[#F4F2EC]"
                            : "bg-white text-black hover:bg-[#E8B42A] hover:text-black",
                        )}
                      >
                        <span>{category}</span>
                        {isActive && (
                          <Check
                            size={16}
                            strokeWidth={3}
                            className="shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2px black divider with 24px spacing */}
              <div className="w-full h-[2px] bg-black my-6" />

              {/* GROUP 2: TRANSMISSION */}
              <div>
                <h3 className="font-display font-normal text-[22px] uppercase text-black m-0 mb-4 leading-none tracking-normal">
                  Transmission
                </h3>
                <div className="flex flex-col gap-3">
                  {TRANSMISSIONS.map((trans) => {
                    const isChecked = activeTransmission.includes(trans);
                    return (
                      <label
                        key={trans}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                      >
                        <div
                          className={cn(
                            "w-[22px] h-[22px] border-2 border-black flex items-center justify-center transition-colors shrink-0",
                            isChecked
                              ? "bg-[#E8B42A] text-black"
                              : "bg-white text-transparent group-hover:border-black",
                          )}
                        >
                          {isChecked && (
                            <Check
                              size={15}
                              strokeWidth={3.5}
                              className="text-black"
                            />
                          )}
                        </div>
                        <span className="text-[15px] font-bold uppercase tracking-wider text-black">
                          {trans}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() =>
                            toggleFilter(
                              setActiveTransmission,
                              activeTransmission,
                              trans,
                            )
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2px black divider with 24px spacing */}
              <div className="w-full h-[2px] bg-black my-6" />

              {/* GROUP 3: FUEL */}
              <div>
                <h3 className="font-display font-normal text-[22px] uppercase text-black m-0 mb-4 leading-none tracking-normal">
                  Fuel
                </h3>
                <div className="flex flex-col gap-3">
                  {FUEL_TYPES.map((fuel) => {
                    const isChecked = activeFuel.includes(fuel);
                    return (
                      <label
                        key={fuel}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                      >
                        <div
                          className={cn(
                            "w-[22px] h-[22px] border-2 border-black flex items-center justify-center transition-colors shrink-0",
                            isChecked
                              ? "bg-[#E8B42A] text-black"
                              : "bg-white text-transparent group-hover:border-black",
                          )}
                        >
                          {isChecked && (
                            <Check
                              size={15}
                              strokeWidth={3.5}
                              className="text-black"
                            />
                          )}
                        </div>
                        <span className="text-[15px] font-bold uppercase tracking-wider text-black">
                          {fuel}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() =>
                            toggleFilter(setActiveFuel, activeFuel, fuel)
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2px black divider with 24px spacing */}
              <div className="w-full h-[2px] bg-black my-6" />

              {/* GROUP 4: PRICE */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-normal text-[22px] uppercase text-black m-0 leading-none tracking-normal">
                    Price
                  </h3>
                  <span className="text-[13px] font-bold text-black uppercase tracking-wider">
                    ≤ ${maxPrice}/day
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={300}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer h-2 bg-neutral-200 border border-black rounded-none"
                />
                <div className="flex justify-between text-xs font-bold text-neutral-600 mt-2">
                  <span>$60</span>
                  <span>$300</span>
                </div>
              </div>
            </div>
          </aside>

          {/* VEHICLE CONTENT AREA */}
          <div className="flex-1 w-full min-h-[500px]">
            {/* 4. TOOLBAR ABOVE THE GRID */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 min-h-[34px]">
                {activeChips.map((chip) => (
                  <div
                    key={chip.id}
                    className="inline-flex items-center gap-2 bg-white border-2 border-black px-3 py-1 text-[14px] font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <span>{chip.label}</span>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      aria-label={`Remove filter ${chip.label}`}
                      className="hover:text-[#E8B42A] transition-colors p-0.5"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sort Segmented Control (active = black, no native select) */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <div className="inline-flex border-2 border-black shadow-[2px_2px_0px_0px_#000000] bg-white">
                  <button
                    type="button"
                    onClick={() => setSortBy("low-to-high")}
                    className={cn(
                      "px-3 py-2 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider transition-colors border-r-2 border-black",
                      sortBy === "low-to-high"
                        ? "bg-black text-[#F4F2EC]"
                        : "bg-white text-black hover:bg-neutral-100",
                    )}
                  >
                    PRICE: LOW TO HIGH
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy("high-to-low")}
                    className={cn(
                      "px-3 py-2 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider transition-colors",
                      sortBy === "high-to-low"
                        ? "bg-black text-[#F4F2EC]"
                        : "bg-white text-black hover:bg-neutral-100",
                    )}
                  >
                    PRICE: HIGH TO LOW
                  </button>
                </div>
              </div>
            </div>

            {/* 5. VEHICLE CARDS GRID: 2 columns on desktop (3 only if card area >= 1080px), 1 on mobile */}
            {filteredVehicles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 card-brutalist bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
                <div className="w-16 h-16 border-2 border-black bg-[#E8B42A] flex items-center justify-center mb-6 text-black shadow-[3px_3px_0px_0px_#000000]">
                  <Search size={28} strokeWidth={3} />
                </div>
                <h3 className="font-display font-normal text-3xl uppercase tracking-normal text-black mb-3">
                  NO VEHICLES FOUND
                </h3>
                <p className="text-sm font-medium text-black opacity-70 mb-8 max-w-md">
                  We couldn't find any cars matching your current filters. Try
                  adjusting them or clearing all filters.
                </p>
                <BrutalistButton onClick={clearAllFilters}>
                  <span>Clear All Filters</span>
                </BrutalistButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:[grid-template-columns:repeat(auto-fill,minmax(360px,1fr))] items-stretch gap-6 md:gap-8">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    rentalDays={rentalDays}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 text-center font-display text-2xl uppercase">
          Loading fleet...
        </div>
      }
    >
      <CarsContent />
    </Suspense>
  );
}
