"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Vehicle } from "@/lib/mock-data";
import { BrutalistButton } from "@/components/ui/brutalist-button";

interface VehicleCardProps {
  vehicle: Vehicle;
  rentalDays?: number;
}

export function VehicleCard({ vehicle, rentalDays }: VehicleCardProps) {
  const totalPrice = rentalDays && rentalDays > 0 ? vehicle.dailyPrice * rentalDays : null;
  const brand = vehicle.brand.replace(/-/g, "\u2011");
  const model = vehicle.model.replace(/-/g, "\u2011");

  return (
    <div className="card-brutalist flex flex-col p-0 overflow-hidden h-full bg-[var(--card)] text-[var(--card-ink)] border-2 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--shadow)]">
      {/* Fixed aspect-ratio 16/10 image wrapper */}
      <Link
        href={`/cars/${vehicle.id}`}
        className="w-full aspect-[16/10] relative border-b-2 border-[var(--border)] block group overflow-hidden shrink-0"
      >
        <Image
          src={vehicle.images[0] || ""}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="flex-1 flex flex-col p-6">
        <p className="text-[14px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          {vehicle.category}
        </p>
        <h3 className="font-display font-normal text-[28px] tracking-normal uppercase text-[var(--card-ink)] leading-tight mb-2.5 [text-wrap:balance]">
          {brand} {model}
        </h3>

        {/* Specs on one line: sentence case, 14px, letter-spacing 0.02em, no wrapping */}
        <div className="text-[14px] font-medium tracking-[0.02em] text-[var(--muted)] whitespace-nowrap overflow-hidden text-ellipsis mb-6">
          {vehicle.seats} seats · {vehicle.transmission} · {vehicle.fuel}
        </div>

        {/* Bottom row pinned with mt-auto, price on left, BOOK button on right */}
        <div className="mt-auto flex items-end justify-between gap-4 border-t-2 border-[var(--border)] pt-5">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black text-[var(--card-ink)] leading-none block mb-1">
              ${vehicle.dailyPrice}
            </span>
            <span className="text-[14px] font-bold uppercase tracking-wider text-[var(--muted)] block">
              PER DAY
            </span>
            {totalPrice !== null && rentalDays && (
              <span className="text-[14px] font-bold text-[var(--muted)] uppercase tracking-wider block mt-1.5">
                {rentalDays} {rentalDays === 1 ? "day" : "days"} · ${totalPrice}
              </span>
            )}
          </div>

          <BrutalistButton
            href={`/cars/${vehicle.id}`}
            className="px-6 py-2.5 min-w-[120px] text-sm font-black"
            containerClassName="shrink-0 min-w-[120px]"
          >
            <span>Book</span>
            <ArrowRight size={16} />
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
}
