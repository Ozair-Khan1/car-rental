"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";
import { VehicleCard } from "@/components/domain/vehicle-card";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { mockVehicles } from "@/lib/mock-data";

const CATEGORIES = ["All", "Economy", "Sedan", "SUV", "Luxury", "Sports", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

export default function CarsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTransmission, setActiveTransmission] = useState<string[]>([]);
  const [activeFuel, setActiveFuel] = useState<string[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  
  const lastScrollY = useRef(0);

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
  }, [activeCategory, activeTransmission, activeFuel]);

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
    <div className="pt-24 pb-20 min-h-screen bg-[var(--background)] flex flex-col font-sans">
      {/* Header / Top Search */}
      <div 
        className={`bg-[var(--surface)] border-b-2 border-[var(--border)] py-8 sticky top-[72px] z-30 transition-transform duration-300 ${isNavbarHidden ? "-translate-y-[72px]" : "translate-y-0"}`}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[var(--text-primary)] mb-2">
                FLEET
              </h1>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-70">
                {filteredVehicles.length} vehicles available
              </p>
            </div>
            
            <div className="w-full md:w-auto flex gap-4">
              <div className="relative flex-grow md:flex-grow-0 md:min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] opacity-50" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH BRAND OR MODEL"
                  className="input-field w-full pl-12 h-[52px]"
                />
              </div>
              <button 
                className="md:hidden flex-shrink-0 h-[52px] px-6 border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-[1200px] py-12 flex-1 flex flex-col md:flex-row gap-12">
        
        {/* Desktop Sidebar Filters */}
        <aside className={`md:block w-full md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>
          <div className={`md:sticky md:top-[200px] transition-transform duration-300 ${isNavbarHidden ? "md:-translate-y-[72px]" : "md:translate-y-0"}`}>
            
            {/* Categories */}
            <div className="mb-10">
              <h4 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-widest mb-6">Type</h4>
              <div className="flex flex-col gap-3">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center justify-between text-left px-4 py-3 border-2 transition-all font-bold uppercase tracking-widest text-sm ${
                      activeCategory === category 
                        ? 'border-[var(--border)] bg-[var(--text-primary)] text-[var(--background)] shadow-[4px_4px_0px_0px_var(--shadow-color)]' 
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--background)]'
                    }`}
                  >
                    {category}
                    {activeCategory === category && <Check size={18} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mb-10">
              <h4 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-widest mb-6 border-t-2 border-[var(--border)] pt-8">Transmission</h4>
              <div className="flex flex-col gap-4">
                {TRANSMISSIONS.map(trans => (
                  <label key={trans} className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${
                      activeTransmission.includes(trans) 
                        ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--background)]' 
                        : 'border-[var(--border)] bg-[var(--surface)] group-hover:border-[var(--text-primary)] text-transparent'
                    }`}>
                      <Check size={16} strokeWidth={4} />
                    </div>
                    <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-sm">{trans}</span>
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
            <div className="mb-10">
              <h4 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-widest mb-6 border-t-2 border-[var(--border)] pt-8">Fuel</h4>
              <div className="flex flex-col gap-4">
                {FUEL_TYPES.map(fuel => (
                  <label key={fuel} className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${
                      activeFuel.includes(fuel) 
                        ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--background)]' 
                        : 'border-[var(--border)] bg-[var(--surface)] group-hover:border-[var(--text-primary)] text-transparent'
                    }`}>
                      <Check size={16} strokeWidth={4} />
                    </div>
                    <span className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-sm">{fuel}</span>
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
            <div className="h-full flex flex-col items-center justify-center text-center p-12 card-brutalist bg-[var(--surface)]">
              <div className="w-20 h-20 border-4 border-[var(--border)] rounded-full flex items-center justify-center mb-6 text-[var(--text-primary)]">
                <Search size={32} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-4">NO VEHICLES FOUND</h3>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-70 mb-8 max-w-md">
                We couldn't find any cars matching your current filters. Try adjusting them or clearing all filters.
              </p>
              <BrutalistButton 
                onClick={() => { setActiveCategory("All"); setActiveTransmission([]); setActiveFuel([]); }}
              >
                <span>Clear Filters</span>
              </BrutalistButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredVehicles.map(vehicle => (
                <div key={vehicle.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
