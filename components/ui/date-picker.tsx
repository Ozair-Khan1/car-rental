"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string; // yyyy-mm-dd
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  className = "",
  minDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value + "T00:00:00");
    return new Date();
  });
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate position when opening
  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const dropdownHeight = 420; // approximate calendar height
      const dropdownWidth = 300;
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      let top: number;
      if (spaceAbove > dropdownHeight || spaceAbove > spaceBelow) {
        // Open above
        top = rect.top + window.scrollY - dropdownHeight - 8;
      } else {
        // Open below
        top = rect.bottom + window.scrollY + 8;
      }

      let left = rect.left + window.scrollX;
      // Prevent overflow off the right edge
      if (left + dropdownWidth > window.innerWidth - 16) {
        left = window.innerWidth - dropdownWidth - 16;
      }
      // Prevent overflow off the left edge
      if (left < 16) left = 16;

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = useCallback(() => {
    setViewDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const nextMonth = useCallback(() => {
    setViewDate(new Date(year, month + 1, 1));
  }, [year, month]);

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean; date: Date }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({ day: d, current: false, date: new Date(year, month - 1, d) });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, date: new Date(year, month, d) });
  }
  // Next month leading days — fill to complete rows
  const totalRows = Math.ceil(cells.length / 7);
  const remaining = totalRows * 7 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false, date: new Date(year, month + 1, d) });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const minDateObj = minDate ? new Date(minDate + "T00:00:00") : null;

  const isDisabled = (date: Date) => {
    if (minDateObj) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d < minDateObj;
    }
    return false;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isToday = (date: Date) => isSameDay(date, today);

  const handleSelect = (date: Date) => {
    if (isDisabled(date)) return;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const formatDisplay = (val: string) => {
    if (!val) return "";
    const [y, m, d] = val.split("-");
    return `${d}/${m}/${y}`;
  };

  const calendarDropdown = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "absolute", top: position.top, left: position.left, zIndex: 9999 }}
          className="bg-[var(--surface)] border-2 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--shadow-color)] p-4 w-[300px] select-none"
        >
          {/* Header: month/year + nav arrows */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center border-2 border-[var(--border)] hover:bg-[var(--btn-primary-bg)] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-display text-lg uppercase tracking-wider">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center border-2 border-[var(--border)] hover:bg-[var(--btn-primary-bg)] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-bold uppercase tracking-wider py-1 opacity-50"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-0">
            {cells.map((cell, i) => {
              const selected = selectedDate && isSameDay(cell.date, selectedDate);
              const todayCell = isToday(cell.date);
              const disabled = !cell.current || isDisabled(cell.date);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(cell.date)}
                  className={`
                    w-full aspect-square flex items-center justify-center text-[13px] font-medium transition-all relative
                    ${disabled ? "opacity-30 cursor-default" : "cursor-pointer hover:bg-[var(--btn-primary-bg)] hover:text-black"}
                    ${selected ? "bg-[var(--btn-primary-bg)] text-black font-bold shadow-[2px_2px_0px_0px_var(--shadow-color)] border-2 border-[var(--border)]" : ""}
                    ${todayCell && !selected ? "border-2 border-[var(--border)] font-bold" : ""}
                    ${!selected && !todayCell ? "border border-transparent" : ""}
                  `}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex justify-between mt-3 pt-3 border-t-2 border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="text-[12px] font-bold uppercase tracking-wider hover:text-[var(--btn-primary-bg)] transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleSelect(today)}
              className="text-[12px] font-bold uppercase tracking-wider bg-[var(--btn-primary-bg)] text-black px-3 py-1 border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--shadow-color)] transition-all"
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!isOpen && value) setViewDate(new Date(value + "T00:00:00"));
          setIsOpen(!isOpen);
        }}
        className="input-field w-full text-left flex items-center justify-between gap-2 cursor-pointer"
      >
        <span className={value ? "" : "opacity-50"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
          <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5" y1="1.5" x2="5" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="11" y1="1.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {calendarDropdown}
    </div>
  );
}
