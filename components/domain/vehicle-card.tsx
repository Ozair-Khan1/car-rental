"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Vehicle } from "@/lib/mock-data";
import { BrutalistButton } from "@/components/ui/brutalist-button";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="card-brutalist flex flex-col p-0 overflow-hidden h-full">
      <Link
        href={`/cars/${vehicle.id}`}
        className="w-full h-[220px] relative border-b-2 border-[var(--border)] block group overflow-hidden"
      >
        <Image
          src={vehicle.images[0] || ""}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {vehicle.fuel === "Electric" && (
            <div className="bg-[#e8b430] border-2 border-[var(--border)] text-black text-xs font-bold uppercase tracking-widest px-3 py-1 shadow-[2px_2px_0px_0px_var(--shadow-color)]">
              Electric
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-2">
          {vehicle.category}
        </p>
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-4">
          {vehicle.brand} {vehicle.model}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-80 mb-6">
          <span>{vehicle.seats} Seats</span>
          <span className="w-1 h-1 bg-[var(--border)]" />
          <span>{vehicle.transmission}</span>
          <span className="w-1 h-1 bg-[var(--border)]" />
          <span>{vehicle.fuel}</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t-2 border-[var(--border)] pt-6">
          <div>
            <span className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-none block mb-1">
              ${vehicle.dailyPrice}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60">
              per day
            </span>
          </div>

          <BrutalistButton href={`/cars/${vehicle.id}`} className="px-4 py-2">
            <span>Book</span>
            <ArrowRight size={16} />
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
}
