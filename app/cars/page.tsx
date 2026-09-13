"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/domain/vehicle-card";
import { mockVehicles, VehicleCategory, Transmission, FuelType } from "@/lib/mock-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

const CATEGORIES = ["All", "Economy", "Sedan", "SUV", "Luxury", "Sports", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

export default function CarsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTransmission, setActiveTransmission] = useState<string[]>([]);
  const [activeFuel, setActiveFuel] = useState<string[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter logic
    let result = mockVehicles;

    if (activeCategory !== "All") {
      result = result.filter(v => v.category === activeCategory || (activeCategory === "Electric" && v.fuel === "Electric"));
    }

    if (activeTransmission.length > 0) {
      result = result.filter(v => activeTransmission.includes(v.transmission));
    }

    if (activeFuel.length > 0) {
      result = result.filter(v => activeFuel.includes(v.fuel));
    }

    setFilteredVehicles(result);

    // Simple, safe fade-in animation for filtered results
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", clearProps: "all" }
        );
      }
    });

    return () => ctx.revert();
  }, [activeCategory, activeTransmission, activeFuel]);

  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsNavbarHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavbarHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFilter = (setFn: React.Dispatch<React.SetStateAction<string[]>>, current: string[], value: string) => {
    if (current.includes(value)) {
      setFn(current.filter(item => item !== value));
    } else {
      setFn([...current, value]);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header / Top Search */}
      <div className={`bg-[var(--surface-elevated)] border-b border-[var(--border-color)] py-8 sticky top-[72px] z-30 transition-transform duration-300 ${isNavbarHidden ? "-translate-y-[72px]" : "translate-y-0"}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-h2">Find your perfect car</h1>
              <p className="text-[var(--text-secondary)]">{filteredVehicles.length} vehicles available</p>
            </div>
            
            <div className="w-full md:w-auto flex gap-4">
              <div className="relative flex-grow md:flex-grow-0 md:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by brand or model"
                  className="w-full h-11 pl-10 pr-4 bg-[var(--background)] border border-[var(--border-color)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <Button 
                variant="outline" 
                className="md:hidden flex-shrink-0"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className={`sticky top-[200px] transition-transform duration-300 ${isNavbarHidden ? "-translate-y-[72px]" : "translate-y-0"}`}>
            <h3 className="text-lg font-bold mb-6">Filters</h3>
            
            {/* Categories */}
            <div className="mb-8">
              <h4 className="font-semibold text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4">Vehicle Type</h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-md transition-colors ${activeCategory === category ? 'bg-[var(--accent)] text-white font-medium' : 'hover:bg-[var(--surface-elevated)] text-[var(--foreground)]'}`}
                  >
                    {category}
                    {activeCategory === category && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mb-8 border-t border-[var(--border-color)] pt-6">
              <h4 className="font-semibold text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4">Transmission</h4>
              <div className="flex flex-col gap-3">
                {TRANSMISSIONS.map(trans => (
                  <label key={trans} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeTransmission.includes(trans) ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border-color)] bg-[var(--background)] group-hover:border-[var(--accent)]'}`}>
                      {activeTransmission.includes(trans) && <Check size={14} />}
                    </div>
                    <span className="text-[var(--text-primary)]">{trans}</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={activeTransmission.includes(trans)}
                      onChange={() => toggleFilter(setActiveTransmission, activeTransmission, trans)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="mb-8 border-t border-[var(--border-color)] pt-6">
              <h4 className="font-semibold text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4">Fuel Type</h4>
              <div className="flex flex-col gap-3">
                {FUEL_TYPES.map(fuel => (
                  <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeFuel.includes(fuel) ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--border-color)] bg-[var(--background)] group-hover:border-[var(--accent)]'}`}>
                      {activeFuel.includes(fuel) && <Check size={14} />}
                    </div>
                    <span className="text-[var(--text-primary)]">{fuel}</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={activeFuel.includes(fuel)}
                      onChange={() => toggleFilter(setActiveFuel, activeFuel, fuel)}
                    />
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Vehicle Grid */}
        <div className="flex-1 min-h-[500px]">
          {filteredVehicles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-[var(--surface-elevated)] rounded-[var(--radius-xl)] border border-[var(--border-color)]">
              <div className="w-16 h-16 bg-[var(--background)] rounded-full flex items-center justify-center mb-4 text-[var(--text-muted)]">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md">
                We couldn't find any cars matching your current filters. Try adjusting them or clearing all filters.
              </p>
              <Button onClick={() => { setActiveCategory("All"); setActiveTransmission([]); setActiveFuel([]); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" ref={gridRef}>
              {filteredVehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-card-item">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Note: Mobile filters drawer UI omitted for brevity, but would be managed by isMobileFiltersOpen state */}
    </div>
  );
}
