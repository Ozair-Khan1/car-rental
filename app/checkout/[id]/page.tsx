"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, MapPin, Calendar, CreditCard, Shield } from "lucide-react";
import { mockVehicles, mockOwners } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const vehicle = mockVehicles.find(v => v.id === params.id);
  const owner = vehicle ? mockOwners.find(o => o.id === vehicle.ownerId) : undefined;
  
  // Very simplified mock state for the steps
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!vehicle) {
    return <div className="pt-32 text-center">Vehicle not found</div>;
  }

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      router.push('/booking/confirmation');
    }, 1500);
  };

  return (
    <div className="pt-24 pb-24 bg-[var(--background)] min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-h2 mb-8">Complete your booking</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Checkout Steps */}
          <div className="flex-1">
            
            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
              {['Trip Details', 'Protection', 'Extras', 'Payment'].map((label, idx) => (
                <React.Fragment key={label}>
                  <div className={`flex items-center gap-2 whitespace-nowrap ${step >= idx + 1 ? 'text-[var(--foreground)]' : 'text-[var(--text-muted)]'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > idx + 1 ? 'bg-[var(--success)] text-white' : step === idx + 1 ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--border-color)] text-[var(--text-muted)]'}`}>
                      {step > idx + 1 ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                  {idx < 3 && <ChevronRight size={16} className="text-[var(--border-color)] flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Trip Details */}
            {step === 1 && (
              <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold mb-6">Driver Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium mb-1 block">First Name</label>
                    <Input defaultValue="Ozair" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Last Name</label>
                    <Input defaultValue="Ahmed" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Email Address</label>
                    <Input defaultValue="ozair@example.com" type="email" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Phone Number</label>
                    <Input defaultValue="+1 (555) 000-0000" type="tel" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>Continue to Protection</Button>
                </div>
              </div>
            )}

            {/* Step 2: Protection (Simplified) */}
            {step === 2 && (
              <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold mb-6">Choose your protection</h3>
                <div className="flex flex-col gap-4 mb-8">
                  <label className="border border-[var(--accent)] bg-[var(--accent)]/5 rounded-lg p-4 flex gap-4 cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-lg">Recommended</div>
                    <input type="radio" name="protection" defaultChecked className="mt-1" />
                    <div>
                      <h4 className="font-bold flex items-center gap-2">Premium Coverage <Shield size={16} className="text-[var(--accent)]" /></h4>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">$0 Deductible. Complete peace of mind.</p>
                      <p className="text-sm font-bold mt-2">+$45 / day</p>
                    </div>
                  </label>
                  <label className="border border-[var(--border-color)] hover:border-[var(--text-muted)] rounded-lg p-4 flex gap-4 cursor-pointer transition-colors">
                    <input type="radio" name="protection" className="mt-1" />
                    <div>
                      <h4 className="font-bold">Basic Coverage</h4>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">$1,000 Deductible. Required by law.</p>
                      <p className="text-sm font-bold mt-2">Included</p>
                    </div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)}>Continue to Extras</Button>
                </div>
              </div>
            )}

            {/* Step 3: Extras (Simplified) */}
            {step === 3 && (
              <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold mb-6">Optional Extras</h3>
                <div className="flex flex-col gap-4 mb-8">
                  <label className="border border-[var(--border-color)] rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-[var(--text-muted)] transition-colors">
                    <div>
                      <h4 className="font-bold">Additional Driver</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Share the driving.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">+$12/day</span>
                      <input type="checkbox" className="w-5 h-5 rounded border-[var(--border-color)]" />
                    </div>
                  </label>
                  <label className="border border-[var(--border-color)] rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-[var(--text-muted)] transition-colors">
                    <div>
                      <h4 className="font-bold">Prepaid Fuel</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Return empty.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">+$65</span>
                      <input type="checkbox" className="w-5 h-5 rounded border-[var(--border-color)]" />
                    </div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={() => setStep(4)}>Continue to Payment</Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="bg-[var(--surface-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold mb-6">Payment Method</h3>
                <div className="mb-6">
                  <div className="border border-[var(--border-color)] rounded-lg p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-[var(--text-secondary)]" />
                      <div>
                        <p className="font-semibold text-sm">•••• •••• •••• 4242</p>
                        <p className="text-xs text-[var(--text-muted)]">Expires 12/28</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full border-[5px] border-[var(--accent)]"></div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-dashed">
                    + Add New Card
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
                  <Button onClick={handleConfirm} disabled={isProcessing} className="w-40">
                    {isProcessing ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            )}
            
          </div>

        {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-[100px] bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[var(--radius-xl)] shadow-sm overflow-hidden">
              <div className="relative h-48 w-full bg-black/5">
                <Image 
                  src={vehicle.images[0]}
                  alt={vehicle.model}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-6 border-b border-[var(--border-color)] pb-6">
                  <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider mb-1">Hosted by {owner?.name}</p>
                  <h3 className="text-xl font-bold">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">{vehicle.category} • {vehicle.transmission}</p>
                </div>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex gap-3">
                    <MapPin size={18} className="text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--foreground)]">Pick-up</p>
                      <p className="text-[var(--text-secondary)]">San Francisco Int. Airport</p>
                      <p className="text-[var(--text-muted)] text-xs">Oct 24, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={18} className="text-[var(--text-muted)] flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[var(--foreground)]">Drop-off</p>
                      <p className="text-[var(--text-secondary)]">San Francisco Int. Airport</p>
                      <p className="text-[var(--text-muted)] text-xs">Oct 27, 10:00 AM</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t border-[var(--border-color)] text-sm">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>${vehicle.dailyPrice} × 3 days</span>
                    <span>${vehicle.dailyPrice * 3}</span>
                  </div>
                  {step >= 3 && (
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Premium Protection</span>
                      <span>$135</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1 cursor-help underline decoration-dashed">Platform fee</span>
                    <span>$28</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Taxes</span>
                    <span>$41</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-[var(--border-color)]">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold">${(vehicle.dailyPrice * 3) + 28 + 41 + (step >= 3 ? 135 : 0)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
