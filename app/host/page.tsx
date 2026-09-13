import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HostOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-h2">Welcome back, Michael</h1>
          <p className="text-[var(--text-secondary)] mt-1">Here's what's happening with your vehicles today.</p>
        </div>
        <Button asChild>
          <Link href="/host/vehicles/new">+ List New Vehicle</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-sm font-medium mb-2">Pending Requests</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold">3</h3>
            <span className="flex items-center text-sm font-medium text-[var(--error)] mb-1">
              Requires attention
            </span>
          </div>
        </div>
        
        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-sm font-medium mb-2">Active Trips</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold">2</h3>
            <span className="flex items-center text-sm font-medium text-[var(--text-muted)] mb-1">
              Currently on road
            </span>
          </div>
        </div>

        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-sm font-medium mb-2">Monthly Earnings</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold">$2,450</h3>
            <span className="flex items-center text-sm font-medium text-[var(--success)] mb-1">
              <ArrowUpRight size={16} /> +15%
            </span>
          </div>
        </div>

        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-sm font-medium mb-2">Response Rate</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold">98%</h3>
            <span className="flex items-center text-sm font-medium text-[var(--success)] mb-1">
              Excellent
            </span>
          </div>
        </div>
      </div>

      {/* Pending Booking Requests */}
      <div className="mt-12">
        <h2 className="text-h3 mb-6 flex items-center gap-2">
          Action Required
          <span className="bg-[var(--error)] text-white text-xs px-2 py-0.5 rounded-full">3</span>
        </h2>
        
        <div className="bg-[var(--surface-elevated)] rounded-[var(--radius-lg)] border border-[var(--border-color)] overflow-hidden">
          <div className="divide-y divide-[var(--border-color)]">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[var(--background)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center font-bold text-[var(--text-secondary)]">
                    U{item}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)]">BMW X5 requested by Alex</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-2">
                      <Clock size={14} className="text-[var(--text-muted)]" /> 
                      Oct 24, 10:00 AM — Oct 27, 10:00 AM (3 days)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="font-bold text-[var(--foreground)]">${129 * 3 - (129 * 3 * 0.15)}</p>
                    <p className="text-xs text-[var(--text-muted)]">Your payout</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-[var(--error)] border-[var(--error)]/20 hover:bg-[var(--error)]/10">
                      Decline
                    </Button>
                    <Button size="sm" className="bg-[var(--success)] hover:bg-[var(--success)]/90 text-white">
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
