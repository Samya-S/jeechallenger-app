"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

const COLOR_THEMES = {
  orange: {
    borderOpen: "border-orange-500 ring-1 ring-orange-500",
    chevronOpen: "text-orange-500",
    searchRing: "focus:ring-orange-500",
    selectedItem: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
    checkIcon: "text-orange-600 dark:text-orange-400",
  },
  blue: {
    borderOpen: "border-blue-500 ring-1 ring-blue-500",
    chevronOpen: "text-blue-500",
    searchRing: "focus:ring-blue-500",
    selectedItem: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    checkIcon: "text-blue-600 dark:text-blue-400",
  },
};

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchable = false,
  searchPlaceholder = "Search options...",
  icon: Icon,
  className = "",
  disabled = false,
  size = "md",
  color = "orange",
}) {
  const theme = COLOR_THEMES[color] || COLOR_THEMES.orange;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable && searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const padClass = size === "sm" ? "px-3 py-1.5 rounded-lg text-xs" : "px-4 py-2.5 rounded-xl text-sm";

  return (
    <div ref={containerRef} className={`relative ${isOpen ? "z-30" : "z-0"} ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 ${padClass} bg-gray-50 dark:bg-gray-800/80 border text-left transition-colors ${
          disabled
            ? "border-gray-200 dark:border-gray-700 opacity-75 cursor-default"
            : isOpen
            ? `${theme.borderOpen} bg-white dark:bg-gray-800 cursor-pointer`
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
          <span
            className={`truncate font-medium ${
              selectedOption
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
            isOpen ? `rotate-180 ${theme.chevronOpen}` : ""
          }`}
        />
      </button>

      {/* Dropdown Menu - Instant with zero animation delay */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Optional Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${theme.searchRing}`}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-transparent">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isSelected
                        ? `${theme.selectedItem} font-semibold`
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 ${theme.checkIcon} shrink-0`} />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
