'use client';

import React, { useState } from 'react';
import CBTGatewayHeader from './CBTGatewayHeader';
import CustomSelect from '@/components/ui/CustomSelect';
import { ArrowLeft, Play, AlertTriangle } from 'lucide-react';

export default function CBTDeclarationGateway({
  paperData,
  candidateName = 'Candidate Name',
  candidateRollNo = '260310048291',
  candidateImage = null,
  onPrevious,
  onReadyToBegin,
}) {
  const [defaultLang, setDefaultLang] = useState('English');
  const [isDeclared, setIsDeclared] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const isAdv = paperData?.exam_type === 'JEE_ADVANCED';

  const handleStartExam = async () => {
    if (!isDeclared) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    // User gesture synchronously triggers native fullscreen
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.().catch(() => {});
      }
    } catch (e) {
      console.warn('Native fullscreen trigger failed:', e);
    }

    if (onReadyToBegin) {
      onReadyToBegin(defaultLang);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-white text-gray-900 select-none overflow-hidden">
      {/* Top Authentic Gateway Header */}
      <CBTGatewayHeader
        paperData={paperData}
        candidateName={candidateName}
        candidateRollNo={candidateRollNo}
        candidateImage={candidateImage}
        systemId="C001"
      />

      {/* Sub-bar with Title */}
      <div className="w-full bg-[#f1f5f9] border-b border-gray-300 px-6 py-2.5 flex items-center justify-between shrink-0">
        <h2 className="text-base font-bold text-gray-800 tracking-wide uppercase">
          Other Important Instructions
        </h2>
        <span className="text-xs text-gray-500 font-mono">
          Gateway Step 2 of 2
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-sm text-gray-800 leading-relaxed max-w-5xl mx-auto w-full">
        {/* Paper Summary Box */}
        <div className="p-4 bg-slate-50 border border-gray-300 rounded-lg space-y-3">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
            Paper &amp; Marking Pattern
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-white border border-gray-200 rounded">
              <span className="text-gray-500 block">Total Duration:</span>
              <strong className="text-sm text-gray-900">180 Minutes (3 Hours)</strong>
            </div>
            <div className="p-2.5 bg-white border border-gray-200 rounded">
              <span className="text-gray-500 block">Total Marks:</span>
              <strong className="text-sm text-gray-900">{isAdv ? '180 Marks' : '300 Marks'}</strong>
            </div>
            <div className="p-2.5 bg-white border border-gray-200 rounded">
              <span className="text-gray-500 block">Negative Marking:</span>
              <strong className="text-sm text-red-600">-1 for incorrect MCQ</strong>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {isAdv
              ? 'This paper contains Physics, Chemistry, and Mathematics with multiple section types including Single Correct, Multi-Correct, and Numerical values.'
              : 'Each subject contains Section A (20 Multiple Choice Questions) and Section B (10 Numerical Value Questions, out of which any 5 are to be attempted). Each question carries 4 marks.'}
          </p>
        </div>

        {/* Default Language Selector */}
        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Choose your default language :
            </label>
            <CustomSelect
              value="English"
              onChange={() => {}}
              options={[{ label: 'English', value: 'English' }]}
              disabled={true}
              size="sm"
              className="w-48"
            />
          </div>
          <p className="text-xs text-red-600 font-medium">
            Please note all questions will appear in your default language. This language can be changed for a particular question later on.
          </p>
        </div>

        {/* Official Declaration Box */}
        <div className="p-5 border-2 border-amber-300 rounded-lg bg-amber-50/40 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Declaration by the Candidate</span>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isDeclared}
              onChange={(e) => {
                setIsDeclared(e.target.checked);
                if (e.target.checked) setShowWarning(false);
              }}
              className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer shrink-0"
              data-testid="cbt-declaration-checkbox"
            />
            <span className="text-xs sm:text-[13px] text-gray-800 leading-normal group-hover:text-gray-900">
              I have read and understood all the instructions. All computer hardware allotted to me is in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget and any forbidden material. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this examination and/or disciplinary action, which may include a permanent ban from future examinations.
            </span>
          </label>

          {showWarning && !isDeclared && (
            <div className="p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700 font-semibold animate-pulse">
              Please accept terms &amp; conditions by clicking the check box before proceeding to the examination.
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="w-full bg-[#f1f5f9] border-t border-gray-300 px-6 py-3 flex items-center justify-between shrink-0 shadow-inner">
        <button
          type="button"
          onClick={onPrevious}
          className="py-2 px-6 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 text-sm font-bold uppercase tracking-wider rounded shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          data-testid="cbt-declaration-prev-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleStartExam}
          className={`py-2.5 px-8 text-white text-sm font-bold uppercase tracking-wider rounded shadow transition-all flex items-center gap-2 cursor-pointer ${
            isDeclared
              ? 'bg-[#0d6efd] hover:bg-[#0b5ed7] active:bg-[#0a58ca]'
              : 'bg-blue-400 opacity-60 cursor-not-allowed'
          }`}
          data-testid="cbt-ready-to-begin-btn"
        >
          <span>I am ready to begin</span>
          <Play className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
}
