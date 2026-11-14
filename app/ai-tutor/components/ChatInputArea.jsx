"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FaPaperclip, FaSpinner, FaStopCircle, FaPaperPlane } from "react-icons/fa";
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
  sendMessage
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-3 py-2.5 sm:px-6 sm:py-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Attached Files Display */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Attached files ({attachedFiles.length}):
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              {attachedFiles.map((file) => (
                <FileAttachment
                  key={file.id}
                  file={file}
                  onRemove={removeAttachedFile}
                  showRemove={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Uploading animation above textarea */}
        {isUploading && (
          <div className="flex items-center justify-center mb-1">
            <FaSpinner className="animate-spin text-blue-600 mr-2 text-sm" />
            <span className="text-blue-700 dark:text-blue-300 text-sm">Uploading file(s)...</span>
          </div>
        )}
        {uploadError && (
          <div className="mb-1 p-1.5 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs text-center">
            {uploadError}
          </div>
        )}

        <div className="w-full flex items-center border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all p-2">

          {/* File Upload Button - Left side */}
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={isLoading || isUploading}
            className="flex-shrink-0 h-9 w-9 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 z-20"
            title="Attach files"
            aria-label="Attach files"
          >
            <FaPaperclip className="text-lg" />
          </button>

          {/* Textarea Wrapper - Center */}
          <div className="relative flex-1 flex items-center mx-3 min-h-[24px]">

            {!inputMessage && (
              <div className="absolute left-1 right-1 block text-gray-500 dark:text-gray-400 pointer-events-none truncate select-none z-0">
                {placeholder}
              </div>
            )}

            <TextareaAutosize
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              minRows={1}
              maxRows={5}
              className="w-full py-1 px-1 resize-none bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white overflow-y-auto scrollbar-hide relative z-10"
              onPaste={e => {
                if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
                  e.preventDefault();
                  handleDirectFileUpload(e.clipboardData.files);
                }
              }}
            />
          </div>

          {/* Hidden file input for direct upload */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              if (e.target.files && e.target.files.length > 0) {
                handleDirectFileUpload(e.target.files);
                e.target.value = null;
              }
            }}
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.mp3,.wav,.ogg,.m4a"
          />

          {/* Send / Stop Button - Right side */}
          {isLoading ? (
            <button
              onClick={() => abortController?.abort("User stopped generation")}
              className="flex-shrink-0 h-9 w-9 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm z-20 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
              title="Stop generating"
              aria-label="Stop generating"
            >
              <FaStopCircle className="text-lg" />
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isUploading}
              className={`flex-shrink-0 h-9 w-9 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm z-20 ${inputMessage.trim() && !isUploading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              aria-label="Send message"
            >
              <FaPaperPlane className="text-base -ml-[1px]" />
            </button>
          )}
        </div>
        <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          Press Enter to send, Shift+Enter for new line • Click 📎 to attach files
        </p>
      </div>
    </div>
  );
}
