'use client';

import React, { useState } from 'react';
import CBTGatewayHeader from './CBTGatewayHeader';
import { Lock, User, Keyboard, AlertCircle, ArrowRight, Delete } from 'lucide-react';

export default function CBTCandidateLogin({
  paperData,
  candidateName = 'Candidate Name',
  candidateRollNo = '260310048291',
  candidateImage = null,
  onSignIn,
}) {
  const [password, setPassword] = useState('123456');
  const [showKeypad, setShowKeypad] = useState(false);

  const handleKeypadPress = (val) => {
    if (val === 'CLEAR') {
      setPassword('');
    } else if (val === 'BACK') {
      setPassword((prev) => prev.slice(0, -1));
    } else {
      setPassword((prev) => prev + val);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.().catch(() => {});
      }
    } catch (err) {
      console.warn('Native fullscreen trigger failed:', err);
    }
    if (onSignIn) {
      onSignIn();
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#eef2f6] text-gray-800 select-none overflow-hidden">
      {/* Authentic Pre-Exam Header */}
      <CBTGatewayHeader
        paperData={paperData}
        candidateName={candidateName}
        candidateRollNo={candidateRollNo}
        candidateImage={candidateImage}
        systemId="C001"
      />

      {/* Main Terminal Login Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
          {/* Card Header Strip */}
          <div className="bg-[#285586] text-white px-5 py-3 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-wide uppercase">
              Candidate Login
            </h2>
            <span className="text-xs font-mono bg-blue-900/60 px-2 py-0.5 rounded border border-blue-400/30 text-yellow-300">
              Terminal: C001
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* System Info Banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-gray-900">{candidateName}</div>
                <div className="text-gray-500 font-mono">Roll No: {candidateRollNo}</div>
              </div>
            </div>

            {/* Field: Roll Number */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Application / Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={candidateRollNo}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-mono text-gray-800 focus:outline-hidden"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Field: Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password (DDMMYYYY)
                </label>
                <button
                  type="button"
                  onClick={() => setShowKeypad(!showKeypad)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>{showKeypad ? 'Hide Keypad' : 'Virtual Keypad'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-hidden focus:border-blue-500"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Virtual Keypad */}
            {showKeypad && (
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-md space-y-2 animate-in fade-in duration-150">
                <div className="text-[11px] font-semibold text-gray-500 uppercase">
                  Virtual Number Pad
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleKeypadPress(String(num))}
                      className="py-2 bg-white border border-gray-300 hover:bg-gray-100 font-bold text-sm rounded shadow-xs active:bg-gray-200 cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('CLEAR')}
                    className="py-2 bg-amber-100 border border-amber-300 hover:bg-amber-200 font-bold text-xs text-amber-900 rounded shadow-xs cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="py-2 bg-white border border-gray-300 hover:bg-gray-100 font-bold text-sm rounded shadow-xs active:bg-gray-200 cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('BACK')}
                    className="py-2 bg-red-100 border border-red-300 hover:bg-red-200 font-bold text-xs text-red-900 rounded shadow-xs flex items-center justify-center cursor-pointer"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] active:bg-[#0a58ca] text-white text-sm font-bold uppercase tracking-wider rounded shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              data-testid="cbt-signin-btn"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Official Center Disclaimer */}
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Notice:</strong> In case of any discrepancy in your photograph, candidate name, or roll number, please report immediately to the invigilator.
              </span>
            </div>
          </form>

          {/* Footer Bar */}
          <div className="bg-gray-100 border-t border-gray-200 px-5 py-2 text-center text-[11px] text-gray-500">
            TCS iON / NTA Assessment Engine • Terminal Version 14.02.00
          </div>
        </div>
      </div>
    </div>
  );
}
