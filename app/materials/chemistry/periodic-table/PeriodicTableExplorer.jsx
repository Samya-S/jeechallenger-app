"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Sliders, Layers, RefreshCw, X, ChevronDown } from "lucide-react";
import { periodicTableData } from "@/data/materials/periodic-table-data";
import { CATEGORIES, STATES, BLOCKS, HEATMAP_MODES } from "@/data/materials/periodic-table-explorer-constants";
import ElementDetailsModal from "./ElementDetailsModal";

const CustomDropdown = ({ value, onChange, options }) => {
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
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-48 flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 py-2 px-4 rounded-xl text-xs font-bold outline-none cursor-pointer text-gray-800 dark:text-white transition-all duration-150 ${isOpen ? "ring-2 ring-green-500/50 border-green-500" : "focus:ring-2 focus:ring-green-500/30"
          }`}
      >
        <span className="truncate mr-2">{options[value]}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-green-500" : ""
            }`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 z-30 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
          style={{
            animation: "customDropdownOpen 120ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            transformOrigin: "top right"
          }}
        >
          {/* Snap-open micro-animation stylesheet */}
          <style>{`
            @keyframes customDropdownOpen {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(-6px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
          {Object.entries(options).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onChange(key);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-gray-100/70 dark:hover:bg-gray-700/50 ${value === key
                ? "text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/20 font-extrabold"
                : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PeriodicTableExplorer() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeState, setActiveState] = useState(null);
  const [activeBlock, setActiveBlock] = useState(null);
  const [heatmapMode, setHeatmapMode] = useState("category");
  const [isMobileListMode, setIsMobileListMode] = useState(false);

  // Clear filters when heatmap mode changes
  useEffect(() => {
    setActiveCategory(null);
    setActiveState(null);
  }, [heatmapMode]);

  // Group elements into categories
  const elements = useMemo(() => periodicTableData, []);

  // Filter elements based on search, category, block
  const filteredElementMap = useMemo(() => {
    const map = {};
    elements.forEach((el) => {
      let matches = true;

      // Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const numQuery = parseInt(query);
        matches =
          el.name.toLowerCase().includes(query) ||
          el.symbol.toLowerCase().includes(query) ||
          (!isNaN(numQuery) && el.number === numQuery);
      }

      // Category filter
      if (heatmapMode === "category" && activeCategory && el.category !== activeCategory) {
        matches = false;
      }

      // State filter
      if (heatmapMode === "state" && activeState && el.state !== activeState) {
        matches = false;
      }

      // Block filter
      if (activeBlock && el.block !== activeBlock) {
        matches = false;
      }

      map[el.number] = matches;
    });
    return map;
  }, [elements, searchQuery, activeCategory, activeState, activeBlock, heatmapMode]);

  // Main table grid elements
  const mainGridElements = useMemo(() => {
    const grid = {};
    elements.forEach((el) => {
      if (el.category !== "lanthanide" && el.category !== "actinide") {
        grid[`${el.period}-${el.group}`] = el;
      }
    });
    return grid;
  }, [elements]);

  // Lanthanides row
  const lanthanides = useMemo(() => {
    return elements.filter((el) => el.category === "lanthanide");
  }, [elements]);

  // Actinides row
  const actinides = useMemo(() => {
    return elements.filter((el) => el.category === "actinide");
  }, [elements]);

  // Check if placeholders should be lit based on active filters
  const isLanthanidePlaceholderLit = useMemo(() => {
    for (let i = 57; i <= 71; i++) {
      if (filteredElementMap[i]) return true;
    }
    return false;
  }, [filteredElementMap]);

  const isActinidePlaceholderLit = useMemo(() => {
    for (let i = 89; i <= 103; i++) {
      if (filteredElementMap[i]) return true;
    }
    return false;
  }, [filteredElementMap]);

  // Get Heatmap styling color
  const getElementStyle = (el) => {
    if (!filteredElementMap[el.number]) {
      return "opacity-20 scale-95 border-dashed border-gray-200 dark:border-gray-800 pointer-events-none";
    }

    const isSelected = selectedElement?.number === el.number;
    const highlightClass = isSelected 
      ? "ring-2 ring-green-500 dark:ring-green-400 border-green-500 dark:border-green-400 shadow-xl scale-105 z-10" 
      : "";

    if (heatmapMode === "category") {
      return `${CATEGORIES[el.category].color} ${highlightClass}`;
    }

    if (heatmapMode === "state") {
      let stateColor = "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-white";
      if (el.state === "gas") stateColor = "bg-blue-500/20 dark:bg-blue-950/40 border-blue-500/50 text-blue-700 dark:text-blue-400 hover:bg-blue-500/30";
      if (el.state === "liquid") stateColor = "bg-purple-500/20 dark:bg-purple-950/40 border-purple-500/50 text-purple-700 dark:text-purple-400 hover:bg-purple-500/30";
      if (el.state === "solid") stateColor = "bg-emerald-500/20 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/30";
      return `${stateColor} ${highlightClass}`;
    }

    // Heatmaps based on normalised metrics
    const value = el.normalised[heatmapMode];
    if (value === undefined || value === null) {
      return "bg-gray-100 dark:bg-gray-800/40 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-800";
    }

    return `border border-gray-300 dark:border-gray-700 ${highlightClass}`;
  };

  const getHeatmapColorStyle = (el) => {
    if (heatmapMode === "category" || heatmapMode === "state" || !filteredElementMap[el.number]) return {};
    const value = el.normalised[heatmapMode];
    if (value === null || value === undefined) return {};

    let backgroundColor = "";
    if (heatmapMode === "electronegativity") {
      const red = Math.round(value * 255);
      const blue = Math.round((1 - value) * 255);
      backgroundColor = `rgba(${red}, 100, ${blue}, 0.25)`;
    } else if (heatmapMode === "atomicMass") {
      const red = Math.round(value * 230);
      const green = Math.round((1 - value) * 200 + 50);
      backgroundColor = `rgba(${red}, ${green}, 100, 0.25)`;
    } else if (heatmapMode === "meltingPoint") {
      const red = Math.round(value * 255);
      const green = Math.round(value * 120);
      const blue = Math.round((1 - value) * 255);
      backgroundColor = `rgba(${red}, ${green}, ${blue}, 0.25)`;
    } else if (heatmapMode === "ionisationEnergy") {
      const red = Math.round((1 - value) * 255 + value * 128);
      const green = Math.round((1 - value) * 255);
      const blue = Math.round(value * 255);
      backgroundColor = `rgba(${red}, ${green}, ${blue}, 0.25)`;
    }

    return { backgroundColor };
  };

  // Helper to render an element card button in the table grid (DRY/KISS)
  const renderElementCell = (element) => {
    return (
      <button
        key={element.number}
        onClick={() => setSelectedElement(element)}
        style={getHeatmapColorStyle(element)}
        className={`flex flex-col justify-between p-1.5 aspect-square border rounded-xl transition-all duration-300 relative group cursor-pointer ${getElementStyle(element)}`}
      >
        {/* Top Row: Atomic Number & Mass (Heatmap value if applicable) */}
        <div className="w-full flex justify-between items-start text-[8px] font-semibold text-gray-500 dark:text-gray-400">
          <span>{element.number}</span>
          <span className="text-[7px]">
            {heatmapMode !== "category" && heatmapMode !== "state" && element.normalised[heatmapMode] !== null
              ? element[heatmapMode]
              : element.mass.toFixed(1)}
          </span>
        </div>

        {/* Chemical Symbol */}
        <span className="text-sm font-black tracking-tight leading-none text-center block w-full mt-0.5">
          {element.symbol}
        </span>

        {/* Element Name */}
        <span className="text-[7px] font-bold text-center block w-full truncate leading-none mb-0.5">
          {element.name}
        </span>
      </button>
    );
  };

  // Clear filters
  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory(null);
    setActiveState(null);
    setActiveBlock(null);
    setHeatmapMode("category");
  };

  return (
    <div className="w-full text-gray-900 dark:text-white flex flex-col items-center">
      {/* Control Panel / Toolbar */}
      <div className="w-full max-w-7xl px-4 mb-8 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-center justify-between">

        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Symbol, Name or Number (e.g. Fe, Iron, 26)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Heatmap & Filter Toggles */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-center md:justify-end">
          {/* Heatmap selection */}
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Color By:</span>
            <CustomDropdown
              value={heatmapMode}
              onChange={setHeatmapMode}
              options={HEATMAP_MODES}
            />
          </div>

          {/* Block Selection */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <Layers className="w-3.5 h-3.5 text-green-500 ml-1.5" />
            <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Block:</span>
            {BLOCKS.map((block) => (
              <button
                key={block}
                onClick={() => setActiveBlock(activeBlock === block ? null : block)}
                className={`w-7 h-7 flex items-center justify-center text-xs font-black rounded-lg transition-all ${activeBlock === block
                  ? "bg-green-600 text-white shadow-md shadow-green-500/20 scale-105"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500"
                  }`}
              >
                {block}
              </button>
            ))}
          </div>

          {/* Mode Switch (Grid vs List on Mobile) */}
          <button
            onClick={() => setIsMobileListMode(!isMobileListMode)}
            className="md:hidden flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 py-2 px-3 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300"
          >
            <RefreshCw className="w-4 h-4 text-green-500" />
            <span>{isMobileListMode ? "Grid View" : "List View"}</span>
          </button>

          {/* Reset Filters */}
          {(searchQuery || activeCategory || activeState || activeBlock || heatmapMode !== "category") && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline flex items-center gap-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Legend based on Heatmap Mode */}
      <div className="w-full max-w-7xl px-4 mb-6">
        <div className="flex flex-wrap justify-center items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 min-h-[64px]">
          {heatmapMode === "category" && (
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${activeCategory === key
                    ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-500/20 scale-105"
                    : activeCategory
                      ? "opacity-30 border-gray-200 dark:border-gray-800 text-gray-400"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105"
                    }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.dot}`} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}

          {heatmapMode === "state" && (
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(STATES).map(([key, state]) => (
                <button
                  key={key}
                  onClick={() => setActiveState(activeState === key ? null : key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${activeState === key
                    ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-500/20 scale-105"
                    : activeState
                      ? "opacity-30 border-gray-200 dark:border-gray-800 text-gray-400"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105"
                    }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${state.dot}`} />
                  <span>{state.name}</span>
                </button>
              ))}
            </div>
          )}

          {["electronegativity", "atomicMass", "meltingPoint", "ionisationEnergy"].includes(heatmapMode) && (
            <div className="w-full max-w-2xl flex flex-col items-center py-2 px-4">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 capitalize tracking-wide">
                {heatmapMode === "electronegativity" ? "Electronegativity Trend Scale" :
                  heatmapMode === "atomicMass" ? "Atomic Mass Trend Scale" :
                    heatmapMode === "meltingPoint" ? "Melting Point Trend Scale" : "Ionisation Energy Trend Scale"}
              </span>
              <div className="w-full">
                {/* Solid color gradient spectrum representing transition layers */}
                <div
                  className="w-full h-4 rounded-full border border-gray-200 dark:border-gray-700 shadow-md"
                  style={{
                    background:
                      heatmapMode === "electronegativity"
                        ? "linear-gradient(to right, rgb(0, 100, 255), rgb(128, 100, 128), rgb(255, 100, 0))"
                        : heatmapMode === "atomicMass"
                          ? "linear-gradient(to right, rgb(0, 250, 100), rgb(115, 150, 100), rgb(230, 50, 100))"
                          : heatmapMode === "meltingPoint"
                            ? "linear-gradient(to right, rgb(0, 0, 255), rgb(128, 60, 128), rgb(255, 120, 0))"
                            : "linear-gradient(to right, rgb(255, 255, 0), rgb(192, 128, 128), rgb(128, 0, 255))"
                  }}
                />
                <div className="w-full flex justify-between text-[10px] font-black text-gray-500 dark:text-gray-400 mt-2 px-1">
                  <span>
                    {heatmapMode === "electronegativity" ? "0.79 (Low / Cs)" :
                      heatmapMode === "atomicMass" ? "1.0 u (Light / H)" :
                        heatmapMode === "meltingPoint" ? "-272 °C (Low / He)" : "376 kJ/mol (Low / Cs)"}
                  </span>
                  <span className="text-gray-400/80 font-normal">
                    {heatmapMode === "electronegativity" ? "Intermediate Ranges" :
                      heatmapMode === "atomicMass" ? "Medium Range" :
                        heatmapMode === "meltingPoint" ? "Moderate Temperature" : "Moderate Energy"}
                  </span>
                  <span>
                    {heatmapMode === "electronegativity" ? "3.98 (High / F)" :
                      heatmapMode === "atomicMass" ? "294 u (Heavy / Og)" :
                        heatmapMode === "meltingPoint" ? "3550 °C (High / C)" : "2372 kJ/mol (High / He)"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Periodic Table Area */}
      <div className="w-full max-w-7xl px-4 relative flex flex-col items-center mb-20">

        {/* Table Grid & Lanthanides/Actinides Row */}
        <div className={`w-full overflow-x-auto select-none custom-scrollbar pb-6 ${isMobileListMode ? "hidden" : "block"}`}>
          <div className="min-w-[1000px] flex flex-col gap-4">

            {/* Main Table Grid (18 columns, 7 rows) */}
            <div className="grid gap-1.5 p-1" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
              {Array.from({ length: 7 }, (_, rIdx) => {
                const period = rIdx + 1;
                return Array.from({ length: 18 }, (_, cIdx) => {
                  const group = cIdx + 1;
                  const key = `${period}-${group}`;
                  const element = mainGridElements[key];

                  // Render Lanthanide / Actinide Placeholder
                  if (period === 6 && group === 3) {
                    return (
                      <div
                        key="lanthanide-placeholder"
                        className={`flex flex-col items-center justify-center p-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-700 dark:text-pink-400 aspect-square text-[9px] font-black transition-all duration-300 ${
                          isLanthanidePlaceholderLit ? "" : "opacity-20 scale-95 border-dashed border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <span className="text-[10px]">57-71</span>
                        <span>La-Lu</span>
                      </div>
                    );
                  }

                  if (period === 7 && group === 3) {
                    return (
                      <div
                        key="actinide-placeholder"
                        className={`flex flex-col items-center justify-center p-1 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-700 dark:text-fuchsia-400 aspect-square text-[9px] font-black transition-all duration-300 ${
                          isActinidePlaceholderLit ? "" : "opacity-20 scale-95 border-dashed border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <span className="text-[10px]">89-103</span>
                        <span>Ac-Lr</span>
                      </div>
                    );
                  }

                  if (!element) {
                    return <div key={`empty-${key}`} className="aspect-square" />;
                  }

                  return renderElementCell(element);
                });
              })}
            </div>

            {/* Bottom Section Spacer */}
            <div className="h-4" />

            {/* Detached Lanthanides Row */}
            <div className="grid gap-1.5 p-1" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
              <div className="col-span-2 flex items-center justify-end pr-3">
                <span className="text-[9px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest">Lanthanides</span>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="w-full h-[1px] bg-pink-300 dark:bg-pink-800" />
              </div>
              {lanthanides.map(renderElementCell)}
            </div>

            {/* Detached Actinides Row */}
            <div className="grid gap-1.5 p-1" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
              <div className="col-span-2 flex items-center justify-end pr-3">
                <span className="text-[9px] font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest">Actinides</span>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <div className="w-full h-[1px] bg-fuchsia-300 dark:bg-fuchsia-800" />
              </div>
              {actinides.map(renderElementCell)}
            </div>

          </div>
        </div>

        {/* Mobile List View (Alternate Mode) */}
        <div className={`w-full ${isMobileListMode ? "flex flex-col gap-3" : "hidden"}`}>
          {elements
            .filter((el) => filteredElementMap[el.number])
            .map((el) => (
              <button
                key={el.number}
                onClick={() => setSelectedElement(el)}
                className={`w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:scale-[1.01] transition-all text-left cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center ${CATEGORIES[el.category].color}`}>
                    <span className="text-xs text-gray-500 leading-none">{el.number}</span>
                    <span className="text-base font-black leading-none mt-0.5">{el.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-none">{el.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-1 inline-block capitalize">{el.category.replace("-", " ")} ({el.block}-block)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-500 leading-none block">Mass</span>
                  <span className="text-sm font-black text-gray-800 dark:text-gray-200 leading-none mt-1 inline-block">{el.mass}</span>
                </div>
              </button>
            ))}
        </div>

        {/* Centered Modal Overlay for Element Details */}
        <ElementDetailsModal
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          CATEGORIES={CATEGORIES}
        />

      </div>
    </div>
  );
}
