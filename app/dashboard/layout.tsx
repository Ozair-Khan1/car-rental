"use client";
import React from "react";
import Link from "next/link";
import {
  User,
  CalendarCheck,
  Heart,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const handleLoguout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Dashboard Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-[var(--surface-elevated)] rounded-[var(--radius-xl)] border border-[var(--border-color)] overflow-hidden sticky top-[100px]">
              <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-4">
                <div className="w-auto h-auto text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    session?.user?.name?.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-bold leading-tight w-auto">
                    {session?.user?.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Premium Member
                  </p>
                </div>
              </div>

              <nav className="p-4 flex flex-col gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                >
                  <User size={18} /> Overview
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                >
                  <CalendarCheck size={18} /> My Bookings
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                >
                  <Heart size={18} /> Favorites
                </Link>
                <Link
                  href="/dashboard/payment"
                  className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                >
                  <CreditCard size={18} /> Payment Methods
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                >
                  <Bell size={18} /> Notifications
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                >
                  <Settings size={18} /> Settings
                </Link>
              </nav>

              <div className="p-4 border-t border-[var(--border-color)]">
                <button
                  className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-[var(--radius-md)] text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
                  onClick={handleLoguout}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
