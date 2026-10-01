"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const LOCATIONS = [
  {
    id: 1,
    city: "[CITY 1]",
    country: "[COUNTRY]",
    image: "/images/locations/city-1.jpg", // placeholder if doesn't exist
  },
  {
    id: 2,
    city: "[CITY 2]",
    country: "[COUNTRY]",
    image: "/images/locations/city-2.jpg",
  },
  {
    id: 3,
    city: "[CITY 3]",
    country: "[COUNTRY]",
    image: "/images/locations/city-3.jpg",
  },
  {
    id: 4,
    city: "[CITY 4]",
    country: "[COUNTRY]",
    image: "/images/locations/city-3.jpg",
  },
  // You can easily add more locations here and the snake path will automatically generate!
];

export function LocationsZigzag() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Use arrays for dynamic refs
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [pathData, setPathData] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Measure and build path
  const buildPath = () => {
    if (!containerRef.current) return;

    // Check if we have all img refs populated for our locations
    if (
      imgRefs.current.length !== LOCATIONS.length ||
      imgRefs.current.some((r) => !r)
    )
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const isMob = window.innerWidth < 768;
    setIsMobile(isMob);

    const N = LOCATIONS.length;
    if (N === 0) return;

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
      const rects = imgRefs.current.map((r) => r!.getBoundingClientRect());
      let d = "";

      for (let i = 0; i < N - 1; i++) {
        const curr = rects[i];
        const next = rects[i + 1];

        const curr_y = curr.top - containerRect.top + curr.height / 2;
        const next_y = next.top - containerRect.top + next.height / 2;

        const curr_left = curr.left - containerRect.left;
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
          const gap_y = curr.bottom - containerRect.top + 40;

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
      setTimeout(buildPath, 50);

      return () => {
        ro.disconnect();
        ScrollTrigger.removeEventListener("refreshInit", buildPath);
      };
    },
    { scope: containerRef },
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
      const validCards = cardRefs.current.filter(Boolean);
      gsap.set(validCards, {
        opacity: 0,
        y: 30,
      });

      let mm = gsap.matchMedia();

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
            start: "top 80%", // Start slightly earlier so the animation has more room
            end: "bottom 60%", // End before it completely leaves the screen
            scrub: 1.5, // 1.5 second smoothing delay! No more instant jumping!
            invalidateOnRefresh: true,
          },
        });

        // Animate line drawing
        tl.to(
          validPaths,
          { strokeDashoffset: 0, ease: "none", duration: 0.85 },
          0.15, // Start drawing exactly when Card 1 finishes fading in
        );

        // Stagger the card fade-ins dynamically
        const N = LOCATIONS.length;
        const maxStagger = 0.85; // end slightly before 1.0 progress
        const staggerStep = maxStagger / Math.max(1, N - 1);

        validCards.forEach((card, i) => {
          tl.to(
            card,
            { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
            Math.min(i * staggerStep, 0.85),
          );
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [pathData] },
  );

  const renderCard = (loc: (typeof LOCATIONS)[0], index: number) => {
    const isRight = index % 2 === 1;
    return (
      <React.Fragment key={loc.id}>
        <div
          ref={(el) => {
            if (el) cardRefs.current[index] = el;
          }}
          className={`flex flex-col w-full md:w-[320px] lg:w-[380px] ${isRight ? "md:self-end" : "md:self-start"} relative z-10 ${isMobile ? "pl-8" : "mb-8 md:mb-0"}`}
        >
          {/* Mobile Node */}
          {isMobile && (
            <div className="absolute left-[12px] top-1/2 w-2 h-2 bg-black border border-black z-20 translate-y-[20px]"></div>
          )}
          <h3 className="font-display text-[36px] uppercase leading-none tracking-tight mb-4">
            {loc.city}
          </h3>
          <div
            ref={(el) => {
              if (el) imgRefs.current[index] = el;
            }}
            className="card-brutalist p-0 border-2 border-black bg-black aspect-[16/10] relative group overflow-hidden transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[10px_10px_0px_0px_#000000] shadow-[6px_6px_0px_0px_#000000]"
          >
            <div className="absolute inset-0 bg-[#1a1a1a]"></div>
            {/* Placeholder label */}
            <span className="absolute inset-0 flex items-center justify-center text-white/20 font-display text-4xl uppercase text-center">
              {loc.city}
            </span>

            {/* Image - conditionally render if it exists, otherwise fallback is shown */}
            <Image
              src={loc.image}
              alt={loc.city}
              fill
              className="object-cover relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            <div className="absolute bottom-0 left-0 bg-[#E8B42A] border-t-2 border-r-2 border-black px-4 py-2 z-20">
              <span className="text-[14px] font-bold text-black uppercase tracking-widest">
                {loc.country}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Spacer between cards */}
        {index < LOCATIONS.length - 1 && (
          <div className="hidden md:block h-[88px] lg:h-[120px]"></div>
        )}
      </React.Fragment>
    );
  };

  return (
    <section className="py-16 md:py-24 relative z-10 bg-[var(--surface)]">
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
        <h2 className="text-h2 mb-16 md:mb-24">Where you can pick up.</h2>

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

          {LOCATIONS.map((loc, index) => renderCard(loc, index))}
        </div>
      </div>
    </section>
  );
}
