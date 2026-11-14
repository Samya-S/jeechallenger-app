"use client";

import React from "react";
import { FaSpinner, FaChalkboardTeacher, FaUser, FaRedo } from "react-icons/fa";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";
import FileAttachment from "@/app/ai-tutor/components/FileAttachment";
import WelcomeScreen from "@/app/ai-tutor/components/WelcomeScreen";

const AIResponseRenderer = ({ content }) => <MarkdownMathRenderer content={content} />;

export default function ChatMessageList({
  messagesContainerRef,
  messagesEndRef,
  onScroll,
  isLoadingMessages,
  messageGroups,
  sortedGroupEntries,
  isLoading,
  onSelectSuggestion,
  onRetryMessage
}) {
  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 min-h-0 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
    >
      <div className="max-w-4xl mx-auto">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="animate-spin text-blue-500 mr-2" />
            <span className="text-gray-500 dark:text-gray-400">Loading messages...</span>
          </div>
        ) : Object.keys(messageGroups).length === 0 ? (
          <WelcomeScreen onSelectSuggestion={onSelectSuggestion} />
        ) : (
          sortedGroupEntries.map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-8">
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {date}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    id={`message-${message.id}`}
                    className={`flex scroll-mt-8 sm:scroll-mt-12 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start md:space-x-3 w-full md:max-w-[80%] ${message.sender === "user" ? "flex-row-reverse md:space-x-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`hidden md:flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0 ${message.sender === "user"
                          ? "bg-blue-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                          }`}
                      >
                        {message.sender === "user" ? (
                          <FaUser className="text-white text-sm" />
                        ) : (
                          <FaChalkboardTeacher className="text-white text-sm" />
                        )}
                      </div>

                      <div className="flex flex-col max-w-full min-w-0">
                        {/* Message Bubble */}
                        <div
                          className={`px-5 py-4 shadow-sm min-w-0 overflow-hidden rounded-2xl ${message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-[2px]"
                            : message.isError
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-tl-[2px]"
                              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-md rounded-tl-[2px]"
                            }`}
                        >
                          {message.sender === "ai" ? (
                            message.isError ? (
                              <div className="flex flex-col items-start">
                                <p className="text-base leading-relaxed whitespace-pre-wrap text-left">
                                  {message.text}
                                </p>
                                {message.failedText && (
                                  <button
                                    onClick={() => onRetryMessage(message)}
                                    className="mt-3 flex items-center space-x-2 text-sm font-medium bg-red-50 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1.5 rounded-lg transition-colors border border-red-200 dark:border-red-700"
                                  >
                                    <FaRedo className="text-xs" />
                                    <span>Retry Message</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <AIResponseRenderer content={message.text} />
                            )
                          ) : (
                            <p className="text-base leading-relaxed whitespace-pre-wrap text-left">
                              {message.text}
                            </p>
                          )}

                          {/* Display attached files in user messages */}
                          {message.sender === "user" && message.attachedFiles && message.attachedFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
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
                        {/* Timestamp */}
                        <p
                          className={`text-xs whitespace-nowrap mt-1 ${message.sender === "user"
                            ? "text-blue-500 dark:text-blue-400 text-right"
                            : message.isError
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                          {message.timestamp.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Loading indicator - AI is thinking... */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start md:space-x-3 w-full max-w-[80%]">
              <div className="hidden md:flex w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full items-center justify-center">
                <FaChalkboardTeacher className="text-white text-sm" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-[2px] flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <FaSpinner className="text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    AI is thinking...
                  </span>
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
