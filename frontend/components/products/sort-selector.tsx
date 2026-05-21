"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown, TrendingDown, TrendingUp, Type, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type SortValue = "price_asc" | "price_desc" | "name_asc" | "newest" | "rating_desc";

export const SORT_OPTIONS: Array<{
  value: SortValue;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "newest", label: "Newest", icon: <Sparkles className="size-4" /> },
  { value: "price_asc", label: "Price: Low to High", icon: <TrendingDown className="size-4" /> },
  { value: "price_desc", label: "Price: High to Low", icon: <TrendingUp className="size-4" /> },
  { value: "name_asc", label: "Name: A-Z", icon: <Type className="size-4" /> },
  { value: "rating_desc", label: "Rating: High to Low", icon: <ArrowUpDown className="size-4" /> },
];

type SortSelectorProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export function SortSelector({ value, onChange }: SortSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);
  const selectedLabel = selectedOption?.label || "Sort";
  const selectedIcon = selectedOption?.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current !== null && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen === true) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg transition-all duration-200 border-0"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-300 ${isOpen === true ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen === true && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
          <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-4 py-3 border-b border-neutral-200">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">Sort by</p>
          </div>
          <div className="py-1">
            {SORT_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3.5 text-left text-xs font-medium uppercase tracking-[0.11em] transition-all duration-200 relative group ${
                  value === option.value
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                } ${index !== SORT_OPTIONS.length - 1 ? "border-b border-neutral-100" : ""}`}
              >
                <span
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    value === option.value ? "scale-110" : "group-hover:scale-105"
                  }`}
                >
                  {option.icon}
                </span>
                <span className="flex-1">{option.label}</span>
                {value === option.value && (
                  <span className="flex-shrink-0 ml-2 text-xs font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
