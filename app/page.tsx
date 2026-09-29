"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchPanel } from "@/components/domain/search-panel";
import { mockVehicles } from "@/lib/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  ArrowRight as ArrowIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BrutalistButton } from "@/components/ui/brutalist-button";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "The easiest car rental process I've ever used. The vehicle was exactly as described.",
      name: "Michael T., San Francisco",
    },
    {
      quote:
        "No counter queues. I landed, walked to the car, and drove away. Incredibly fast.",
      name: "Sarah L., Los Angeles",
    },
    {
      quote:
        "The pricing is completely transparent. I appreciate knowing exactly what I'll pay.",
      name: "David W., Miami",
    },
  ];

  const faqs = [
    { q: "Who can rent a car?", a: "[Answer details]" },
    { q: "What do I need to book?", a: "[Answer details]" },
    { q: "What's the security deposit?", a: "[Answer details]" },
    { q: "How does cancellation work?", a: "[Answer details]" },
    { q: "What if there's an accident?", a: "[Answer details]" },
    { q: "What's the fuel policy?", a: "[Answer details]" },
  ];

  return (
    <div className="flex flex-col w-full selection:bg-[var(--text-primary)] selection:text-[var(--background)] overflow-x-hidden relative">
      {/* Global Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 animate-grid" />

      {/* HERO SECTION */}
      <section className="pt-32 lg:pt-48 pb-24 md:pb-32 min-h-[75vh] relative flex flex-col justify-center">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px] relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 relative">
            <div className="max-w-2xl lg:w-[60%] relative z-20">
              <h1 className="text-display mb-6 text-[var(--text-primary)] flex flex-col">
                <Reveal delay={0} className="inline-block">
                  Rent a car
                </Reveal>
                <Reveal delay={80} className="inline-block">
                  in minutes.
                </Reveal>
              </h1>
              <Reveal delay={160}>
                <p className="text-body max-w-md">
                  Pick up a car in [City], with prices from [Price] and free
                  cancellation up to 24h before.
                </p>
              </Reveal>
            </div>

            {/* Cutout Car Placeholder */}
            <div className="hidden lg:block absolute right-[-65%] top-1/2 -translate-y-1/2 w-[75%] h-[600px] z-10 pointer-events-none">
              <Reveal
                direction="right"
                distance={40}
                delay={0}
                className="w-full h-full relative z-10"
              >
                {/* <!-- [replace: hero-car.png] --> */}
                <Image
                  src="/car-images/BlackCar.png"
                  alt="Sports car cutout"
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                  className="object-contain object-right scale-[1.2] origin-right"
                />
              </Reveal>
              {/* Separate contact shadow fading in slightly after */}
              <Reveal
                delay={400}
                direction="none"
                className="absolute bottom-[5%] left-1/4 right-[-10%] h-[30px] bg-black/50 blur-2xl rounded-[100%] z-10"
              ></Reveal>
            </div>
          </div>

          <Reveal delay={240} className="relative z-20">
            <SearchPanel />
          </Reveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
            <div className="lg:w-1/3">
              <Reveal>
                <h2 className="text-h2 mb-6">Drive on your terms.</h2>
                <p className="text-body mb-8">
                  Insurance included. No counter queues. Cancel free up to [24h]
                  before pick-up.
                </p>
              </Reveal>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
              <Reveal delay={0}>
                <h3 className="text-h3 mb-3">Price</h3>
                <p className="text-body">[what's included in the daily rate]</p>
              </Reveal>
              <Reveal delay={60}>
                <h3 className="text-h3 mb-3">Insurance</h3>
                <p className="text-body">[coverage and deductible]</p>
              </Reveal>
              <Reveal delay={120}>
                <h3 className="text-h3 mb-3">Cancellation</h3>
                <p className="text-body">[policy]</p>
              </Reveal>
              <Reveal delay={180}>
                <h3 className="text-h3 mb-3">Pick-up</h3>
                <p className="text-body">[locations and how it works]</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED FLEET */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16">
              <h2 className="text-h2">Available Fleet</h2>
              <BrutalistButton href="/cars" containerClassName="mt-4 md:mt-0">
                <span>View all vehicles</span>
                <ArrowIcon size={20} />
              </BrutalistButton>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6 mt-8">
            {mockVehicles.slice(0, 4).map((car, idx) => (
              <Reveal key={car.id} delay={Math.min(idx, 6) * 60}>
                <div className="card-brutalist group flex flex-col md:flex-row p-0 overflow-hidden items-stretch gap-0">
                  <div className="w-full md:w-[350px] h-[250px] md:h-auto relative shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-[var(--border)]">
                    <Image
                      src={car.images[0] || ""}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 w-full flex flex-col justify-between p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div>
                        <p className="text-small uppercase tracking-widest text-[var(--text-tertiary)] mb-1">
                          {car.category}
                        </p>
                        <h3 className="text-h3 mb-4">
                          {car.brand} {car.model}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-small text-[var(--text-secondary)]">
                          <span>{car.seats} Seats</span>
                          <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
                          <span>{car.transmission}</span>
                          <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
                          <span>{car.fuel}</span>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-h3 block">${car.dailyPrice}</span>
                        <span className="text-small block mt-1">per day</span>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <BrutalistButton href={`/cars/${car.id}`}>
                        <span>Book vehicle</span>
                        <ArrowIcon size={20} />
                      </BrutalistButton>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/3">
              <Reveal>
                <h2 className="text-h2">The process</h2>
              </Reveal>
            </div>
            <div className="lg:w-2/3">
              <div className="flex flex-col gap-8">
                <Reveal delay={0}>
                  <div className="card-brutalist flex gap-8 items-start">
                    <span className="text-h3 text-[var(--icon)]">01</span>
                    <div>
                      <h3 className="text-h3 mb-3">Reserve</h3>
                      <p className="text-body max-w-lg text-[var(--text-primary)]">
                        Select your dates, choose a location, and pick a vehicle
                        from our collection.
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={60}>
                  <div className="card-brutalist flex gap-8 items-start">
                    <span className="text-h3 text-[var(--icon)]">02</span>
                    <div>
                      <h3 className="text-h3 mb-3">Verify</h3>
                      <p className="text-body max-w-lg text-[var(--text-primary)]">
                        Upload your driver's license and verify your identity
                        securely within minutes.
                      </p>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={120}>
                  <div className="card-brutalist flex gap-8 items-start">
                    <span className="text-h3 text-[var(--icon)]">03</span>
                    <div>
                      <h3 className="text-h3 mb-3">Drive</h3>
                      <p className="text-body max-w-lg text-[var(--text-primary)]">
                        Locate your vehicle using the app, open the doors via
                        Bluetooth, and begin your trip.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 border-y-2 border-[var(--border)] relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px] relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row bg-[var(--surface)] border-[2px] border-[var(--border)] shadow-[4px_4px_0px_0px_var(--shadow-color)]">
              {/* Giant Quote Column */}
              <div className="hidden md:flex md:w-1/4 bg-[var(--icon)] border-r-[2px] border-[var(--border)] items-start justify-center pt-12">
                <span className="text-[180px] leading-none text-black font-black font-serif -mt-8">
                  "
                </span>
              </div>

              {/* Content Column */}
              <div className="p-8 md:p-16 flex flex-col justify-between gap-12 w-full md:w-3/4">
                <h2 className="text-h2 text-[var(--text-primary)] leading-tight uppercase">
                  {testimonials[activeTestimonial].quote}
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-8 border-t-2 border-[var(--border)] pt-8 mt-4">
                  <p className="text-h3 font-bold text-[var(--text-primary)] uppercase tracking-widest">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <div className="flex gap-4 shrink-0">
                    <BrutalistButton
                      variant="icon"
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === 0 ? testimonials.length - 1 : prev - 1,
                        )
                      }
                      aria-label="Previous testimonial"
                    >
                      <ArrowLeft size={24} />
                    </BrutalistButton>
                    <BrutalistButton
                      variant="icon"
                      onClick={() =>
                        setActiveTestimonial((prev) =>
                          prev === testimonials.length - 1 ? 0 : prev + 1,
                        )
                      }
                      aria-label="Next testimonial"
                    >
                      <ArrowRight size={24} />
                    </BrutalistButton>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <Reveal>
            <h2 className="text-h2 mb-12">Questions?</h2>
          </Reveal>
          <div className="flex flex-col max-w-[900px]">
            {faqs.map((faq, idx) => (
              <Reveal key={idx} delay={Math.min(idx, 6) * 60}>
                <div className="border-b-2 border-[var(--border)]">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full py-8 flex items-center justify-between text-left group"
                  >
                    <span className="text-h3 group-hover:text-[var(--icon)] transition-colors">
                      {faq.q}
                    </span>
                    {activeFaq === idx ? (
                      <Minus
                        size={24}
                        className="text-[var(--text-primary)] shrink-0"
                      />
                    ) : (
                      <Plus
                        size={24}
                        className="text-[var(--text-primary)] shrink-0"
                      />
                    )}
                  </button>
                  {activeFaq === idx && (
                    <div className="pb-8 text-body max-w-2xl">{faq.a}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 md:py-48">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <Reveal>
            <h2 className="text-display mb-10 max-w-3xl">Find a car.</h2>
            <BrutalistButton href="/cars">
              <span>Browse Vehicles</span>
              <ArrowIcon size={20} />
            </BrutalistButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
