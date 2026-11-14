import {
  Monitor,
  CheckCircle2,
  BookOpen,
  Layers,
  FileText,
  Newspaper
} from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";

// Realistic demo state for Syllabus Tracker preview (based on full 88 chapters & 264 tasks)
export const trackerDemoData = {
    overall: {
      percentage: 64,
      completedTasks: 170,
      totalTasks: 264,
      totalChapters: 88,
      theoryDone: 68,
      pyqsDone: 58,
      revisionDone: 44,
    },
    subjects: [
      {
        key: "physics",
        name: "Physics",
        totalChapters: 29,
        chaptersCompleted: 21,
        totalTasks: 87,
        completedTasks: 62,
        percentage: 71,
        accentStroke: "text-blue-600 dark:text-blue-500",
        accentFill: "fill-blue-600 dark:fill-blue-400",
      },
      {
        key: "chemistry",
        name: "Chemistry",
        totalChapters: 30,
        chaptersCompleted: 19,
        totalTasks: 90,
        completedTasks: 58,
        percentage: 64,
        accentStroke: "text-emerald-600 dark:text-emerald-500",
        accentFill: "fill-emerald-600 dark:fill-emerald-400",
      },
      {
        key: "mathematics",
        name: "Mathematics",
        totalChapters: 29,
        chaptersCompleted: 16,
        totalTasks: 87,
        completedTasks: 50,
        percentage: 57,
        accentStroke: "text-purple-600 dark:text-purple-500",
        accentFill: "fill-purple-600 dark:fill-purple-400",
      },
    ],
  };

export const sampleAiQuestions = [
    {
      q: "Explain work done in an isothermal reversible expansion of an ideal gas.",
      a: "For an isothermal process ($T = \\text{constant}$):\n\n- **First Law**: $\\Delta U = q + w = 0 \\implies q = -w$\n- **Work Done**: $W = -\\int P \\, dV = -nRT \\ln\\left(\\frac{V_2}{V_1}\\right)$\n- **In terms of pressure**: $W = -nRT \\ln\\left(\\frac{P_1}{P_2}\\right)$\n\nSince temperature is constant, internal energy change $\\Delta U = 0$ for an ideal gas.",
      topic: "Thermodynamics"
    },
    {
      q: "Why is o-nitrophenol more volatile than p-nitrophenol?",
      a: "- **Ortho-nitrophenol** exhibits intramolecular hydrogen bonding (chelation between -OH and -NO₂).\n- **Para-nitrophenol** forms intermolecular hydrogen bonds with neighboring molecules.\n- **Intermolecular H-bonds** create extensive association, raising boiling point and reducing volatility.",
      topic: "Organic Chemistry"
    },
    {
      q: "Find the limit: lim(x→0) [sin(x) - x] / x³",
      a: "Using the Taylor series expansion of $\\sin(x)$:\n\n- $\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots$\n- $\\sin(x) - x = -\\frac{x^3}{6} + \\mathcal{O}(x^5)$\n- Dividing by $x^3$: $\\lim_{x \\to 0} \\left[-\\frac{1}{6} + \\mathcal{O}(x^2)\\right] = -\\frac{1}{6}$\n\nAlternatively, applying L'Hôpital's rule 3 times yields the identical $-\\frac{1}{6}$.",
      topic: "Calculus & Limits"
    }
  ];

export const getFeatureHubTabs = (yearRangeDisplay = "2024–2026") => [
    {
      id: "cbt",
      label: "CBT Mock Tests",
      badge: "NTA & IIT iON",
      icon: Monitor,
    },
    {
      id: "ai-tutor",
      label: "AI Tutor",
      badge: "24/7 Live",
      icon: FaChalkboardTeacher,
    },
    {
      id: "syllabus-tracker",
      label: "Syllabus Tracker",
      badge: "88 Chapters",
      icon: CheckCircle2,
    },
    {
      id: "pyqs",
      label: "PYQ Question Bank",
      badge: `${yearRangeDisplay}*`,
      icon: BookOpen,
    },
    {
      id: "resources",
      label: "Subject Resources",
      badge: "Formula & Tools",
      icon: Layers,
    },
    {
      id: "official",
      label: "JEE Papers & Links",
      badge: "Main & Adv",
      icon: FileText,
    },
    {
      id: "blogs",
      label: "Articles & Insights",
      badge: "Topper Guides",
      icon: Newspaper,
    },
  ];

export const featureHubTabs = getFeatureHubTabs();
