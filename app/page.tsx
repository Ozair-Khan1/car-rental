"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SearchPanel } from "@/components/domain/search-panel";
import { VehicleCard } from "@/components/domain/vehicle-card";
import { mockVehicles, mockLocations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Map,
  Clock,
  CreditCard,
  Star,
  ChevronRight,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const stepsLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Hero Animation Sequence ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Ensure elements start hidden/transformed to avoid FOUC
      gsap.set(heroTextRef.current?.children || [], { y: 30, opacity: 0 });
      gsap.set(heroImageRef.current, { scale: 1.05, opacity: 0 });

      tl.to(heroTextRef.current?.children || [], {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "expo.out",
        delay: 0.2,
      }).to(
        heroImageRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
        },
        "-=0.8",
      );

      // --- Scroll Animations ---

      // Featured Cars Stagger
      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current.querySelectorAll(".vehicle-card-wrapper"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // How It Works Connecting Line
      if (stepsLineRef.current) {
        gsap.fromTo(
          stepsLineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: stepsLineRef.current.parentElement,
              start: "top 60%",
              end: "bottom 60%",
              scrub: true,
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const featuredVehicles = mockVehicles.slice(0, 3);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 10. HERO SECTION */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 min-h-[90vh] flex flex-col justify-center"
      >
        {/* Background gradient/texture (subtle) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] to-[var(--surface-elevated)] -z-10" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
          {/* Hero Text */}
          <div
            ref={heroTextRef}
            className="text-center max-w-4xl mx-auto mb-10"
          >
            <h1 className="text-display mb-6 tracking-tight text-[var(--foreground)]">
              Your journey starts with the right car.
            </h1>
            <p className="text-h3 text-[var(--text-secondary)] font-normal max-w-2xl mx-auto">
              Premium vehicles, flexible rentals, and a smarter way to get where
              you're going.
            </p>
          </div>

          {/* Hero Image */}
          <div
            ref={heroImageRef}
            className="relative w-full max-w-5xl aspect-[21/9] md:aspect-[24/9] mx-auto rounded-[var(--radius-xl)] overflow-hidden shadow-2xl mb-[-60px] md:mb-[-80px] z-10 bg-[var(--surface-elevated)]"
          >
            <Image
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2400&auto=format&fit=crop"
              alt="Premium driving experience"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Dark overlay at bottom so search panel pops */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Search Panel Component */}
          <SearchPanel />
        </div>
      </section>

      {/* 12. POPULAR LOCATIONS */}
      <section className="py-24 bg-[var(--background)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-h2 mb-2">Popular Destinations</h2>
              <p className="text-[var(--text-secondary)]">
                Find premium vehicles in top cities worldwide.
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2">
              View All Locations <ChevronRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockLocations.map((location) => (
              <Link
                key={location.id}
                href={`/locations/${location.id}`}
                className="group relative aspect-[4/5] md:aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden shadow-sm"
              >
                <Image
                  src={location.image}
                  alt={location.city}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                  <h3 className="text-xl font-bold mb-1">{location.city}</h3>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <Map size={14} /> {location.country}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FEATURED CARS */}
      <section className="py-24 bg-[var(--surface-elevated)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-h2 mb-4">Find your perfect drive.</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              From efficient city cars to premium SUVs, choose the vehicle that
              fits your journey.
            </p>

            {/* Quick Category Filters (Visual only for homepage) */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {["All", "Economy", "Sedan", "SUV", "Luxury", "Electric"].map(
                (cat, i) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--background)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]"}`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>

          <div
            ref={featuredRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card-wrapper h-full">
                <VehicleCard vehicle={vehicle} featured />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/cars">View All Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 15. HOW IT WORKS */}
      <section className="py-24 bg-[var(--background)] relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-h2 mb-4">How it works</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Rent a premium vehicle in three simple steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-[40px] left-0 w-full h-[2px] bg-[var(--border-color)] -z-10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[var(--surface-elevated)] rounded-full border border-[var(--border-color)] flex items-center justify-center text-2xl font-bold text-[var(--accent)] mb-6 shadow-sm z-10 relative">
                  01
                </div>
                <h3 className="text-xl font-bold mb-3">Choose your car</h3>
                <p className="text-[var(--text-secondary)]">
                  Browse our curated selection of premium vehicles and find your
                  perfect match.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[var(--surface-elevated)] rounded-full border border-[var(--border-color)] flex items-center justify-center text-2xl font-bold text-[var(--accent)] mb-6 shadow-sm z-10 relative">
                  02
                </div>
                <h3 className="text-xl font-bold mb-3">Book your trip</h3>
                <p className="text-[var(--text-secondary)]">
                  Select dates, pickup location, protection plans, and optional
                  extras.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[var(--accent)] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-md z-10 relative">
                  03
                </div>
                <h3 className="text-xl font-bold mb-3">Hit the road</h3>
                <p className="text-[var(--text-secondary)]">
                  Pick up your vehicle at our location or use our contactless
                  digital key access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16. WHY DRIVENOW */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-h2 mb-6 text-background">
                The premium mobility standard.
              </h2>
              <p className="text-text-muted text-lg mb-10 max-w-lg">
                We've rebuilt the car rental experience from the ground up to be
                transparent, flexible, and completely tailored to your journey.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="mt-1 bg-white/10 p-2 rounded-lg h-fit text-background">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-background mb-2">
                      Transparent Pricing
                    </h4>
                    <p className="text-text-muted text-sm">
                      No surprise charges. What you see is exactly what you pay.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-white/10 p-2 rounded-lg h-fit text-background">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-background mb-2">
                      Flexible Rentals
                    </h4>
                    <p className="text-text-muted text-sm">
                      Change or cancel selected bookings easily up to 24h
                      before.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-white/10 p-2 rounded-lg h-fit text-background">
                    <Map size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-background mb-2">
                      Nationwide Locations
                    </h4>
                    <p className="text-text-muted text-sm">
                      Convenient pickup locations at major airports and city
                      centers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-white/10 p-2 rounded-lg h-fit text-background">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-background mb-2">
                      Contactless Access
                    </h4>
                    <p className="text-text-muted text-sm">
                      Skip the counter. Unlock your reserved vehicle with your
                      phone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1600&auto=format&fit=crop"
                alt="Premium service"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 19. FINAL CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2400&auto=format&fit=crop"
            alt="Ready for the road"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-h1 text-white mb-6">Ready for the road?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Find your next car and start your journey today. Experience the
            standard in premium car rentals.
          </p>
          <Button
            size="lg"
            variant="primary"
            asChild
            className="px-10 py-6 text-lg h-auto shadow-xl"
          >
            <Link href="/cars">Browse Cars</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
