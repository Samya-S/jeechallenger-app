"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { 
  Paperclip, 
  ArrowUp, 
  Square 
} from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import FileAttachment from "@/app/ai-tutor/components/FileAttachment";

export default function ChatInputArea({
  attachedFiles,
  removeAttachedFile,
  isUploading,
  uploadError,
  fileInputRef,
  inputRef,
  inputMessage,
  setInputMessage,
  placeholder,
  handleKeyPress,
  handleDirectFileUpload,
  isLoading,
  abortController,
  sendMessage,
}) {
  return (
    <div className="bg-slate-50/80 dark:bg-[#0b101b]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-3 py-2.5 sm:px-6 sm:py-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xs shrink-0">
      <div className="max-w-4xl mx-auto">
        {/* Attached Files Preview Strip */}
        {attachedFiles.length > 0 && (
          <div className="mb-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
              <span>Attached files ({attachedFiles.length}):</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-700">
              {attachedFiles.map((file) => (
                <div key={file.id} className="max-w-xs">
                  <FileAttachment
                    file={file}
                    onRemove={removeAttachedFile}
                    showRemove={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploading Animation */}
        {isUploading && (
          <div className="flex items-center justify-center gap-2 mb-2 py-1 px-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-blue-700 dark:text-blue-300 text-xs">
            <FaSpinner className="animate-spin text-xs" />
            <span>Uploading file(s) securely...</span>
          </div>
        )}

        {/* Upload Error Alert */}
        {uploadError && (
          <div className="mb-2 p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs text-center font-medium">
            {uploadError}
          </div>
        )}

        {/* Floating Input Card Container */}
        <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-300/90 dark:border-slate-700/80 shadow-xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          {/* File Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={isLoading || isUploading}
            className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors disabled:opacity-50"
            title="Attach files or images"
            aria-label="Attach files"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea Area */}
          <div className="relative flex-1 min-h-[36px] flex items-center py-1">
            {!inputMessage && (
              <div className="absolute left-1 right-1 text-slate-400 dark:text-slate-400 pointer-events-none truncate select-none text-sm">
                {placeholder}
              </div>
            )}

            <TextareaAutosize
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              minRows={1}
              maxRows={6}
              className="w-full px-1 py-0.5 resize-none bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-slate-900 dark:text-slate-100 overflow-y-auto scrollbar-hide relative z-10 leading-relaxed"
              onPaste={(e) => {
                if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
                  e.preventDefault();
                  handleDirectFileUpload(e.clipboardData.files);
                }
              }}
            />
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleDirectFileUpload(e.target.files);
                e.target.value = null;
              }
            }}
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.mp3,.wav,.ogg,.m4a"
          />

          {/* Send / Stop Action Button */}
          {isLoading ? (
            <button
              type="button"
              onClick={() => abortController?.abort("User stopped generation")}
              className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all active:scale-95"
              title="Stop generation"
              aria-label="Stop generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isUploading}
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                inputMessage.trim() && !isUploading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95 cursor-pointer"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-400 cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Bottom Helper Hints */}
        <div className="hidden md:flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 mt-1.5 px-1 select-none">
          <span>AI can make mistakes. Verify critical concepts & calculations.</span>
          <p>
            <kbd className="font-sans px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">Enter</kbd> to send • <kbd className="font-sans px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
