"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Heart, Users, Fuel, Briefcase, Zap, Gauge } from "lucide-react";
import { Vehicle } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: Vehicle;
  featured?: boolean;
}

export function VehicleCard({ vehicle, featured = false }: VehicleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleMouseEnter = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, { scale: 1.05, duration: 0.6, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: "power3.out" });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsFavorite(!isFavorite);
    
    if (heartRef.current) {
      gsap.timeline()
        .to(heartRef.current, { scale: 0.8, duration: 0.1, ease: "power2.inOut" })
        .to(heartRef.current, { scale: 1.1, duration: 0.15, ease: "power2.out" })
        .to(heartRef.current, { scale: 1, duration: 0.1, ease: "power2.inOut" });
    }
  };

  const isAvailable = vehicle.availability === "Available";
  const isElectric = vehicle.fuel === "Electric";

  return (
    <div className="block h-full group">
      <div 
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col h-full bg-[var(--surface-elevated)] rounded-[var(--radius-xl)] border border-[var(--border-color)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:border-transparent"
      >
        {/* Image Section */}
        <Link href={`/cars/${vehicle.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--background)] block">
          <Image
            ref={imageRef as any}
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {featured && (
              <Badge variant="default" className="shadow-sm">Featured</Badge>
            )}
            {isElectric && (
              <Badge variant="success" className="shadow-sm bg-white text-[var(--success)]">Electric</Badge>
            )}
          </div>
          
          <button
            ref={heartRef}
            onClick={toggleFavorite}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[var(--foreground)] transition-colors hover:bg-white shadow-sm"
            aria-label="Toggle favorite"
          >
            <Heart size={20} className={isFavorite ? "fill-[var(--accent)] text-[var(--accent)]" : ""} />
          </button>
        </Link>

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium mb-1">{vehicle.category}</p>
              <Link href={`/cars/${vehicle.id}`}>
                <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight hover:text-[var(--accent)] transition-colors">
                  {vehicle.brand} {vehicle.model}
                </h3>
              </Link>
            </div>
            <div className="flex items-center gap-1 bg-[var(--background)] px-2 py-1 rounded-md">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm font-semibold">{vehicle.rating}</span>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 my-5 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <Users size={16} className="text-[var(--text-muted)]" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <Gauge size={16} className="text-[var(--text-muted)]" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <Briefcase size={16} className="text-[var(--text-muted)]" />
              <span>{vehicle.luggage} Bags</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              {isElectric ? (
                <>
                  <Zap size={16} className="text-[var(--success)]" />
                  <span>{vehicle.range} mi</span>
                </>
              ) : (
                <>
                  <Fuel size={16} className="text-[var(--text-muted)]" />
                  <span>{vehicle.fuel}</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[var(--foreground)]">${vehicle.dailyPrice}</span>
              <span className="text-[var(--text-muted)] text-sm"> / day</span>
            </div>
            
            <Button 
              variant={isAvailable ? "primary" : "secondary"}
              className="px-6 relative overflow-hidden group-hover:scale-105 transition-transform"
              disabled={!isAvailable}
              asChild={isAvailable}
            >
              {isAvailable ? (
                <Link href={`/cars/${vehicle.id}`}>Book Now</Link>
              ) : (
                <span>Unavailable</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
