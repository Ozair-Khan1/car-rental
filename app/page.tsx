"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SearchPanel } from "@/components/domain/search-panel";
import { LocationsZigzag } from "@/components/domain/locations-zigzag";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Initial Load Animation
      const tl = gsap.timeline();

      // Text animations
      tl.fromTo(
        ".hero-title-1 > span, .hero-title-2 > span",
        { y: 100 },
        { y: 0, duration: 0.8, ease: "power4.out", stagger: 0.1 },
      )
        .fromTo(
          ".hero-subtitle p",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-search",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        );

      // Car entering from right (100vw off-screen right)
      tl.fromTo(
        ".hero-car",
        { x: "100vw" },
        { x: 0, duration: 1.5, ease: "power3.out" },
        0, // start at the very beginning of timeline
      );

      // 2. ScrollTrigger Animation (Move car off-screen left on scroll down)
      gsap.to(".hero-car-container", {
        x: "100vw",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".text-content", {
        y: -100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: heroRef },
  );

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
      <div className="fixed inset-0 opacity-50 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 animate-grid" />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="pt-24 lg:pt-32 pb-16 md:pb-24 min-h-[75vh] relative flex flex-col justify-center hero-section overflow-hidden"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px] relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 relative">
            <div className="max-w-2xl lg:w-[60%] relative z-20 text-content">
              <h1 className="text-display mb-6 text-[var(--text-primary)] flex flex-col">
                <span className="hero-title-1 block overflow-hidden">
                  <span className="block">Rent a car</span>
                </span>
                <span className="hero-title-2 block overflow-hidden">
                  <span className="block">in minutes.</span>
                </span>
              </h1>
              <div className="hero-subtitle overflow-hidden">
                <p className="text-body max-w-md">
                  Pick up a car in [City], with prices from [Price] and free
                  cancellation up to 24h before.
                </p>
              </div>
            </div>

            {/* Cutout Car */}
            <div className="hidden lg:block absolute right-[-55%] top-1/2 -translate-y-1/2 w-[75%] h-[600px] z-10 pointer-events-none hero-car-container">
              <div className="w-full h-full relative z-10 hero-car">
                <Image
                  src="/car-images/BlackCar.png"
                  alt="Sports car cutout"
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                  className="object-contain object-right scale-[1.1] origin-right drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
          </div>

          <div className="relative z-20 hero-search opacity-0">
            <SearchPanel />
          </div>
        </div>
      </section>

      {/* MARQUEE 1 */}
      <div className="w-full bg-[var(--btn-primary-bg)] shadow-[4px_4px_0px_0px_var(--shadow-color)] border-y-2 border-[var(--border)] h-[56px] flex items-center overflow-hidden whitespace-nowrap relative z-10">
        <div className="animate-marquee inline-flex w-max">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-black font-display text-xl uppercase tracking-widest flex items-center shrink-0 pr-8"
            >
              FREE CANCELLATION <span className="mx-8">★</span> NO HIDDEN FEES{" "}
              <span className="mx-8">★</span> 24/7 SUPPORT{" "}
              <span className="mx-8">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-24">
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

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Reveal delay={0}>
                <div className="card-brutalist h-full flex flex-col">
                  <h3 className="text-h3 mb-3">Price</h3>
                  <p className="text-body">
                    [what's included in the daily rate]
                  </p>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <div className="card-brutalist h-full flex flex-col">
                  <h3 className="text-h3 mb-3">Insurance</h3>
                  <p className="text-body">[coverage and deductible]</p>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="card-brutalist h-full flex flex-col">
                  <h3 className="text-h3 mb-3">Cancellation</h3>
                  <p className="text-body">[policy]</p>
                </div>
              </Reveal>
              <Reveal delay={180}>
                <div className="card-brutalist h-full flex flex-col">
                  <h3 className="text-h3 mb-3">Pick-up</h3>
                  <p className="text-body">[locations and how it works]</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED FLEET */}
      <section className="py-16 md:py-24 bg-[var(--background)]">
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

      {/* PICK-UP LOCATIONS */}
      <LocationsZigzag />

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 relative z-10">
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <Reveal>
                  <h2 className="text-h2 mb-6 pt-[0.1em]">Questions?</h2>
                  <p className="text-body max-w-sm">
                    Everything you need to know about booking and hitting the
                    road.
                  </p>
                </Reveal>
              </div>
            </div>
            <div className="lg:w-2/3 flex flex-col">
              {faqs.map((faq, idx) => (
                <Reveal key={idx} delay={Math.min(idx, 6) * 60}>
                  <div
                    className={`border-b-2 border-[var(--border)] transition-all duration-200 ${activeFaq === idx ? "border-l-4 border-l-[var(--icon)] pl-6 bg-[var(--surface)] shadow-[4px_4px_0px_0px_var(--shadow-color)] mb-4 -ml-[2px]" : "pl-0 bg-transparent"}`}
                  >
                    <button
                      onClick={() =>
                        setActiveFaq(activeFaq === idx ? null : idx)
                      }
                      className="w-full py-8 flex items-center justify-between text-left group px-4"
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
                      <div className="pb-8 px-4 text-body max-w-2xl">
                        {faq.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <div className="w-full bg-[#111] border-y-2 border-[#111] h-[56px] flex items-center overflow-hidden whitespace-nowrap relative z-10">
        <div className="animate-marquee inline-flex w-max [animation-direction:reverse]">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[#F4F3ED] font-display text-xl uppercase tracking-widest flex items-center shrink-0 pr-8"
            >
              FREE CANCELLATION{" "}
              <span className="mx-8 text-[var(--icon)]">★</span> NO HIDDEN FEES{" "}
              <span className="mx-8 text-[var(--icon)]">★</span> INSURANCE
              INCLUDED <span className="mx-8 text-[var(--icon)]">★</span>{" "}
              [LOCATIONS] <span className="mx-8 text-[var(--icon)]">★</span>{" "}
              24/7 SUPPORT <span className="mx-8 text-[var(--icon)]">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
              <div className="w-full md:w-1/2">
                <h2 className="font-display text-[clamp(72px,8vw,140px)] leading-[0.95] pt-[0.1em] uppercase tracking-tight text-[var(--text-primary)] m-0 p-0">
                  FIND A CAR.
                </h2>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white border-2 border-black p-6 md:p-8 shadow-[4px_4px_0px_0px_#000000]">
                  <SearchPanel />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
