"use client";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function DashboardOverview() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-h2 mb-2">
          Good morning, {session?.user?.name || "User"}.
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here's what's happening with your DriveNow account.
        </p>
      </div>

      {/* Upcoming Booking */}
      <section>
        <h2 className="text-xl font-bold mb-4">Upcoming Trip</h2>
        <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-xl)] overflow-hidden flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/3 aspect-[4/3] md:aspect-auto">
            <Image
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop"
              alt="BMW X5"
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold rounded-full shadow-md">
                Confirmed
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium mb-1">
                Booking #DN-849204
              </p>
              <h3 className="text-2xl font-bold mb-6">BMW X5</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pick-up</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      SFO Airport
                    </p>
                    <p className="text-xs text-[var(--foreground)] font-semibold mt-1">
                      Oct 24, 10:00 AM
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drop-off</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      SFO Airport
                    </p>
                    <p className="text-xs text-[var(--foreground)] font-semibold mt-1">
                      Oct 27, 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--border-color)]">
              <Button asChild>
                <Link href="/dashboard/bookings/DN-849204">View Details</Link>
              </Button>
              <Button variant="outline">Modify Booking</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of secondary info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Rentals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Rentals</h2>
            <Link
              href="/dashboard/bookings"
              className="text-sm text-[var(--accent)] font-medium flex items-center hover:underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-4">
            <div className="flex items-center gap-4 p-2 hover:bg-[var(--background)] rounded-md transition-colors cursor-pointer">
              <div className="relative w-16 h-12 rounded bg-[var(--background)] overflow-hidden flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=200&auto=format&fit=crop"
                  alt="Toyota Camry"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Toyota Camry Hybrid</h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Sep 12 - Sep 15, 2026
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-8">
                Rebook
              </Button>
            </div>

            <div className="h-px bg-[var(--border-color)] w-full" />

            <div className="flex items-center gap-4 p-2 hover:bg-[var(--background)] rounded-md transition-colors cursor-pointer">
              <div className="relative w-16 h-12 rounded bg-[var(--background)] overflow-hidden flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=200&auto=format&fit=crop"
                  alt="Porsche Taycan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Porsche Taycan</h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Aug 02 - Aug 04, 2026
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-8">
                Rebook
              </Button>
            </div>
          </div>
        </section>

        {/* Recommended */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recommended For You</h2>
          </div>

          <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center flex-shrink-0 mt-1">
                <Star size={20} />
              </div>
              <div>
                <h3 className="font-bold mb-2">Upgrade your next trip</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Based on your previous rentals, you might enjoy the
                  Mercedes-Benz S-Class. Available now in Los Angeles with a 15%
                  loyalty discount.
                </p>
                <Button variant="outline" size="sm">
                  View Offer
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
