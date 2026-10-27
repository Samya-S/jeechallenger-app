'use client';

import React from 'react';
import { Monitor, User, Shield } from 'lucide-react';

export default function CBTGatewayHeader({
  paperData,
  candidateName = 'Candidate Name',
  candidateRollNo = '260310048291',
  systemId = 'C001',
  candidateImage = null,
}) {
  const isAdv = paperData?.exam_type === 'JEE_ADVANCED';
  const examTitle = isAdv ? 'JEE (Advanced) 2026' : 'JEE (Main) 2026';
  const paperSubject = isAdv ? 'Paper 1 (PCM)' : 'B.E. / B.Tech (Paper 1)';

  return (
    <header className="w-full bg-[#1e3a5f] text-white border-b-2 border-[#122740] px-4 py-2 flex items-center justify-between select-none shrink-0 shadow-md">
      {/* Left: Official Assessment Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-700/80 border border-blue-400/30 flex items-center justify-center text-white shadow-inner">
          <Shield className="w-6 h-6 text-blue-200" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-wide text-white">
              {examTitle}
            </h1>
            <span className="hidden md:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded">
              Official CBT Portal
            </span>
          </div>
          <p className="text-[11px] text-blue-200/90 truncate max-w-xs sm:max-w-md">
            {paperData?.title || 'National Testing Agency Assessment Gateway'}
          </p>
        </div>
      </div>

      {/* Center: System Terminal ID */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-md backdrop-blur-xs">
        <Monitor className="w-4 h-4 text-blue-300" />
        <span className="text-xs font-mono font-bold tracking-wider text-white">
          System Name : <span className="text-yellow-300">{systemId}</span>
        </span>
      </div>

      {/* Right: Candidate Card with Photo and Details */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col text-right leading-tight">
          <span className="text-xs font-bold text-white tracking-wide">
            Candidate Name : <span className="text-yellow-200">{candidateName}</span>
          </span>
          <span className="text-[11px] text-blue-200">
            Subject : {paperSubject}
          </span>
          <span className="text-[10px] text-blue-300/80 font-mono">
            Roll No : {candidateRollNo}
          </span>
        </div>

        {/* Candidate Photo Box */}
        <div className="w-11 h-12 bg-white rounded border border-gray-300 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
          {candidateImage ? (
            <img
              src={candidateImage}
              alt={candidateName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-slate-500">
              <User className="w-6 h-6" />
              <span className="text-[7px] font-bold text-slate-600 uppercase">PHOTO</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
