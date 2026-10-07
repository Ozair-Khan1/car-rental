"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SearchPanel } from "@/components/domain/search-panel";
import { LocationsZigzag } from "@/components/domain/locations-zigzag";
import { ProcessSection } from "@/components/domain/process-section";
import { mockVehicles } from "@/lib/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  ArrowRight as ArrowIcon,
  Quote,
  Star,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BrutalistButton } from "@/components/ui/brutalist-button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const quoteTextRef = useRef<HTMLQuoteElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

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

  const nextTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  }, [testimonials.length]);

  // Smooth entrance animation whenever activeTestimonial changes
  useGSAP(
    () => {
      if (!quoteTextRef.current) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        gsap.fromTo(
          quoteTextRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
        );
        return;
      }

      // Smooth kinetic blur & vertical slide for quote text
      gsap.fromTo(
        quoteTextRef.current,
        { opacity: 0, y: 14, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        },
      );

      // Smooth slide for author name
      if (authorRef.current) {
        gsap.fromTo(
          authorRef.current,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.38, ease: "power2.out", delay: 0.06 },
        );
      }

      // Snappy brutalist recoil on the yellow column's quote badge
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { rotate: -9, scale: 0.88 },
          { rotate: -3, scale: 1, duration: 0.45, ease: "back.out(2.2)" },
        );
      }

      // Staggered twinkle on the 5 stars
      if (starsRef.current) {
        gsap.fromTo(
          starsRef.current.children,
          { scale: 0.6, opacity: 0.2 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.04,
            ease: "power2.out",
          },
        );
      }
    },
    { dependencies: [activeTestimonial] },
  );

  // Auto-change timer
  useEffect(() => {
    if (isTestimonialPaused) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5500);

    return () => {
      clearInterval(interval);
    };
  }, [isTestimonialPaused, nextTestimonial, activeTestimonial]);

  const faqs = [
    {
      q: "Who can rent a car?",
      a: "Anyone with a valid driving license and a National Identity Card, aged 18 or older.",
    },
    {
      q: "What do I need to book?",
      a: "Your driving license, your National Identity Card and a phone number we can reach you on. Choose a car, pick your dates and send your request.",
    },
    { q: "What's the security deposit?", a: "There is no deposit." },
    {
      q: "How does cancellation work?",
      a: "Cancel free up to 24 hours before pick-up. After that, no refund. To change your dates, message us and we'll sort it out.",
    },
    {
      q: "What if there's an accident?",
      a: "Call phone number right away. Don't move the car if it is unsafe to do so, and take photos.",
    },
    {
      q: "What's the fuel policy?",
      a: "Pick up and return the car with the same fuel level",
    },
  ];

  return (
    <div className="flex flex-col w-full selection:bg-[var(--ink)] selection:text-[var(--bg)] overflow-x-hidden relative">
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="pt-24 lg:pt-32 pb-16 md:pb-24 min-h-[75vh] relative flex flex-col justify-center hero-section overflow-hidden"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px] relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 relative">
            <div className="max-w-2xl lg:w-[60%] relative z-20 text-content">
              <h1 className="text-display mb-6 text-[var(--ink)] flex flex-col">
                <span className="hero-title-1 block overflow-hidden">
                  <span className="block">Rent a car</span>
                </span>
                <span className="hero-title-2 block overflow-hidden">
                  <span className="block">in minutes.</span>
                </span>
              </h1>
              <div className="hero-subtitle overflow-hidden">
                <p className="text-xl font-medium max-w-md text-[var(--ink)]">
                  Choose a car, pick your dates, and book. No counter, no queue.
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
      <div className="w-full bg-[var(--accent)] shadow-[4px_4px_0px_0px_var(--shadow)] border-y-2 border-[var(--border)] h-[56px] flex items-center overflow-hidden whitespace-nowrap relative z-10">
        <div className="animate-marquee inline-flex w-max">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[var(--on-accent)] font-display text-xl uppercase tracking-widest flex items-center shrink-0 pr-8"
            >
              FREE CANCELLATION <span className="mx-8">★</span> NO HIDDEN FEES{" "}
              <span className="mx-8">★</span> 24/7 SUPPORT{" "}
              <span className="mx-8">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED FLEET */}
      <section id="fleet" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16">
              <h2 className="text-h2 text-[var(--ink)]">Available Fleet</h2>
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
                        <p className="text-[14px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                          {car.category}
                        </p>
                        <h3 className="text-h3 mb-4 text-[var(--card-ink)]">
                          {car.brand} {car.model}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-[14px] font-medium text-[var(--muted)]">
                          <span>{car.seats} Seats</span>
                          <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
                          <span>{car.transmission}</span>
                          <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
                          <span>{car.fuel}</span>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-h3 block text-[var(--card-ink)]">${car.dailyPrice}</span>
                        <span className="text-[14px] font-bold uppercase tracking-wider block mt-1 text-[var(--muted)]">per day</span>
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

      <ProcessSection />

      {/* PICK-UP LOCATIONS */}
      <LocationsZigzag />

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px] relative z-10">
          <Reveal>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-h2 text-[var(--ink)]">What drivers & Renters say.</h2>
              </div>
            </div>

            {/* Testimonial Card */}
            <div
              onMouseEnter={() => setIsTestimonialPaused(true)}
              onMouseLeave={() => setIsTestimonialPaused(false)}
              className="flex flex-col md:flex-row bg-[var(--card)] border-2 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--shadow)] relative overflow-hidden"
            >
              {/* Left Column: Yellow Accent with Quote & Stars */}
              <div className="w-full md:w-[240px] lg:w-[280px] shrink-0 bg-[var(--accent)] border-b-2 md:border-b-0 md:border-r-2 border-[var(--border)] flex flex-row md:flex-col items-center justify-between md:justify-center p-6 md:p-8 gap-4 md:gap-8">
                {/* Quote Icon Badge */}
                <div
                  ref={badgeRef}
                  className="w-12 h-12 md:w-16 md:h-16 bg-[var(--on-accent)] flex items-center justify-center border-2 border-[var(--on-accent)] shadow-[3px_3px_0px_0px_var(--on-accent)] rotate-[-3deg] shrink-0 will-change-transform"
                >
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-[var(--accent)] fill-[var(--accent)]" />
                </div>

                {/* 5-Star Rating */}
                <div ref={starsRef} className="flex gap-1 text-[var(--on-accent)]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[var(--on-accent)] text-[var(--on-accent)]" />
                  ))}
                </div>
              </div>

              {/* Right Column: Quote Content & Author Controls */}
              <div className="p-6 md:p-12 lg:p-14 flex flex-col justify-between gap-8 flex-1 min-h-[250px] md:min-h-[280px]">
                <blockquote
                  ref={quoteTextRef}
                  className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--card-ink)] leading-[1.25] uppercase tracking-tight will-change-transform"
                >
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </blockquote>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6 border-t-2 border-[var(--border)] pt-6 mt-2">
                  <div>
                    <p
                      ref={authorRef}
                      className="text-xl md:text-2xl font-display font-black text-[var(--card-ink)] uppercase tracking-wider will-change-transform"
                    >
                      {testimonials[activeTestimonial].name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[14px] font-bold text-[var(--muted)] mr-2 md:hidden">
                      0{activeTestimonial + 1} / 0{testimonials.length}
                    </span>
                    <BrutalistButton
                      variant="icon"
                      onClick={prevTestimonial}
                      aria-label="Previous testimonial"
                    >
                      <ArrowLeft size={24} />
                    </BrutalistButton>
                    <BrutalistButton
                      variant="icon"
                      onClick={nextTestimonial}
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
                  <h2 className="text-h2 mb-6 pt-[0.1em] text-[var(--ink)]">Questions?</h2>
                  <p className="text-xl font-medium max-w-sm text-[var(--muted)]">
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
                    className={`border-b-2 border-[var(--border)] transition-all duration-200 ${activeFaq === idx ? "border-l-4 border-l-[var(--accent)] pl-6 bg-[var(--card)] shadow-[4px_4px_0px_0px_var(--shadow)] mb-4 -ml-[2px]" : "pl-0 bg-transparent"}`}
                  >
                    <button
                      onClick={() =>
                        setActiveFaq(activeFaq === idx ? null : idx)
                      }
                      className="w-full py-8 flex items-center justify-between text-left group px-4"
                    >
                      <span className="text-h3 group-hover:text-[var(--faq-hover)] transition-colors text-[var(--ink)]">
                        {faq.q}
                      </span>
                      {activeFaq === idx ? (
                        <Minus
                          size={24}
                          className="text-[var(--ink)] shrink-0"
                        />
                      ) : (
                        <Plus
                          size={24}
                          className="text-[var(--ink)] shrink-0"
                        />
                      )}
                    </button>
                    {activeFaq === idx && (
                      <div className="pb-8 px-4 text-[16px] leading-relaxed max-w-2xl text-[var(--muted)]">
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
      <div className="w-full bg-[#111] border-y-2 border-[var(--border)] h-[56px] flex items-center overflow-hidden whitespace-nowrap relative z-10">
        <div className="animate-marquee inline-flex w-max [animation-direction:reverse]">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[#F4F2EC] font-display text-xl uppercase tracking-widest flex items-center shrink-0 pr-8"
            >
              FREE CANCELLATION{" "}
              <span className="mx-8 text-[var(--accent)]">★</span> NO HIDDEN FEES{" "}
              <span className="mx-8 text-[var(--accent)]">★</span> INSURANCE
              INCLUDED <span className="mx-8 text-[var(--accent)]">★</span>{" "}
              [LOCATIONS] <span className="mx-8 text-[var(--accent)]">★</span>{" "}
              24/7 SUPPORT <span className="mx-8 text-[var(--accent)]">★</span>
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
                <h2 className="font-display text-[clamp(62px,6vw,120px)] leading-[0.95] pt-[0.1em] uppercase tracking-tight text-[var(--ink)] m-0 p-0">
                  LET'S FIND A CAR.
                </h2>
              </div>
              <div className="w-full md:w-1/2">
                <SearchPanel variant="compact" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
