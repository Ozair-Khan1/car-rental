import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Fuel, Briefcase, Zap, Gauge, Check, MapPin, Info, ArrowRight } from "lucide-react";
import { mockVehicles, mockOwners, mockLocations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

interface CarDetailsProps {
  params: { id: string }
}

export default function CarDetailsPage({ params }: CarDetailsProps) {
  // In Next.js 15, params is usually a Promise, but for simplicity in this mock, we assume synchronous access if passed directly or we can await it if we change to async component.
  // Actually, Next.js App Router Server Components can be async. Let's keep it simple for the UI prototype.
  const vehicle = mockVehicles.find(v => v.id === params.id);

  if (!vehicle) {
    notFound();
  }

  const owner = mockOwners.find(o => o.id === vehicle.ownerId);
  const location = mockLocations.find(l => l.id === vehicle.locationId);

  const isAvailable = vehicle.availability === "Available";
  const isElectric = vehicle.fuel === "Electric";

  // Calculate example total (mock calculation for UI purposes)
  const rentalDays = 3;
  const vehicleCost = vehicle.dailyPrice * rentalDays;
  const protection = 45;
  const serviceFee = 28;
  const taxes = Math.round(vehicleCost * 0.1);
  const total = vehicleCost + protection + serviceFee + taxes;

  return (
    <div className="pt-24 pb-24 bg-[var(--background)] min-h-screen">
      
      {/* 24. CAR DETAILS PAGE: Image Gallery */}
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
          <div className="md:col-span-2 relative rounded-[var(--radius-xl)] overflow-hidden shadow-sm">
            <Image 
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <div className="relative flex-1 rounded-[var(--radius-xl)] overflow-hidden shadow-sm">
              <Image 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop"
                alt="Interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 rounded-[var(--radius-xl)] overflow-hidden shadow-sm">
              <Image 
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop"
                alt="Detail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer">
                <span className="text-white font-medium flex items-center gap-2">View All Photos <ArrowRight size={16} /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Details */}
          <div className="flex-1">
            <div className="mb-8">
              <p className="text-[var(--text-muted)] text-lg font-medium mb-2">{vehicle.category}</p>
              <h1 className="text-display leading-tight mb-4">{vehicle.brand} {vehicle.model}</h1>
              
              <div className="flex items-center gap-6 text-[var(--text-secondary)]">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-[var(--foreground)]">{vehicle.rating}</span>
                  <span className="text-[var(--text-muted)]">({vehicle.reviewsCount} reviews)</span>
                </div>
                <div>•</div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>San Francisco International Airport</span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-[var(--border-color)] my-10" />

            {/* Quick Specs */}
            <h3 className="text-h3 mb-6">Vehicle Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="flex flex-col items-center justify-center p-4 bg-[var(--surface-elevated)] rounded-[var(--radius-lg)] border border-[var(--border-color)] text-center">
                <Users size={24} className="text-[var(--text-secondary)] mb-2" />
                <span className="font-semibold">{vehicle.seats} Seats</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[var(--surface-elevated)] rounded-[var(--radius-lg)] border border-[var(--border-color)] text-center">
                <Gauge size={24} className="text-[var(--text-secondary)] mb-2" />
                <span className="font-semibold">{vehicle.transmission}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[var(--surface-elevated)] rounded-[var(--radius-lg)] border border-[var(--border-color)] text-center">
                <Briefcase size={24} className="text-[var(--text-secondary)] mb-2" />
                <span className="font-semibold">{vehicle.luggage} Bags</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[var(--surface-elevated)] rounded-[var(--radius-lg)] border border-[var(--border-color)] text-center">
                {isElectric ? (
                  <>
                    <Zap size={24} className="text-[var(--success)] mb-2" />
                    <span className="font-semibold text-[var(--success)]">{vehicle.range} mi Range</span>
                  </>
                ) : (
                  <>
                    <Fuel size={24} className="text-[var(--text-secondary)] mb-2" />
                    <span className="font-semibold">{vehicle.fuel}</span>
                  </>
                )}
              </div>
            </div>

            <div className="h-px w-full bg-[var(--border-color)] my-10" />

            {/* Features */}
            <h3 className="text-h3 mb-6">Premium Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              {vehicle.features.map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span className="text-[var(--foreground)]">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="h-px w-full bg-[var(--border-color)] my-10" />

            {/* Meet your Host */}
            <h3 className="text-h3 mb-6">Meet your Host</h3>
            <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-6 mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image src={owner?.avatar || ''} alt={owner?.name || 'Host'} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{owner?.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-1">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span> {owner?.rating}
                    </span>
                    <span>•</span>
                    <span>{owner?.totalTrips} trips</span>
                    <span>•</span>
                    <span>Joined {owner?.joinedDate}</span>
                  </div>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                {owner?.name} typically responds within a few minutes and has a {owner?.responseRate}% response rate.
              </p>
              <Button variant="outline" className="w-full sm:w-auto">Contact Host</Button>
            </div>

            <div className="h-px w-full bg-[var(--border-color)] my-10" />

            {/* Pickup & Return */}
            <h3 className="text-h3 mb-6">Pickup & Return</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin size={24} className="text-[var(--text-muted)] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Pickup Location</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-2">{location?.address}</p>
                  <p className="text-[var(--text-muted)] text-sm bg-[var(--surface)] p-3 rounded-lg border border-[var(--border-color)]">
                    <strong>Instructions:</strong> Meet the host at the short-term parking lot. The host will hand you the keys directly after verifying your ID.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-[var(--border-color)] my-10" />

            {/* Rental Policy */}
            <h3 className="text-h3 mb-6">Rental Policy</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Info size={24} className="text-[var(--text-muted)] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Cancellation Policy</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Free cancellation up to 24 hours before pickup. After that, a cancellation fee of 1 day's rental will apply.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Info size={24} className="text-[var(--text-muted)] flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Mileage & Fuel</h4>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Unlimited mileage included. Please return the vehicle with a full tank of fuel to avoid refueling surcharges.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-[100px] bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)] p-6">
              <div className="flex items-end justify-between mb-6 pb-6 border-b border-[var(--border-color)]">
                <div>
                  <span className="text-3xl font-bold">${vehicle.dailyPrice}</span>
                  <span className="text-[var(--text-muted)]"> / day</span>
                </div>
                {isAvailable ? (
                  <span className="px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] text-xs font-semibold rounded-full border border-[var(--success)]/20">Available</span>
                ) : (
                  <span className="px-2 py-1 bg-[var(--error)]/10 text-[var(--error)] text-xs font-semibold rounded-full border border-[var(--error)]/20">Sold Out</span>
                )}
              </div>

              {/* Mock Date Selector */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-[var(--border-color)] rounded-lg p-3">
                    <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Pick-up</p>
                    <p className="font-semibold text-sm">Oct 24, 10:00 AM</p>
                  </div>
                  <div className="border border-[var(--border-color)] rounded-lg p-3">
                    <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Drop-off</p>
                    <p className="font-semibold text-sm">Oct 27, 10:00 AM</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>${vehicle.dailyPrice} × {rentalDays} days</span>
                  <span>${vehicleCost}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1 cursor-help underline decoration-dashed">Protection Plan</span>
                  <span>${protection}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Taxes</span>
                  <span>${taxes}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-[var(--border-color)] mb-8">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">${total}</span>
              </div>

              <Button 
                size="lg" 
                className="w-full text-base py-6 shadow-md" 
                disabled={!isAvailable}
                asChild={isAvailable}
              >
                {isAvailable ? (
                  <Link href={`/checkout/${vehicle.id}`}>Continue to Checkout</Link>
                ) : (
                  <span>Currently Unavailable</span>
                )}
              </Button>
              
              <p className="text-center text-xs text-[var(--text-muted)] mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
