"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPaperPlane, FaChalkboardTeacher, FaUser, FaSpinner, FaPaperclip, FaRedo, FaStopCircle } from "react-icons/fa";
import { googleLogout } from '@react-oauth/google';
import AITutorLogin from "@/components/AiTutorComponents/AITutorLogin";
import AITutorNavbar from "@/components/AiTutorComponents/AITutorNavbar";
import ChatSidebar from "@/components/AiTutorComponents/ChatSidebar";
import FileAttachment from "@/components/AiTutorComponents/FileAttachment";
import { API_ENDPOINTS } from "@/lib/api-endpoints-config";
import { authenticatedFetch, clearAuthData } from "@/lib/auth-utils";
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import TextareaAutosize from 'react-textarea-autosize';

const MarkdownTable = ({ children }) => {
  const tableRef = useRef(null);

  useEffect(() => {
    const ref = tableRef.current;
    if (!ref) return undefined;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        ref.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    ref.addEventListener('wheel', onWheel, { passive: false });
    return () => ref.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div ref={tableRef} className="overflow-x-auto scrollbar-thin my-4">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 whitespace-nowrap">{children}</table>
    </div>
  );
};

// Component to render AI responses with markdown and math support
const AIResponseRenderer = ({ content }) => {
  return (
    <div className="text-base leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc mb-2 space-y-1 ml-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal mb-2 space-y-1 ml-4">{children}</ol>,
          li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{children}</code>
          ),
          pre: ({ children }) => <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 overflow-x-auto text-sm">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-2 italic mb-2 text-sm">{children}</blockquote>,
          table: ({ children }) => <MarkdownTable>{children}</MarkdownTable>,
          thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-200 dark:border-gray-700">{children}</tr>,
          th: ({ children }) => <th className="px-3 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border border-gray-300 dark:border-gray-700">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const parseApiError = async (response, defaultMessage) => {
  if (response.status === 429) {
    return "You've reached your daily limit for AI chat messages. Please try again tomorrow or upgrade your plan for higher limits.";
  }
  try {
    const errorData = await response.text();
    try {
      const jsonError = JSON.parse(errorData);
      return jsonError.detail || jsonError.message || defaultMessage;
    } catch {
      return errorData || defaultMessage;
    }
  } catch {
    return defaultMessage;
  }
};

const AITutorComponent = ({ chatId: urlChatId = null }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(urlChatId);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [abortController, setAbortController] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastLoadedChatIdRef = useRef(null);

  // Automatically open the sidebar if the user is on a desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(true);
    }
  }, []);

  // Lock body scroll and entirely prevent scroll chaining to keep address bar visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  // Add CSS to constrain KaTeX elements
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .katex-display {
        margin: 0.5em 0 !important;
        overflow-x: auto !important;
        max-width: 100% !important;
        position: relative !important;
      }
      .katex {
        font-size: 1em !important;
        position: relative !important;
      }
      .katex-html {
        position: relative !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Load user and chat list on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadUserAndChatList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync active chat and messages with URL
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('ai-tutor-token');
    if (!token) return;

    if (!urlChatId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveChatId(null);
      setMessages([]);
      setAttachedFiles([]);
      lastLoadedChatIdRef.current = null;
      return;
    }

    setActiveChatId(urlChatId);

    if (lastLoadedChatIdRef.current === urlChatId) return;

    lastLoadedChatIdRef.current = urlChatId;
    // eslint-disable-next-line react-hooks/immutability
    loadChatMessages(urlChatId, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlChatId, user]);

  const resolveAttachedFiles = async (attachedFileRefs, token) => {
    if (!attachedFileRefs || attachedFileRefs.length === 0) return [];

    const firstFile = attachedFileRefs[0];
    if (typeof firstFile !== 'string') return attachedFileRefs;

    try {
      const listResponse = await authenticatedFetch(API_ENDPOINTS.FILES.LIST, {
        headers: { Authorization: `Bearer ${token}` },
      }, handleLogout);

      if (listResponse.ok) {
        const listData = await listResponse.json();
        return attachedFileRefs.map((fileId) => {
          const fileData = listData?.find((file) => file.id === fileId);
          return fileData || {
            id: fileId,
            original_filename: `File ${fileId}`,
            file_size: 0,
            mime_type: 'application/octet-stream',
            file_type: 'other',
          };
        });
      }
    } catch (error) {
      console.error('Error fetching file list:', error);
    }

    return attachedFileRefs.map((fileId) => ({
      id: fileId,
      original_filename: `File ${fileId}`,
      file_size: 0,
      mime_type: 'application/octet-stream',
      file_type: 'other',
    }));
  };

  const convertApiMessagesToUi = async (apiMessages, token) => {
    const chronological = [...apiMessages].reverse();
    const pairs = await Promise.all(
      chronological.map(async (msg) => {
        const attachedFiles = await resolveAttachedFiles(msg.attached_files, token);
        const timestamp = new Date(msg.timestamp);

        return [
          {
            id: `user_${msg.id}`,
            text: msg.message,
            sender: "user",
            timestamp,
            isError: false,
            attachedFiles,
          },
          {
            id: `ai_${msg.id}`,
            text: msg.response,
            sender: "ai",
            timestamp,
            isError: false,
          },
        ];
      })
    );
    return pairs.flat();
  };

  const loadChats = async (token) => {
    setIsLoadingChats(true);
    try {
      const response = await authenticatedFetch(`${API_ENDPOINTS.CHATS.LIST}?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      }, handleLogout);

      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
        return data.chats || [];
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
    return [];
  };

  const loadChatMessages = async (chatId, token) => {
    setIsLoadingMessages(true);
    try {
      const response = await authenticatedFetch(`${API_ENDPOINTS.CHATS.MESSAGES(chatId)}?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      }, handleLogout);

      if (response.status === 404) {
        lastLoadedChatIdRef.current = null;
        router.replace('/ai-tutor');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const uiMessages = await convertApiMessagesToUi(data.messages || [], token);
        setMessages(uiMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadUserAndChatList = async () => {
    const token = localStorage.getItem('ai-tutor-token');

    if (!token) return;

    try {
      const userResponse = await authenticatedFetch(API_ENDPOINTS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` },
      }, handleLogout);

      if (!userResponse.ok) {
        clearAuthData();
        return;
      }

      const userData = await userResponse.json();
      setUser(userData);
      await loadChats(token);
    } catch (error) {
      console.error('Error loading user data:', error);
      clearAuthData();
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
      id: crypto.randomUUID(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      attachedFiles: attachedFiles.length > 0 ? attachedFiles : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);

    const token = localStorage.getItem('ai-tutor-token');
    const fileIds = attachedFiles.map((file) => file.id);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      let response;
      let data;

      if (!activeChatId) {
        response = await authenticatedFetch(API_ENDPOINTS.CHATS.CREATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage.text,
            file_ids: fileIds.length > 0 ? fileIds : undefined,
          }),
          signal: controller.signal,
        }, handleLogout);
      } else {
        response = await authenticatedFetch(API_ENDPOINTS.CHATS.MESSAGES(activeChatId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage.text,
            file_ids: fileIds.length > 0 ? fileIds : null,
          }),
          signal: controller.signal,
        }, handleLogout);
      }

      if (!response.ok) {
        throw new Error(await parseApiError(response, "Failed to get response from AI"));
      }

      data = await response.json();

      if (!activeChatId && data.chat_id) {
        lastLoadedChatIdRef.current = data.chat_id;
        setActiveChatId(data.chat_id);
        setChats((prev) => [
          {
            id: data.chat_id,
            title: data.chat_title || "New Chat",
            updated_at: new Date().toISOString(),
          },
          ...prev.filter((c) => c.id !== data.chat_id),
        ]);
        router.replace(`/ai-tutor/chat/${data.chat_id}`);
      } else if (activeChatId) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? { ...c, updated_at: new Date().toISOString() }
              : c
          ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        );
      }

      const aiMessage = {
        id: `ai_${data.message_id || crypto.randomUUID()}`,
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setAttachedFiles([]);
    } catch (error) {
      // Intercept the intentional abort
      if (error.name === 'AbortError' || error === 'User stopped generation') {
        const stopMessage = {
          id: crypto.randomUUID(),
          text: "Generation stopped.",
          sender: "ai",
          timestamp: new Date(),
          isError: true, // This makes it red
          failedText: userMessage.text, // This triggers our new Retry button!
        };
        setMessages((prev) => [...prev, stopMessage]);
        return;
      }

      console.error("Error sending message:", error);

      let displayMessage = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      if (typeof error.message === 'string' && (
        error.message.includes('limit') ||
        error.message.includes('File size') ||
        error.message.includes('Unsupported file type')
      )) {
        displayMessage = error.message;
      }

      const errorMessage = {
        id: crypto.randomUUID(),
        text: displayMessage,
        sender: "ai",
        timestamp: new Date(),
        isError: true,
        failedText: userMessage.text,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || isUploading || !inputMessage.trim()) return;
      sendMessage();
    }
  };

  const handleNewChat = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
    router.push('/ai-tutor');
    inputRef.current?.focus();
  };

  const handleSelectChat = (chatId) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
    if (chatId === activeChatId) return;
    router.push(`/ai-tutor/chat/${chatId}`);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleDeleteChat = async (chatId) => {
    const token = localStorage.getItem('ai-tutor-token');
    if (!token) return;

    try {
      const response = await authenticatedFetch(API_ENDPOINTS.CHATS.DELETE(chatId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }, handleLogout);

      if (response.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));

        if (activeChatId === chatId) {
          lastLoadedChatIdRef.current = null;
          router.push('/ai-tutor');
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleRenameChat = async (chatId, title) => {
    const token = localStorage.getItem('ai-tutor-token');
    if (!token) return;

    try {
      const response = await authenticatedFetch(API_ENDPOINTS.CHATS.UPDATE(chatId), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      }, handleLogout);

      if (response.ok) {
        setChats((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, title } : c))
        );
      }
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAuthError("");
    loadUserAndChatList();
  };

  const handleLoginError = (errorMessage) => {
    setAuthError(errorMessage);
  };

  const handleLogout = () => {
    googleLogout();

    setUser(null);
    setChats([]);
    setActiveChatId(null);
    setMessages([]);
    setInputMessage("");
    setIsLoading(false);
    setIsLoadingChats(false);
    setIsLoadingMessages(false);
    setSidebarOpen(false);
    setAuthError("");
    setAttachedFiles([]);
    setIsUploading(false);
    setUploadError("");

    lastLoadedChatIdRef.current = null;
    clearAuthData();
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

  // Direct file upload handler
  const handleDirectFileUpload = async (files) => {
    setUploadError("");
    setIsUploading(true);
    const token = localStorage.getItem('ai-tutor-token');
    if (!token) {
      handleLogout();
      setIsUploading(false);
      return;
    }
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    try {
      const response = await authenticatedFetch(API_ENDPOINTS.FILES.UPLOAD, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      }, handleLogout);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        if (response.status === 429) {
          errorMessage = "You've reached your daily limit for file uploads. Please try again tomorrow or upgrade your plan for higher limits.";
        } else if (response.status === 413) {
          errorMessage = "File size too large. Please choose a smaller file or upgrade your plan for larger file uploads.";
        } else if (response.status === 400) {
          errorMessage = "Unsupported file type. Please check your plan's supported file types or upgrade for more options.";
        } else {
          try {
            const errorData = await response.text();
            try {
              const jsonError = JSON.parse(errorData);
              errorMessage = jsonError.detail || jsonError.message || errorMessage;
            } catch {
              errorMessage = errorData || errorMessage;
            }
          } catch { }
        }

        throw new Error(errorMessage);
      }
      const data = await response.json();
      setAttachedFiles(prev => [...prev, ...(data.files || [])]);
    } catch (error) {
      let displayError = 'Failed to upload files';
      if (typeof error.message === 'string' && (
        error.message.includes('limit') ||
        error.message.includes('File size') ||
        error.message.includes('Unsupported file type')
      )) {
        displayError = error.message;
      }
      setUploadError(displayError);
    } finally {
      setIsUploading(false);
    }
  };

  // Restore removeAttachedFile handler
  const removeAttachedFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="fixed inset-0 h-[100dvh] bg-gray-50 dark:bg-black overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <AITutorNavbar
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <div className="flex flex-1 min-h-0">
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            isLoadingChats={isLoadingChats}
            isOpen={sidebarOpen}
            onToggle={handleToggleSidebar}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />

          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 min-h-0 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              <div className="max-w-4xl mx-auto">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-16">
                    <FaSpinner className="animate-spin text-blue-500 mr-2" />
                    <span className="text-gray-500 dark:text-gray-400">Loading messages...</span>
                  </div>
                ) : Object.keys(messageGroups).length === 0 ? (
                  <div className="text-center py-8 sm:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <FaChalkboardTeacher className="text-white text-2xl sm:text-3xl" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      Welcome to JEE Challenger AI Tutor!
                    </h1>
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
                        Just type your question below and I&lsquo;ll help you excel in your JEE journey!
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
                                            onClick={() => {
                                              // 1. Remove this error message from the chat
                                              setMessages(prev => prev.filter(m => m.id !== message.id));
                                              // 2. Put their text back into the input box
                                              setInputMessage(message.failedText);
                                              // 3. Focus the input so they can instantly hit enter again
                                              inputRef.current?.focus();
                                            }}
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
                                      {/* <p className="text-xs opacity-80">Attached files:</p> */}
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

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg">
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
                        Ask me anything about JEE preparation...
                      </div>
                    )}

                    <TextareaAutosize
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      minRows={1}
                      maxRows={5}
                      className="w-full py-1 px-1 resize-none bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white overflow-y-scroll scrollbar-hide relative z-10"
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  Press Enter to send, Shift+Enter for new line • Click 📎 to attach files
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorComponent; 