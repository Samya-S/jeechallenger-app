"use client";
import React from "react";
import { X, Zap } from "lucide-react";

export default function ElementDetailsModal({ selectedElement, setSelectedElement, CATEGORIES }) {
  if (!selectedElement) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={() => setSelectedElement(null)}
      style={{
        animation: "modalFadeIn 140ms ease-out forwards"
      }}
    >
      {/* Modal Box */}
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalZoomIn 140ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          maxHeight: "90vh"
        }}
      >
        {/* snap-open zoom keyframes */}
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalZoomIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(6px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setSelectedElement(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-gray-900/10 hover:bg-gray-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Glowing Visual Card */}
        <div 
          className={`w-full md:w-64 p-8 flex flex-col justify-between items-center text-center text-white shrink-0 relative overflow-hidden bg-gradient-to-br ${
            CATEGORIES[selectedElement.category]?.gradient || "from-gray-500 to-slate-700"
          }`}
        >
          {/* Background decorative ring */}
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white/5 pointer-events-none" />

          {/* Atomic Number */}
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm tracking-tight border border-white/20">
            {selectedElement.number}
          </div>

          {/* Main symbol display */}
          <div className="my-6">
            <span className="text-6xl font-black tracking-tighter drop-shadow-md leading-none block">
              {selectedElement.symbol}
            </span>
            <span className="text-xl font-bold tracking-tight mt-2 block opacity-90">
              {selectedElement.name}
            </span>
          </div>

          {/* Block and State Pill indicators */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
              {selectedElement.block}-block
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 capitalize">
              {selectedElement.state}
            </span>
          </div>
        </div>

        {/* Right Column: Properties Details & JEE Section */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] md:max-h-[500px] custom-scrollbar flex flex-col justify-between">
          <div>
            {/* Category Title */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2.5 h-2.5 rounded-full ${CATEGORIES[selectedElement.category]?.dot || "bg-gray-500"}`} />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {selectedElement.category.replace("-", " ")}
              </span>
            </div>

            {/* JEE High Yield Notes Glow Box */}
            {selectedElement.jeeNote && (
              <div className="mb-6 p-4 bg-gradient-to-br from-green-50/50 to-teal-50/50 dark:from-green-950/20 dark:to-teal-950/20 border border-green-200 dark:border-green-900/50 rounded-2xl relative shadow-inner">
                <div className="absolute top-0 right-0 p-1.5 bg-green-600 text-white rounded-bl-2xl">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <h4 className="text-xs font-black text-green-700 dark:text-green-400 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
                  JEE High Yield Notes
                </h4>
                <p className="text-xs text-green-900 dark:text-green-300 leading-relaxed font-semibold">
                  {selectedElement.jeeNote}
                </p>
              </div>
            )}

            {/* Atomic Properties Grid */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">Properties Scan</h3>
              
              <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Atomic Mass</span>
                  <span className="text-xs font-black tracking-tight">{selectedElement.mass} u</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Electronegativity</span>
                  <span className="text-xs font-black tracking-tight">{selectedElement.electronegativity !== null ? selectedElement.electronegativity : "N/A"}</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">1st Ionisation Energy</span>
                  <span className="text-xs font-black tracking-tight">{selectedElement.ionisationEnergy ? `${selectedElement.ionisationEnergy} kJ/mol` : "N/A"}</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Melting Point</span>
                  <span className="text-xs font-black tracking-tight">{selectedElement.meltingPoint !== null ? `${selectedElement.meltingPoint} °C` : "N/A"}</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 col-span-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Electron Configuration</span>
                  <span className="text-xs font-black font-mono tracking-tight text-green-600 dark:text-green-400 mt-0.5 block">{selectedElement.config}</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 col-span-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Oxidation States</span>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                    {selectedElement.oxidationStates.map((state) => (
                      <span key={state} className="bg-white dark:bg-gray-800 px-2 py-0.5 border border-gray-200 dark:border-gray-700 text-[10px] font-black rounded-lg">
                        {state}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Period / Group</span>
                  <span className="text-xs font-black tracking-tight">Period {selectedElement.period} / Group {selectedElement.group !== null ? selectedElement.group : "N/A"}</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Boiling Point</span>
                  <span className="text-xs font-black tracking-tight">{selectedElement.boilingPoint !== null ? `${selectedElement.boilingPoint} °C` : "N/A"}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
