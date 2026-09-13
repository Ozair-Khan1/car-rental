import React from "react";
import Link from "next/link";
import { LayoutDashboard, Car, Calendar, DollarSign, MessageCircle, Star, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Overview", href: "/host", icon: LayoutDashboard },
  { name: "My Vehicles", href: "/host/vehicles", icon: Car },
  { name: "Bookings", href: "/host/bookings", icon: Calendar },
  { name: "Earnings", href: "/host/earnings", icon: DollarSign },
  { name: "Messages", href: "/host/messages", icon: MessageCircle },
  { name: "Reviews", href: "/host/reviews", icon: Star },
  { name: "Settings", href: "/host/settings", icon: Settings },
];

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex pt-[72px]">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border-color)] bg-[var(--surface)] h-[calc(100vh-72px)] sticky top-[72px]">
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-lg">
              M
            </div>
            <div>
              <p className="font-bold text-[var(--foreground)]">Michael T.</p>
              <p className="text-xs text-[var(--text-muted)]">Host Account</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] transition-colors"
              >
                <Icon size={18} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--border-color)]">
          <Button variant="ghost" className="w-full justify-start text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10">
            <LogOut size={18} className="mr-3" />
            Switch to Renter
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-color)]">
            <div>
              <p className="font-bold text-[var(--foreground)]">Host Dashboard</p>
            </div>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
}
