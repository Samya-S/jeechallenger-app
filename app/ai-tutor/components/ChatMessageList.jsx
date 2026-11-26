"use client";

import React, { useState } from "react";
import { 
  RotateCcw, 
  Copy, 
  Check, 
  User as UserIcon
} from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";
import FileAttachment from "@/app/ai-tutor/components/FileAttachment";
import WelcomeScreen from "@/app/ai-tutor/components/WelcomeScreen";
import MessageListSkeleton from "./skeletons/MessageListSkeleton";

const AIResponseRenderer = ({ content }) => <MarkdownMathRenderer content={content} />;

// Copy button for AI message content
const CopyMessageButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1 text-[11px]"
      title="Copy to clipboard"
      aria-label="Copy message"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-500 font-medium">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default function ChatMessageList({
  messagesContainerRef,
  messagesEndRef,
  onScroll,
  isLoadingMessages,
  messageGroups,
  sortedGroupEntries,
  isLoading,
  isStreaming = false,
  onSelectSuggestion,
  onRetryMessage,
  isChatPage = false,
}) {
  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      className={`flex-1 px-3 sm:px-6 md:px-8 pt-0 pb-4 sm:pb-6 space-y-4 sm:space-y-6 min-h-0 bg-slate-50/50 dark:bg-[#0b101b] scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-700 ${
        isLoadingMessages ? "overflow-hidden" : "overflow-y-auto"
      }`}
    >
      <div className={`max-w-4xl mx-auto w-full ${isLoadingMessages ? "h-full" : ""}`}>
        {isLoadingMessages ? (
          <MessageListSkeleton />
        ) : !isChatPage ? (
          <WelcomeScreen onSelectSuggestion={onSelectSuggestion} />
        ) : sortedGroupEntries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center text-slate-400 dark:text-slate-500 text-sm">
            <p>No messages yet in this conversation.</p>
          </div>
        ) : (
          sortedGroupEntries.map(([date, dateMessages]) => (
            <div key={date} data-date-group={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="bg-slate-200/60 dark:bg-slate-800/70 px-3.5 py-1 rounded-full shadow-2xs border border-slate-300/40 dark:border-slate-700/40">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {date}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4 sm:space-y-5">
                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    id={`message-${message.id}`}
                    className={`flex scroll-mt-2 sm:scroll-mt-3 lg:scroll-mt-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2.5 sm:gap-3 w-full max-w-full sm:max-w-[85%] ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar - hidden on small devices to maximize reading width */}
                      <div
                        className={`hidden sm:flex w-8 h-8 rounded-xl items-center justify-center shrink-0 shadow-xs ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <UserIcon className="w-4 h-4" />
                        ) : (
                          <FaChalkboardTeacher className="text-white text-sm" />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 max-w-full">
                        {/* Message Bubble Card */}
                        <div
                          className={`px-4 sm:px-5 py-3.5 shadow-xs min-w-0 overflow-hidden leading-relaxed ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white rounded-2xl rounded-tr-[2px]"
                              : message.isError
                              ? "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/60 rounded-2xl rounded-tl-[2px]"
                              : "bg-white dark:bg-[#131b2e] text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl rounded-tl-[2px] shadow-xs"
                          }`}
                        >
                          {/* Message Content */}
                          {message.sender === "ai" ? (
                            message.isError ? (
                              <div className="flex flex-col items-start gap-2">
                                <p className="text-sm whitespace-pre-wrap text-left">
                                  {message.text}
                                </p>
                                {message.failedText && (
                                  <button
                                    type="button"
                                    onClick={() => onRetryMessage(message)}
                                    className="mt-1 flex items-center gap-1.5 text-xs font-medium bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-200 px-3 py-1.5 rounded-lg transition-colors border border-rose-300/80 dark:border-rose-700/60"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Retry Message</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm leading-relaxed overflow-x-auto">
                                <AIResponseRenderer content={message.text} />
                              </div>
                            )
                          ) : (
                            <p className="text-sm whitespace-pre-wrap text-left">
                              {message.text}
                            </p>
                          )}

                          {/* Display attached files in user messages */}
                          {message.sender === "user" &&
                            message.attachedFiles &&
                            message.attachedFiles.length > 0 && (
                              <div className="mt-3 space-y-1.5">
                                {message.attachedFiles.map((file) => (
                                  <FileAttachment
                                    key={file.id}
                                    file={file}
                                    showRemove={false}
                                  />
                                ))}
                              </div>
                            )}
                        </div>

                        {/* Bottom Info: Timestamp & Copy Button (Outside of the bubble) */}
                        {message.sender === "user" ? (
                          <p className="text-[10px] text-blue-500/80 dark:text-blue-400/80 text-right mt-1 px-1 whitespace-nowrap">
                            {message.timestamp.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        ) : (
                          <div className="flex items-center gap-2 mt-1 px-1">
                            <span className="text-[10px] text-slate-400 dark:text-slate-400 whitespace-nowrap">
                              {message.timestamp.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                            {!message.isError && (
                              <CopyMessageButton text={message.text} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator - AI Thinking State */}
        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 w-full max-w-full sm:max-w-[85%]">
              <div className="hidden sm:flex w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white items-center justify-center shrink-0 shadow-xs">
                <FaChalkboardTeacher className="text-white text-sm" />
              </div>
              <div className="bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800/90 px-4 py-3 rounded-2xl rounded-tl-[2px] shadow-xs flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Thinking
                </span>
                <div className="flex items-center space-x-1 pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-ai-dot-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-ai-dot-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-ai-dot-3" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
