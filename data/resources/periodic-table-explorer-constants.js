export const CATEGORIES = {
  "alkali-metal": { name: "Alkali Metals", color: "bg-red-500/20 dark:bg-red-950/40 border-red-500/50 text-red-700 dark:text-red-400 hover:bg-red-500/30", dot: "bg-red-500", gradient: "from-red-500 via-red-600 to-red-800" },
  "alkaline-earth-metal": { name: "Alkaline Earth", color: "bg-orange-500/20 dark:bg-orange-950/40 border-orange-500/50 text-orange-700 dark:text-orange-400 hover:bg-orange-500/30", dot: "bg-orange-500", gradient: "from-orange-500 via-orange-600 to-amber-700" },
  "transition-metal": { name: "Transition Metals", color: "bg-yellow-500/20 dark:bg-yellow-950/40 border-yellow-500/50 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30", dot: "bg-yellow-500", gradient: "from-amber-500 via-yellow-600 to-yellow-800" },
  "post-transition-metal": { name: "Post-Transition", color: "bg-green-500/20 dark:bg-green-950/40 border-green-500/50 text-green-700 dark:text-green-400 hover:bg-green-500/30", dot: "bg-green-500", gradient: "from-green-500 via-emerald-600 to-teal-850" },
  "metalloid": { name: "Metalloids", color: "bg-emerald-500/20 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/30", dot: "bg-emerald-500", gradient: "from-emerald-600 via-teal-600 to-cyan-800" },
  "reactive-nonmetal": { name: "Nonmetals", color: "bg-blue-500/20 dark:bg-blue-950/40 border-blue-500/50 text-blue-700 dark:text-blue-400 hover:bg-blue-500/30", dot: "bg-blue-500", gradient: "from-blue-500 via-indigo-600 to-violet-800" },
  "halogen": { name: "Halogens", color: "bg-indigo-500/20 dark:bg-indigo-950/40 border-indigo-500/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/30", dot: "bg-indigo-500", gradient: "from-indigo-500 via-purple-600 to-fuchsia-800" },
  "noble-gas": { name: "Noble Gases", color: "bg-purple-500/20 dark:bg-purple-950/40 border-purple-500/50 text-purple-700 dark:text-purple-400 hover:bg-purple-500/30", dot: "bg-purple-500", gradient: "from-purple-500 via-fuchsia-600 to-pink-800" },
  "lanthanide": { name: "Lanthanides", color: "bg-pink-500/20 dark:bg-pink-950/40 border-pink-500/50 text-pink-700 dark:text-pink-400 hover:bg-pink-500/30", dot: "bg-pink-500", gradient: "from-pink-500 via-rose-600 to-red-700" },
  "actinide": { name: "Actinides", color: "bg-fuchsia-500/20 dark:bg-fuchsia-950/40 border-fuchsia-500/50 text-fuchsia-700 dark:text-fuchsia-400 hover:bg-fuchsia-500/30", dot: "bg-fuchsia-500", gradient: "from-fuchsia-500 via-pink-600 to-rose-800" },
  "unknown": { name: "Unknown", color: "bg-gray-500/20 dark:bg-gray-800 border-gray-500/50 text-gray-700 dark:text-gray-400 hover:bg-gray-500/30", dot: "bg-gray-500", gradient: "from-gray-500 to-slate-700" }
};

export const HEATMAP_MODES = {
  category: "Standard Category",
  electronegativity: "Electronegativity",
  atomicMass: "Atomic Mass",
  meltingPoint: "Melting Point",
  ionisationEnergy: "1st Ionisation Energy",
  state: "State of Matter"
};

export const STATES = {
  solid: { name: "Solid", color: "bg-emerald-500/20 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 dot:bg-emerald-500 hover:bg-emerald-500/30", dot: "bg-emerald-500" },
  liquid: { name: "Liquid", color: "bg-purple-500/20 dark:bg-purple-950/40 border-purple-500/50 text-purple-700 dark:text-purple-400 dot:bg-purple-500 hover:bg-purple-500/30", dot: "bg-purple-500" },
  gas: { name: "Gas", color: "bg-blue-500/20 dark:bg-blue-950/40 border-blue-500/50 text-blue-700 dark:text-blue-400 dot:bg-blue-500 hover:bg-blue-500/30", dot: "bg-blue-500" },
  unknown: { name: "Unknown", color: "bg-gray-500/20 dark:bg-gray-800 border-gray-500/50 text-gray-700 dark:text-gray-400 dot:bg-gray-500 hover:bg-gray-500/30", dot: "bg-gray-500" }
};

export const BLOCKS = ["s", "p", "d", "f"];
