'use client';

import React from 'react';
import CBTGatewayHeader from './CBTGatewayHeader';
import CustomSelect from '@/components/ui/CustomSelect';
import { ArrowRight, Check } from 'lucide-react';

export default function CBTGeneralInstructions({
  paperData,
  candidateName = 'Candidate Name',
  candidateRollNo = '260310048291',
  candidateImage = null,
  onNext,
}) {
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

      {/* Sub-bar with Title and Language Toggle */}
      <div className="w-full bg-[#f1f5f9] border-b border-gray-300 px-6 py-2.5 flex items-center justify-between shrink-0">
        <h2 className="text-base font-bold text-gray-800 tracking-wide uppercase">
          General Instructions :
        </h2>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">
            View in :
          </label>
          <CustomSelect
            value="en"
            onChange={() => {}}
            options={[{ label: 'English', value: 'en' }]}
            disabled={true}
            size="sm"
            className="w-32"
          />
        </div>
      </div>

      {/* Scrollable Instruction Document Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-sm text-gray-800 leading-relaxed font-sans max-w-5xl mx-auto w-full">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-gray-200 pb-1">
            1. General Information & Clock
          </h3>
          <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-gray-700">
            <li>
              Total duration of this examination is <strong>{paperData?.duration_minutes || 180} minutes</strong> ({Math.round((paperData?.duration_minutes || 180) / 60)} Hours).
            </li>
            <li>
              The clock will be set at the server. The countdown timer at the top right corner of screen will display the remaining time available for you to finish the examination.
            </li>
            <li>
              When the timer reaches zero, the examination will end by itself. You will not be required to manually submit or end your examination.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-gray-200 pb-1">
            2. Question Palette Symbols & Meanings
          </h3>
          <p className="text-xs text-gray-600">
            The Question Palette displayed on the right side of the screen will show the status of each question using one of the following symbols:
          </p>

          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[11px] border-b border-gray-300">
                <tr>
                  <th className="py-2.5 px-4 w-28 text-center border-r border-gray-300">Symbol</th>
                  <th className="py-2.5 px-4">Status & Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50/80">
                  <td className="py-2.5 px-4 text-center border-r border-gray-300">
                    <div className="w-8 h-8 rounded border border-gray-300 bg-white font-bold flex items-center justify-center mx-auto text-gray-700 shadow-2xs">
                      1
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-gray-800">
                    You have not visited the question yet.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="py-2.5 px-4 text-center border-r border-gray-300">
                    <div className="w-8 h-8 rounded-b-lg bg-[#dc3545] text-white font-bold flex items-center justify-center mx-auto shadow-2xs">
                      2
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-gray-800">
                    You have not answered the question.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="py-2.5 px-4 text-center border-r border-gray-300">
                    <div className="w-8 h-8 rounded-t-lg bg-[#28a745] text-white font-bold flex items-center justify-center mx-auto shadow-2xs">
                      3
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-gray-800">
                    You have answered the question.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="py-2.5 px-4 text-center border-r border-gray-300">
                    <div className="w-8 h-8 rounded-full bg-[#6f42c1] text-white font-bold flex items-center justify-center mx-auto shadow-2xs">
                      4
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-gray-800">
                    You have NOT answered the question, but have marked the question for review.
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/80 bg-purple-50/40">
                  <td className="py-2.5 px-4 text-center border-r border-gray-300">
                    <div className="w-8 h-8 rounded-full bg-[#6f42c1] text-white font-bold flex items-center justify-center mx-auto relative shadow-2xs">
                      5
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#28a745] rounded-xs flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-gray-800">
                    The question(s) <strong>&quot;Answered and Marked for Review&quot;</strong> will be considered for evaluation during final scoring.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-gray-200 pb-1">
            3. Navigating to a Question
          </h3>
          <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-gray-700">
            <li>
              Click on the question number in the Question Palette at the right of your screen to go to that question directly. <strong>Note:</strong> Using this option does NOT save your answer to the current question.
            </li>
            <li>
              Click on <strong>Save &amp; Next</strong> to save your answer for the current question and then proceed to the next question.
            </li>
            <li>
              Click on <strong>Mark for Review &amp; Next</strong> to save your answer, mark it for review, and then go to the next question.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider border-b border-gray-200 pb-1">
            4. Answering Questions
          </h3>
          <div className="space-y-2 text-sm text-gray-700 pl-2">
            <p>
              <strong>For Multiple Choice Type Questions:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-4 text-xs sm:text-sm">
              <li>To select your answer, click on the radio button corresponding to one of the options.</li>
              <li>To deselect your chosen answer, click on the button of the chosen option again or click on <strong>Clear Response</strong>.</li>
              <li>To change your chosen answer, click on the button of another option.</li>
              <li>To save your response, you MUST click on the <strong>Save &amp; Next</strong> button.</li>
            </ul>

            <p className="pt-2">
              <strong>For Numerical Value Type Questions:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-4 text-xs sm:text-sm">
              <li>Enter your numerical answer using the on-screen virtual keypad. Keystrokes from physical keyboards are restricted for security.</li>
              <li>To clear the entered number, click on the <strong>Backspace</strong> or <strong>Clear</strong> button on the virtual keypad.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="w-full bg-[#f1f5f9] border-t border-gray-300 px-6 py-3 flex items-center justify-end shrink-0 shadow-inner">
        <button
          type="button"
          onClick={async () => {
            try {
              if (typeof document !== 'undefined' && !document.fullscreenElement) {
                await document.documentElement.requestFullscreen?.().catch(() => {});
              }
            } catch (err) {
              console.warn('Native fullscreen trigger failed:', err);
            }
            if (onNext) onNext();
          }}
          className="py-2 px-8 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-sm font-bold uppercase tracking-wider rounded shadow transition-all flex items-center gap-2 cursor-pointer"
          data-testid="cbt-instructions-next-btn"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
