# JEE Challenger Color System Design

## Overview
This document defines the comprehensive color system for the JEE Challenger platform, ensuring consistency across all pages while maintaining distinct identities for different sections.

## Brand Colors

### Primary Palette
**Blue-Purple Gradient** - Main brand identity
- Primary Start: `#667eea` (blue-600 to blue-700)
- Primary End: `#764ba2` (purple-600 to purple-700)
- Usage: Main CTAs, primary buttons, navbar logo, brand elements
- Tailwind: `from-blue-600 to-purple-600` | Hover: `hover:from-blue-700 hover:to-purple-700`

### Secondary Accent
**Indigo** - Supporting accent color
- Secondary: `#4f46e5` (indigo-600)
- Usage: Secondary buttons, highlights, decorative elements
- Tailwind: `bg-indigo-600` | Hover: `hover:bg-indigo-700`

## Subject-Specific Colors
Each subject maintains its own identity for easy recognition.

### Physics
- **Blue-Purple Gradient**
- Gradient: `from-blue-600 via-blue-700 to-purple-700`
- Hero Background: `from-blue-600 via-blue-700 to-purple-700`
- Buttons: `from-blue-600 to-purple-600`
- Accent Line: `from-blue-500 to-purple-500`

### Chemistry
- **Green-Teal Gradient**
- Gradient: `from-green-600 via-green-700 to-teal-700`
- Hero Background: `from-green-600 via-green-700 to-teal-700`
- Buttons: `from-green-600 to-teal-600`
- Accent Line: `from-green-500 to-teal-500`

### Mathematics
- **Purple-Pink Gradient**
- Gradient: `from-purple-600 via-purple-700 to-pink-700`
- Hero Background: `from-purple-600 via-purple-700 to-pink-700`
- Buttons: `from-purple-600 to-pink-600`
- Accent Line: `from-purple-500 to-pink-500`

## Exam-Specific Colors

### JEE Main
- **Emerald-Teal Gradient**
- Gradient: `from-emerald-600 via-emerald-700 to-teal-700`
- Hero Background: `from-emerald-600 via-emerald-700 to-teal-700`
- Buttons: `from-emerald-600 to-teal-600`
- Accent Line: `from-emerald-500 to-teal-500`
- Card Backgrounds: `from-green-50 to-emerald-50` (light) | `from-green-900/20 to-emerald-900/20` (dark)

### JEE Advanced
- **Yellow-Orange Gradient**
- Gradient: `from-yellow-600 via-yellow-700 to-orange-700`
- Hero Background: `from-yellow-600 via-yellow-700 to-orange-700`
- Buttons: `from-yellow-600 to-orange-600`
- Accent Line: `from-yellow-500 to-orange-500`
- Card Backgrounds: `from-yellow-50 to-orange-50` (light) | `from-yellow-900/20 to-orange-900/20` (dark)

## Page-Specific Colors

### AI Tutor
- **Primary Blue-Purple**
- All CTAs and highlights: `from-blue-600 to-purple-600`
- Feature cards: `from-blue-50 to-indigo-50` (light) | `from-blue-900/20 to-indigo-900/20` (dark)

### News
- **Primary Blue-Purple**
- Changed from amber/orange to match brand
- All buttons: `from-blue-600 to-purple-600`
- Accent line: `from-blue-500 to-purple-500`

### Contact Us
- **Primary Blue-Purple** ✓ (Already consistent)
- Hero: `from-blue-600 to-purple-600`
- All buttons: `from-blue-600 to-purple-600`

### Syllabus Tracker
- **Primary Blue-Purple with Progress Rainbow**
- Main CTAs: `from-blue-600 to-purple-600`
- Progress bar: `from-green-400 via-blue-500 to-purple-500` (rainbow effect for motivation)
- Stats card: `from-blue-600 via-purple-600 to-pink-600` (achievement celebration)

## Background Colors

### Page Backgrounds
- Light: `bg-white`
- Dark: `dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900`

### Card Backgrounds

#### Neutral Cards
- Light: `bg-white` or `bg-gray-50`
- Dark: `dark:bg-gray-800` or `dark:bg-gray-900`

#### Branded Cards (Primary)
- Light: `from-blue-50 to-indigo-50`
- Dark: `from-blue-900/20 to-indigo-900/20`

#### Branded Cards (Secondary)
- Light: `from-purple-50 to-pink-50`
- Dark: `from-purple-900/20 to-pink-900/20`

## Text Colors

### Primary Text
- Light: `text-gray-900`
- Dark: `dark:text-white`

### Secondary Text
- Light: `text-gray-600`
- Dark: `dark:text-gray-300`

### Tertiary Text
- Light: `text-gray-500`
- Dark: `dark:text-gray-400`

### Accent Text (for highlights)
- Brand: `text-blue-600 dark:text-blue-400`
- Links: `text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300`

## Border Colors
- Light: `border-gray-200`
- Dark: `dark:border-gray-700`
- Branded: `border-blue-200 dark:border-blue-800`

## Social Media Colors (Keep as-is)
These follow platform branding guidelines:
- Telegram: `text-blue-500` / `text-blue-500`
- Instagram: `text-pink-500` / `text-pink-500`
- YouTube: `text-red-500` / `text-red-500`

## Status Colors

### Success
- Background: `bg-green-50 dark:bg-green-900/20`
- Text: `text-green-600 dark:text-green-400`
- Border: `border-green-200 dark:border-green-800`

### Warning/Info
- Background: `bg-yellow-50 dark:bg-yellow-900/20`
- Text: `text-yellow-600 dark:text-yellow-400`
- Border: `border-yellow-200 dark:border-yellow-800`

### Error
- Background: `bg-red-50 dark:bg-red-900/20`
- Text: `text-red-600 dark:text-red-400`
- Border: `border-red-200 dark:border-red-800`

## Button Hierarchy

### Primary Buttons
```jsx
className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 
shadow-md hover:shadow-lg"
```

### Secondary Buttons
```jsx
className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg 
transition-all duration-200 shadow-md hover:shadow-lg"
```

### Tertiary/Outline Buttons
```jsx
className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white 
dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-600 font-medium py-3 px-6 
rounded-lg transition-all duration-200"
```

## Accent Lines
Decorative underlines below headings:
```jsx
className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"
```

## Implementation Guidelines

### Do's ✓
- Use primary blue-purple gradient for all main CTAs and brand elements
- Keep subject-specific colors for Physics, Chemistry, and Mathematics pages
- Keep JEE Main and JEE Advanced distinct color identities
- Use social media brand colors for respective links
- Maintain consistent button styling across pages
- Use neutral backgrounds (white/gray) as the base

### Don'ts ✗
- Avoid using more than 2-3 different gradient combinations on a single page
- Don't use random color combinations for buttons
- Avoid colorful gradients for every section background
- Don't mix different gradient directions without purpose
- Avoid low contrast color combinations

## Color Psychology
- **Blue**: Trust, stability, learning (primary brand color)
- **Purple**: Creativity, wisdom, ambition (aspirational)
- **Green**: Growth, chemistry elements (Chemistry)
- **Pink**: Energy, enthusiasm (Mathematics)
- **Emerald**: Excellence, premium (JEE Main)
- **Yellow/Orange**: Achievement, success (JEE Advanced)

## Accessibility
- All color combinations maintain WCAG AA contrast ratios (4.5:1 minimum)
- Dark mode variants ensure readability
- Color is never the only way to convey information
- Focus states include visible indicators beyond color

---

**Last Updated**: February 22, 2026
**Version**: 1.0
