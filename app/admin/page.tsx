import React from "react";
import { ArrowUpRight, ArrowDownRight, DollarSign, CarFront, CalendarDays, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOverview() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-[var(--text-secondary)]">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Download Report</Button>
          <Button>Add Vehicle</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Gross Booking Value */}
        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium mb-1">Gross Booking Value</p>
              <h3 className="text-2xl font-bold">$428,500</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-emerald-500 flex items-center"><ArrowUpRight size={16} /> 18.2%</span>
            <span className="text-[var(--text-muted)]">vs last month</span>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium mb-1">Platform Revenue</p>
              <h3 className="text-2xl font-bold">$64,275</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-emerald-500 flex items-center"><ArrowUpRight size={16} /> 15.4%</span>
            <span className="text-[var(--text-muted)]">15% Take Rate</span>
          </div>
        </div>

        {/* Active Hosts */}
        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium mb-1">Active Hosts</p>
              <h3 className="text-2xl font-bold">1,204</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <CarFront size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-emerald-500 flex items-center"><ArrowUpRight size={16} /> 8.1%</span>
            <span className="text-[var(--text-muted)]">vs last month</span>
          </div>
        </div>

        {/* Active Renters */}
        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium mb-1">Active Renters</p>
              <h3 className="text-2xl font-bold">8,450</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-emerald-500 flex items-center"><ArrowUpRight size={16} /> 12.3%</span>
            <span className="text-[var(--text-muted)]">vs last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placeholder for Charts */}
        <div className="lg:col-span-2 bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] min-h-[400px] flex flex-col">
          <h3 className="font-bold text-lg mb-6">Revenue Overview</h3>
          <div className="flex-1 border border-dashed border-[var(--border-color)] rounded-md flex items-center justify-center text-[var(--text-muted)]">
            Chart visualization would go here
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recent Bookings</h3>
            <button className="text-sm text-[var(--accent)] hover:underline">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center border-b border-[var(--border-color)] last:border-0 pb-4 last:pb-0">
                <div>
                  <p className="font-semibold text-sm">BMW X5</p>
                  <p className="text-xs text-[var(--text-muted)]">Ozair Ahmed • Oct 24 - 27</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">$591</p>
                  <span className="px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] text-[10px] font-bold rounded-full uppercase">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
