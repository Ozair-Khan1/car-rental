import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit3, Settings, AlertCircle, ToggleRight, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVehicles } from "@/lib/mock-data";

export default function HostVehiclesPage() {
  // Assume owner-1 is logged in for mock purposes
  const myVehicles = mockVehicles.filter(v => v.ownerId === 'owner-1');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-h2">My Vehicles</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your fleet, pricing, and availability.</p>
        </div>
        <Button asChild>
          <Link href="/host/vehicles/new"><Plus size={18} className="mr-2" /> Add Vehicle</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {myVehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-xl)] overflow-hidden flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-[240px] h-[200px] sm:h-auto bg-[var(--background)]">
              <Image 
                src={vehicle.images[0]} 
                alt={vehicle.model}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge variant={vehicle.availability === 'Available' ? 'success' : 'secondary'} className={vehicle.availability === 'Available' ? 'bg-[var(--success)] text-white' : ''}>
                  {vehicle.availability}
                </Badge>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold">{vehicle.brand} {vehicle.model}</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--text-muted)] hover:text-[var(--foreground)]">
                    <Edit3 size={16} />
                  </Button>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">{vehicle.year} • {vehicle.category}</p>
                
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <div>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-0.5">Daily Rate</p>
                    <p className="font-semibold">${vehicle.dailyPrice}/day</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-0.5">Location</p>
                    <p className="font-semibold truncate">SFO Airport</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-2 cursor-pointer group">
                  {vehicle.availability === 'Available' ? (
                    <ToggleRight size={24} className="text-[var(--success)]" />
                  ) : (
                    <ToggleLeft size={24} className="text-[var(--text-muted)] group-hover:text-[var(--foreground)]" />
                  )}
                  <span className="text-sm font-medium select-none">Listing Active</span>
                </div>
                
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings size={14} /> Manage
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new placeholder */}
        <div className="bg-[var(--background)] border-2 border-dashed border-[var(--border-color)] rounded-[var(--radius-xl)] flex flex-col items-center justify-center p-12 text-center hover:border-[var(--text-muted)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer min-h-[240px]">
          <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center mb-4">
            <Plus size={24} className="text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-xl font-bold mb-2">List another vehicle</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs">Earn more by adding more vehicles to your fleet.</p>
        </div>
      </div>

    </div>
  );
}
