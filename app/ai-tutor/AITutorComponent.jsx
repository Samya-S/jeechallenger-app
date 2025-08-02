"use client";

import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaSpinner, FaTrash } from "react-icons/fa";
import { googleLogout } from '@react-oauth/google';
import AITutorLogin from "@/components/AiTutorComponents/AITutorLogin";
import AITutorNavbar from "@/components/AiTutorComponents/AITutorNavbar";

const AITutorComponent = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearError, setShowClearError] = useState(false);
  const [authError, setAuthError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load user and messages from backend on mount
  useEffect(() => {
    loadUserAndMessages();
  }, []);

  // Note: Messages are now stored on the backend, no need for localStorage
  const loadUserAndMessages = async () => {
    const token = localStorage.getItem('ai-tutor-token');

    if (token) {
      try {
        // Get current user profile from backend
        const userResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // Load chat history from backend
          const historyResponse = await fetch('/api/chat/history', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            // Convert backend format to frontend format
            const messagesWithDates = historyData.messages.map(msg => {
              // Create user message
              const userMessage = {
                id: `user_${msg.id}`,
                text: msg.message,
                sender: "user",
                timestamp: new Date(msg.timestamp + 'Z'), // Ensure UTC interpretation
                isError: false
              };

              // Create AI message
              const aiMessage = {
                id: `ai_${msg.id}`,
                text: msg.response,
                sender: "ai",
                timestamp: new Date(msg.timestamp + 'Z'), // Ensure UTC interpretation
                isError: false
              };

              return [userMessage, aiMessage];
            }).flat(); // Flatten the array of message pairs

            setMessages(messagesWithDates);
          }
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('ai-tutor-user');
          localStorage.removeItem('ai-tutor-token');
          localStorage.removeItem('ai-tutor-messages');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear invalid data
        localStorage.removeItem('ai-tutor-user');
        localStorage.removeItem('ai-tutor-token');
        localStorage.removeItem('ai-tutor-messages');
      }
    }
  };

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);



  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        dateKey = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    // Sort messages within each group by timestamp
    Object.keys(groups).forEach(dateKey => {
      groups[dateKey].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    return groups;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(new Date().toISOString()), // Ensure consistent UTC handling
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('ai-tutor-token');
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.text,
          context_data: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      const aiMessage = {
        id: `ai_${Date.now()}`,
        text: data.response,
        sender: "ai",
        timestamp: new Date(new Date().toISOString()), // Ensure consistent UTC handling
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(new Date().toISOString()), // Ensure consistent UTC handling
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClearChat = async () => {
    const token = localStorage.getItem('ai-tutor-token');

    try {
      const response = await fetch('/api/chat/history', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessages([]);
        setShowClearConfirm(false);
      } else {
        console.error('Failed to clear chat history');
        setShowClearError(true);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setShowClearError(true);
    }
  };

  const cancelClearChat = () => {
    setShowClearConfirm(false);
  };

  const closeClearError = () => {
    setShowClearError(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAuthError("");
    loadUserAndMessages();
  };

  const handleLoginError = (errorMessage) => {
    setAuthError(errorMessage);
  };

  const handleLogout = () => {
    // Clear Google OAuth session
    googleLogout();
    
    // Clear local state and storage
    setUser(null);
    setMessages([]);
    localStorage.removeItem('ai-tutor-user');
    localStorage.removeItem('ai-tutor-token');
  };

  const messageGroups = groupMessagesByDate(messages);
  
  // Sort groups by their earliest message timestamp
  const sortedGroupEntries = Object.entries(messageGroups).sort(([, messagesA], [, messagesB]) => {
    const earliestA = Math.min(...messagesA.map(m => new Date(m.timestamp)));
    const earliestB = Math.min(...messagesB.map(m => new Date(m.timestamp)));
    return earliestA - earliestB;
  });

  // Show login screen if user is not authenticated
  if (!user) {
    return (
      <AITutorLogin
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
        authError={authError}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-black overflow-hidden">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <AITutorNavbar
          user={user}
          onClearChat={clearChat}
          onLogout={handleLogout}
          messages={messages}
        />

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 min-h-0 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          <div className="max-w-4xl mx-auto">
            {Object.keys(messageGroups).length === 0 ? (
              <div className="text-center py-8 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <FaRobot className="text-white text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Welcome to JEE Challenger AI Tutor!
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto">
                  Your personalized JEE preparation assistant
                </p>
                <div className="max-w-2xl mx-auto space-y-4 text-left bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <p className="text-gray-700 dark:text-gray-200 text-sm font-semibold">
                    What I can help you with:
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2 ml-4">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Physics, Chemistry, and Mathematics concepts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>JEE Main and Advanced preparation strategies</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Study material recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Problem-solving techniques</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Exam tips and time management</span>
                    </li>
                  </ul>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    Just type your question below and I'll help you excel in your JEE journey!
                  </p>
                  <div className="mt-4 sm:mt-6 space-y-3">
                    <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                      Try asking:
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                      {[
                        "What are the important topics for JEE Physics?",
                        "How to solve integration problems?",
                        "Best books for JEE Chemistry",
                        "Time management tips for JEE"
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 border border-blue-200 dark:border-blue-800"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-3 max-w-[70%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === "user"
                              ? "bg-blue-500"
                              : "bg-gradient-to-r from-blue-500 to-purple-600"
                              }`}
                          >
                            {message.sender === "user" ? (
                              <FaUser className="text-white text-sm" />
                            ) : (
                              <FaRobot className="text-white text-sm" />
                            )}
                          </div>

                          <div className="flex flex-col">
                            {/* Message Bubble */}
                            <div
                              className={`px-5 py-4 rounded-2xl shadow-sm ${message.sender === "user"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                : message.isError
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-md"
                                }`}
                            >
                              <p className="text-base leading-relaxed whitespace-pre-wrap text-left">
                                {message.text}
                              </p>
                            </div>
                            {/* Timestamp */}
                            <p
                              className={`text-xs whitespace-nowrap mt-1 ${message.sender === "user"
                                ? "text-blue-500 dark:text-blue-400"
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

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[70%]">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaRobot className="text-white text-sm" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl">
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

        {/* Custom Clear Chat Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4 text-left">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FaTrash className="text-red-600 dark:text-red-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Clear Chat History
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to clear all chat messages? This will permanently delete your conversation history.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={cancelClearChat}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearChat}
                  className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 font-medium"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear Chat Error Modal */}
        {showClearError && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4 text-left">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FaTrash className="text-red-600 dark:text-red-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Failed to Clear Chat
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Something went wrong
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We couldn't clear your chat history at this time. Please try again later or contact support if the problem persists.
              </p>

              <div className="flex justify-center">
                <button
                  onClick={closeClearError}
                  className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-8 py-6 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about JEE preparation..."
                  className="w-full px-5 py-4 pr-8 border border-gray-300 dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
                  rows="1"
                  style={{
                    minHeight: "48px",
                    maxHeight: "120px",
                  }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-4 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm ${!inputMessage.trim() || isLoading
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                  }`}
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorComponent; 