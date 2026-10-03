"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LocationItem, DEFAULT_LOCATIONS } from "@/lib/locations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface LocationsZigzagProps {
  initialLocations?: LocationItem[];
}

export function LocationsZigzag({ initialLocations }: LocationsZigzagProps) {
  const [locations, setLocations] = useState<LocationItem[]>(
    initialLocations && initialLocations.length > 0
      ? initialLocations
      : DEFAULT_LOCATIONS,
  );
  const [countryName, setCountryName] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Dynamic refs based on locations count
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [pathData, setPathData] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Fetch visitor country locations dynamically if not provided initially
  useEffect(() => {
    if (!initialLocations) {
      let isMounted = true;
      fetch("/api/locations")
        .then((res) => res.json())
        .then((data) => {
          if (!isMounted || !data.locations || data.locations.length === 0)
            return;

          // 1. FIRST: Display immediately on website!
          imgRefs.current = [];
          cardRefs.current = [];
          setLocations(data.locations);
          if (data.locations[0]?.country) {
            setCountryName(data.locations[0].country);
          }

          // 2. THEN: Call backend to save those countries/cities/images in DB for future visitors
          if (!data.fromDb && data.country) {
            fetch("/api/locations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                countryCode: data.country,
                locations: data.locations,
              }),
            }).catch((saveErr) => {
              console.warn("Background DB save failed:", saveErr);
            });
          }
        })
        .catch((err) => {
          console.warn("Could not fetch user locations:", err);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [initialLocations]);

  // Measure and build path
  const buildPath = () => {
    if (!containerRef.current) return;

    const N = locations.length;
    if (N === 0) return;

    // Check if we have all img refs populated for our locations
    if (
      imgRefs.current.length < N ||
      imgRefs.current.slice(0, N).some((r) => !r)
    ) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const isMob = window.innerWidth < 768;
    setIsMobile(isMob);

    if (isMob) {
      // Mobile vertical line
      const x = 16; // 16px from left
      const first = imgRefs.current[0]!.getBoundingClientRect();
      const last = imgRefs.current[N - 1]!.getBoundingClientRect();

      const yStart = first.top - containerRect.top + 20;
      const yEnd = last.bottom - containerRect.top - 20;
      setPathData(`M ${x} ${yStart} L ${x} ${yEnd}`);
    } else {
      // Desktop dynamic zigzag logic
      const rects = imgRefs.current
        .slice(0, N)
        .map((r) => r!.getBoundingClientRect());
      let d = "";

      for (let i = 0; i < N - 1; i++) {
        const curr = rects[i];
        const next = rects[i + 1];

        const curr_y = curr.top - containerRect.top + curr.height / 2;
        const next_y = next.top - containerRect.top + next.height / 2;

        const curr_right = curr.right - containerRect.left;
        const next_left = next.left - containerRect.left;
        const next_right = next.right - containerRect.left;

        // Start point of the entire snake
        if (i === 0) {
          d += `M ${curr_right - 100} ${curr_y} `;
        }

        const isCurrLeft = i % 2 === 0;

        if (isCurrLeft) {
          // Current card is LEFT-aligned, Next is RIGHT-aligned.
          const mid_x = curr_right + (next_left - curr_right) / 2;

          d += `L ${mid_x} ${curr_y} `;
          d += `L ${mid_x} ${next_y} `;

          if (i + 1 === N - 1) {
            // Next is the very last card
            d += `L ${next_left + 100} ${next_y}`;
          } else {
            // Next is not the last card, cross it completely and exit its right edge
            d += `L ${next_right + 80} ${next_y} `;
          }
        } else {
          // Current card is RIGHT-aligned, Next is LEFT-aligned.
          // Measure the vertical gap between Stop i and Stop i+1
          const cardBottom =
            (cardRefs.current[i]?.getBoundingClientRect().bottom ??
              curr.bottom) - containerRect.top;
          const nextCardTop =
            (cardRefs.current[i + 1]?.getBoundingClientRect().top ?? next.top) -
            containerRect.top;
          const gap_y = cardBottom + (nextCardTop - cardBottom) / 2;

          d += `L ${curr_right + 80} ${gap_y} `;
          d += `L ${next_left - 80} ${gap_y} `;
          d += `L ${next_left - 80} ${next_y} `;

          if (i + 1 === N - 1) {
            // Next is the very last card
            d += `L ${next_left + 100} ${next_y}`;
          } else {
            // Next is not the last card, enter it a bit so the next loop continues crossing it
            d += `L ${next_left + 100} ${next_y} `;
          }
        }
      }
      setPathData(d);
    }
  };

  // Re-trigger path calculation when locations update
  useEffect(() => {
    const timer = setTimeout(() => {
      buildPath();
    }, 100);
    return () => clearTimeout(timer);
  }, [locations]);

  useGSAP(
    () => {
      // Rebuild path on resize
      const ro = new ResizeObserver(() => {
        buildPath();
      });
      if (containerRef.current) {
        ro.observe(containerRef.current);
      }
      ScrollTrigger.addEventListener("refreshInit", buildPath);

      // Initial build with slight delay to ensure images/layout settled
      const timer = setTimeout(buildPath, 100);

      return () => {
        clearTimeout(timer);
        ro.disconnect();
        ScrollTrigger.removeEventListener("refreshInit", buildPath);
      };
    },
    { scope: containerRef, dependencies: [locations] },
  );

  useGSAP(
    () => {
      if (!pathData) return; // Wait for path to be built

      const validPaths = pathRefs.current.filter(Boolean) as SVGPathElement[];
      if (validPaths.length === 0) return;

      const length = validPaths[0].getTotalLength();
      gsap.set(validPaths, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      // Initial state for all dynamic cards
      const validCards = cardRefs.current
        .slice(0, locations.length)
        .filter(Boolean);
      gsap.set(validCards, {
        opacity: 0,
        y: 30,
      });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // No animation
        gsap.set(validPaths, { strokeDashoffset: 0 });
        gsap.set(validCards, {
          opacity: 1,
          y: 0,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 80%",
            scrub: 0.5, // Snappy tracking that eliminates lag while keeping smooth motion
            invalidateOnRefresh: true,
          },
        });

        // Line draws smoothly across the entire scroll range starting immediately
        tl.to(
          validPaths,
          { strokeDashoffset: 0, ease: "none", duration: 1 },
          0,
        );

        // Stagger the card fade-ins dynamically to match line arrival
        const N = locations.length;
        validCards.forEach((card, i) => {
          const cardTriggerTime = N > 1 ? (i / (N - 1)) * 0.85 : 0;
          tl.to(
            card,
            { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
            cardTriggerTime,
          );
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [pathData, locations] },
  );

  const renderCard = (loc: LocationItem, index: number) => {
    const isRight = index % 2 === 1;
    return (
      <React.Fragment key={loc.id || `${loc.city}-${index}`}>
        <div
          ref={(el) => {
            if (el) cardRefs.current[index] = el;
          }}
          className={`flex flex-col w-full md:w-[440px] lg:w-[520px] ${
            isRight ? "md:self-end" : "md:self-start"
          } relative z-10 ${isMobile ? "pl-8" : "mb-8 md:mb-0"}`}
        >
          {/* City Name */}
          <h3 className="font-display text-[36px] uppercase leading-none tracking-tight mb-4">
            {loc.city}
          </h3>

          {/* 16:10 Image - Measured by imgRefs for exact center line attachment */}
          <div
            ref={(el) => {
              if (el) imgRefs.current[index] = el;
            }}
            className="border-2 border-black border-b-0 bg-black aspect-[16/10] relative group overflow-hidden shadow-[4px_0px_0px_0px_#000000]"
          >
            {/* Mobile Node aligned to image center */}
            {isMobile && (
              <div className="absolute -left-[20px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black border border-black z-20"></div>
            )}

            <div className="absolute inset-0 bg-[#1a1a1a]"></div>
            {/* Fallback label */}
            <span className="absolute inset-0 flex items-center justify-center text-white/20 font-display text-4xl uppercase text-center px-4">
              {loc.city}
            </span>

            {/* Image */}
            <Image
              src={loc.image}
              alt={loc.city}
              fill
              unoptimized
              className="object-cover relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Attached White Info Panel Directly Below Image */}
          <div className="bg-white border-2 border-black p-5 flex flex-col gap-3 shadow-[4px_4px_0px_0px_#000000] relative z-10">
            {/* Row 2: Cars Available */}
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-mono font-bold uppercase text-[var(--text-secondary,#666666)] tracking-wider shrink-0">
                CARS AVAILABLE
              </span>
              <span className="text-[16px] font-bold text-black font-mono text-right">
                [00]
              </span>
            </div>

            {/* Full-width Brutalist Button */}
            <BrutalistButton
              href="#fleet"
              onClick={(e) => {
                const headings = Array.from(document.querySelectorAll("h2"));
                const fleetHeading = headings.find((h) =>
                  h.textContent?.toLowerCase().includes("fleet"),
                );
                if (fleetHeading) {
                  e.preventDefault();
                  fleetHeading.scrollIntoView({ behavior: "smooth" });
                }
              }}
              containerClassName="w-full mt-2"
              className="w-full text-[14px] py-3.5"
            >
              <span>SEE CARS IN {loc.city.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </BrutalistButton>
          </div>
        </div>

        {/* Desktop Spacer between cards - 72px */}
        {index < locations.length - 1 && (
          <div className="hidden md:block h-[72px]"></div>
        )}
      </React.Fragment>
    );
  };

  return (
    <section className="py-16 md:py-24 relative z-10 bg-[var(--surface)] border-2 border-black shadow-[4px_4px_0px_0px_var(--shadow-color)]">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 md:mb-24 gap-4">
          <h2 className="text-h2">Where you can pick up and go.</h2>
          {countryName && (
            <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-[#E8B42A] text-black px-3 py-1.5 border-2 border-black font-mono text-[19px] font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_#000000]">
              <span>{countryName}</span>
            </div>
          )}
        </div>

        <div
          ref={containerRef}
          className="relative w-full flex flex-col gap-12 md:gap-0"
        >
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            aria-hidden="true"
          >
            {pathData && (
              <>
                <g className="boxy-brutalist-paths">
                  {/* Shadow Path */}
                  <path
                    ref={(el) => {
                      if (el) pathRefs.current[0] = el;
                    }}
                    d={pathData}
                    fill="none"
                    stroke="black"
                    transform="translate(4, 4)"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                  />
                  {/* Border Path */}
                  <path
                    ref={(el) => {
                      if (el) pathRefs.current[1] = el;
                    }}
                    d={pathData}
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                  />
                  {/* Fill Path */}
                  <path
                    ref={(el) => {
                      if (el) pathRefs.current[2] = el;
                    }}
                    d={pathData}
                    fill="none"
                    stroke="#E8B42A"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                  />
                </g>
              </>
            )}
          </svg>

          {locations.map((loc, index) => renderCard(loc, index))}
        </div>
      </div>
    </section>
  );
}
