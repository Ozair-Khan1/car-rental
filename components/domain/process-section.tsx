"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BrutalistButton } from "@/components/ui/brutalist-button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const STEPS = [
  {
    num: "01",
    title: "Reserve",
    text: "Choose a car, pick your dates and send your request.",
  },
  {
    num: "02",
    title: "Confirm",
    text: "We confirm the price and details with you.",
  },
  {
    num: "03",
    title: "Drive",
    text: "Pick up the keys at the location, check the car together, and go.",
  },
];

const CHECKLIST = ["Driving license", "National Identity Card"];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // GSAP ScrollTrigger: update active step indicator as cards scroll into view
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActiveStep(i);
          },
        });
      });

      // Cleanup handled by useGSAP context
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
        <div className="flex flex-col md:flex-row gap-12 md:gap-12">
          {/* ── LEFT COLUMN (sticky on desktop) ── */}
          <div className="w-full md:w-4/12 md:sticky md:top-[112px] md:self-start flex flex-col gap-6">
            <Reveal>
              <h2 className="text-h2">The process</h2>
            </Reveal>

            <Reveal>
              <p className="text-lg font-medium text-[var(--muted)]">
                Three steps from search to keys.
              </p>
            </Reveal>

            {/* Progress Indicator */}
            <Reveal>
              <div className="flex gap-3" aria-hidden="true">
                {STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    className={`
                      w-10 h-10 flex items-center justify-center
                      border-2 border-[var(--border)] font-display text-sm uppercase
                      transition-all duration-200
                      ${
                        activeStep === i
                          ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-[4px_4px_0px_0px_var(--shadow)]"
                          : "bg-[var(--card)] text-[var(--card-ink)]"
                      }
                    `}
                  >
                    {step.num}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* What to bring card */}
            <Reveal>
              <div className="bg-[var(--accent)] border-2 border-[var(--border)] shadow-[6px_6px_0px_0px_var(--shadow)] p-6">
                <h3 className="font-display text-2xl uppercase tracking-wider text-[var(--on-accent)] mb-4">
                  What to bring
                </h3>
                <ul className="flex flex-col gap-3">
                  {CHECKLIST.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[var(--on-accent)]"
                    >
                      <span className="w-2.5 h-2.5 bg-[var(--on-accent)] shrink-0" />
                      <span className="text-[15px] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Browse Cars button */}
            <Reveal>
              <BrutalistButton
                href="#fleet"
                variant="dark"
                containerClassName="w-full block"
                className="py-4 text-sm"
              >
                <span>Browse Cars</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </BrutalistButton>
            </Reveal>
          </div>

          {/* ── RIGHT COLUMN (step cards) ── */}
          <div className="w-full md:w-8/12">
            <div className="flex flex-col gap-8">
              {STEPS.map((step, i) => (
                <Reveal key={step.num} delay={i * 60}>
                  <div
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="card-brutalist flex gap-6 items-start"
                    data-step={i}
                  >
                    <span className="w-14 shrink-0 text-h3 text-[var(--accent)]">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-h3 mb-3 text-[var(--card-ink)]">
                        {step.title}
                      </h3>
                      <p className="text-[17px] leading-relaxed max-w-lg text-[var(--muted)]">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
