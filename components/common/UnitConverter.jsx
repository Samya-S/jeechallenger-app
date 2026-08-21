"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeftRight, Activity, ChevronDown } from "lucide-react";

import { conversionData } from "@/data/resources/unit-conversion-data";

const CustomDropdown = ({ value, onChange, options, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mt-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-2 p-3 outline-none transition-colors ${theme.focusRing}`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${value === opt
                ? `${theme.activeOptionBg} ${theme.text} font-semibold`
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function UnitConverter({ subject = "physics" }) {
  
  // Define subject configurations
  const subjectConfig = useMemo(() => {
    switch (subject.toLowerCase()) {
      case "chemistry":
        return {
          themeColor: "green",
          categories: ["Mass", "Temperature", "Pressure", "Volume", "Density", "Energy", "Molarity", "Dipole Moment", "Radioactivity", "Frequency"]
        };
      case "mathematics":
        return {
          themeColor: "purple",
          categories: ["Length", "Area", "Volume", "Angle", "Solid Angle", "Time", "Velocity", "Angular Velocity", "Proportion"]
        };
      case "physics":
      default:
        return {
          themeColor: "blue",
          categories: ["Length", "Mass", "Time", "Velocity", "Angle", "Angular Velocity", "Solid Angle", "Temperature", "Force", "Energy", "Power", "Pressure", "Density", "Charge", "Magnetic Field", "Magnetic Flux", "Capacitance", "Radioactivity", "Frequency"]
        };
    }
  }, [subject]);

  // Theme tokens
  const theme = useMemo(() => {
    switch (subjectConfig.themeColor) {
      case "emerald":
      case "green":
        return {
          bg: "bg-emerald-600",
          text: "text-emerald-600 dark:text-emerald-400",
          shadow: "shadow-emerald-500/20",
          focusRing: "focus:ring-emerald-500 focus:border-emerald-500",
          swapBg: "bg-emerald-50 dark:bg-emerald-900/20",
          swapHover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
          footerBg: "bg-emerald-50/50 dark:bg-emerald-900/10",
          footerBorder: "border-emerald-100 dark:border-emerald-800/30",
          activeOptionBg: "bg-emerald-50 dark:bg-emerald-900/40",
        };
      case "purple":
        return {
          bg: "bg-purple-600",
          text: "text-purple-600 dark:text-purple-400",
          shadow: "shadow-purple-500/20",
          focusRing: "focus:ring-purple-500 focus:border-purple-500",
          swapBg: "bg-purple-50 dark:bg-purple-900/20",
          swapHover: "hover:bg-purple-100 dark:hover:bg-purple-900/40",
          footerBg: "bg-purple-50/50 dark:bg-purple-900/10",
          footerBorder: "border-purple-100 dark:border-purple-800/30",
          activeOptionBg: "bg-purple-50 dark:bg-purple-900/40",
        };
      default: // blue
        return {
          bg: "bg-blue-600",
          text: "text-blue-600 dark:text-blue-400",
          shadow: "shadow-blue-500/20",
          focusRing: "focus:ring-blue-500 focus:border-blue-500",
          swapBg: "bg-blue-50 dark:bg-blue-900/20",
          swapHover: "hover:bg-blue-100 dark:hover:bg-blue-900/40",
          footerBg: "bg-blue-50/50 dark:bg-blue-900/10",
          footerBorder: "border-blue-100 dark:border-blue-800/30",
          activeOptionBg: "bg-blue-50 dark:bg-blue-900/40",
        };
    }
  }, [subjectConfig.themeColor]);

  // Derived categories
  const categories = useMemo(() => {
    const all = Object.keys(conversionData);
    const allowed = subjectConfig.categories;
    return all.filter(c => allowed.includes(c));
  }, [subjectConfig]);

  const [category, setCategory] = useState(categories[0] || "Length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [inputValue, setInputValue] = useState("1");
  const [outputValue, setOutputValue] = useState("");

  // Update default units when category changes
  useEffect(() => {
    if (!category || !conversionData[category]) return;
    const units = Object.keys(conversionData[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);


  useEffect(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setOutputValue("");
      return;
    }

    if (!category || !conversionData[category]) return;

    const fromData = conversionData[category].units[fromUnit];
    const toData = conversionData[category].units[toUnit];

    if (!fromData || !toData) {
      setOutputValue("");
      return;
    }

    const baseValue = (val + fromData.c) * fromData.m;
    const finalValue = (baseValue / toData.m) - toData.c;

    // Format to avoid super long decimals but keep scientific notation if very small/large
    if (finalValue === 0) {
      setOutputValue("0");
    } else if (Math.abs(finalValue) < 1e-6 || Math.abs(finalValue) > 1e6) {
      setOutputValue(finalValue.toExponential(4).replace(/\+/, ""));
    } else {
      setOutputValue(parseFloat(finalValue.toPrecision(7)).toString());
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  if (!category) return null;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">

        {/* Category Tabs */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-b border-gray-100 dark:border-gray-700 rounded-t-3xl">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${category === cat
                  ? `${theme.bg} text-white shadow-md ${theme.shadow} scale-105`
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Converter Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">

            {/* FROM Column */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">From</label>
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`w-full text-3xl font-bold bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:ring-0 ${theme.focusRing.split(' ')[1]} transition-colors p-0 pb-2 text-gray-900 dark:text-white`}
                  placeholder="0"
                />
              </div>
              <CustomDropdown
                value={fromUnit}
                onChange={setFromUnit}
                options={Object.keys(conversionData[category].units)}
                theme={theme}
              />
            </div>

            {/* SWAP Button */}
            <div className="flex justify-center md:pt-6">
              <button
                onClick={handleSwap}
                className={`p-4 rounded-full ${theme.swapBg} ${theme.text} ${theme.swapHover} transition-colors group`}
              >
                <ArrowLeftRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* TO Column */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">To</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={outputValue}
                  className={`w-full text-3xl font-bold bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:ring-0 ${theme.focusRing.split(' ')[1]} transition-colors p-0 pb-2 ${theme.text}`}
                  placeholder="0"
                />
              </div>
              <CustomDropdown
                value={toUnit}
                onChange={setToUnit}
                options={Object.keys(conversionData[category].units)}
                theme={theme}
              />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className={`${theme.footerBg} p-4 text-center border-t ${theme.footerBorder} flex items-center justify-center gap-2 rounded-b-3xl`}>
          <Activity className={`w-4 h-4 ${theme.text.split(' ')[0]}`} />
          <span className={`text-sm ${theme.text}`}>
            Instant, high-precision scientific conversions
          </span>
        </div>
      </div>
    </div>
  );
}
