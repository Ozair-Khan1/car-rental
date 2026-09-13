import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  CarFront, 
  CalendarDays, 
  Users, 
  MapPinned, 
  Percent,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[var(--surface-elevated)] border-r border-[var(--border-color)] flex flex-col flex-shrink-0 fixed h-full z-40">
        <div className="p-6 border-b border-[var(--border-color)]">
          <Link href="/admin" className="text-2xl font-bold tracking-tight">DriveNow <span className="text-[var(--accent)] text-sm uppercase tracking-widest ml-1">Admin</span></Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-4">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 mt-4 px-3">Management</p>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] font-medium">
              <LayoutDashboard size={18} /> Overview
            </Link>
            <Link href="/admin/vehicles" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors">
              <CarFront size={18} /> Vehicles
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors">
              <CalendarDays size={18} /> Bookings
            </Link>
            <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors">
              <Users size={18} /> Customers
            </Link>
            <Link href="/admin/locations" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors">
              <MapPinned size={18} /> Locations
            </Link>
            
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 mt-6 px-3">Business</p>
            <Link href="/admin/deals" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors">
              <Percent size={18} /> Pricing & Deals
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors">
              <MessageSquare size={18} /> Reviews
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors">
              <BarChart3 size={18} /> Analytics
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-[var(--border-color)]">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors mb-2">
            <Settings size={18} /> Settings
          </Link>
          <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors">
            <LogOut size={18} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
      
    </div>
  );
}
