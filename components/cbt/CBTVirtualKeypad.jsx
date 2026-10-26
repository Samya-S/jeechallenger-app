'use client';

import React from 'react';
import { useCBTStore } from './store/useCBTStore';
import { Delete, RotateCcw } from 'lucide-react';

export default function CBTVirtualKeypad({ className = '' }) {
  const uncommittedAnswer = useCBTStore((s) => s.uncommittedAnswer);
  const setNumericValue = useCBTStore((s) => s.setNumericValue);

  const currentValue = uncommittedAnswer?.numericValue ?? '';

  const handleKeyPress = (char) => {
    let next = String(currentValue);

    if (char === '-') {
      // Toggle or set negative sign at front
      if (next.startsWith('-')) {
        next = next.slice(1);
      } else {
        next = '-' + next;
      }
    } else if (char === '.') {
      // Only allow one decimal point
      if (!next.includes('.')) {
        next = next === '' || next === '-' ? next + '0.' : next + '.';
      }
    } else {
      // Numeric digit
      if (next.length < 15) {
        next = next + char;
      }
    }

    setNumericValue(next);
  };

  const handleBackspace = () => {
    if (!currentValue) return;
    const str = String(currentValue);
    const next = str.slice(0, -1);
    setNumericValue(next === '-' ? '' : next);
  };

  const handleClear = () => {
    setNumericValue('');
  };

  const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '-'],
  ];

  return (
    <div
      className={`cbt-virtual-keypad select-none p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/90 shadow-sm inline-block ${className}`}
      data-testid="cbt-virtual-keypad"
    >
      <div className="mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
        <span>Numerical Input</span>
        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
          *Use mouse to enter value
        </span>
      </div>

      {/* Numerical Answer Display Box */}
      <div className="relative mb-4">
        <input
          type="text"
          readOnly
          value={currentValue}
          placeholder="0.00"
          onKeyDown={(e) => e.preventDefault()}
          onKeyUp={(e) => e.preventDefault()}
          onKeyPress={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          className="w-full h-11 px-3 text-right font-mono text-xl font-bold bg-gray-50 dark:bg-gray-900 border-2 border-blue-500/70 rounded-lg text-gray-900 dark:text-white focus:outline-none shadow-inner tracking-widest cursor-default selection:bg-transparent"
          data-testid="cbt-numeric-input"
        />
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-2 w-56 sm:w-64">
        {keypadRows.map((row, rIdx) =>
          row.map((btn) => (
            <button
              key={`${rIdx}-${btn}`}
              type="button"
              onClick={() => handleKeyPress(btn)}
              className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 hover:bg-blue-50 active:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-mono text-lg font-bold shadow-sm transition-all flex items-center justify-center cursor-pointer hover:border-blue-400 active:scale-95"
              data-key={btn}
            >
              {btn}
            </button>
          ))
        )}

        {/* Backspace Button */}
        <button
          type="button"
          onClick={handleBackspace}
          className="col-span-2 h-11 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          title="Backspace"
          data-testid="cbt-keypad-backspace"
        >
          <Delete className="w-4 h-4" />
          <span>Backspace</span>
        </button>

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          className="h-11 rounded-lg border border-red-300 dark:border-red-700/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          title="Clear"
          data-testid="cbt-keypad-clear"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
