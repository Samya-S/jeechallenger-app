"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaSpinner, FaChevronDown } from "react-icons/fa";

import AITutorNavbar from "@/app/ai-tutor/components/AITutorNavbar";
import ChatSidebar from "@/app/ai-tutor/components/ChatSidebar";
import ChatMessageList from "@/app/ai-tutor/components/ChatMessageList";
import ChatInputArea from "@/app/ai-tutor/components/ChatInputArea";
import { API_ENDPOINTS } from "@/config/api-endpoints-config";
import {
  DESKTOP_PLACEHOLDERS,
  MOBILE_PLACEHOLDERS,
  parseApiError,
  groupMessagesByDate
} from "@/app/ai-tutor/utils/aiTutorUtils";

const AITutorComponent = ({ chatId: urlChatId = null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

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
  const [placeholder, setPlaceholder] = useState("Ask me anything about JEE preparation...");
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const lastLoadedChatIdRef = useRef(null);
  const initialChatIdRef = useRef(urlChatId);

  // --- START OF REACTIVE URL CLEANUP ---
  useEffect(() => {
    const errorParam = searchParams.get('error');

    if (errorParam) {
      if (errorParam === 'Callback' || errorParam === 'AccessDenied') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuthError('Authentication was cancelled or failed. Please try again.');
      } else {
        setAuthError('An error occurred during login. Please try again.');
      }

      router.replace('/ai-tutor', { scroll: false });
    }
  }, [searchParams, router]);
  // --- END OF REACTIVE URL CLEANUP ---

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

  // Redirect to centralized login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    }
  }, [status, router]);

  // Load chat list once authenticated
  useEffect(() => {
    if (status === "authenticated") {
      // eslint-disable-next-line react-hooks/immutability
      loadChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Sync active chat and messages with URL
  useEffect(() => {
    if (status !== "authenticated") return;

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
    loadChatMessages(urlChatId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlChatId, status]);

  // Note: We use credentials 'include' so Next.js rewrites forward our cookies automatically
  const resolveAttachedFiles = async (attachedFileRefs) => {
    if (!attachedFileRefs || attachedFileRefs.length === 0) return [];

    const firstFile = attachedFileRefs[0];
    if (typeof firstFile !== 'string') return attachedFileRefs;

    try {
      const listResponse = await fetch(API_ENDPOINTS.FILES.LIST, {
        credentials: 'include'
      });

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

  const convertApiMessagesToUi = async (apiMessages) => {
    const chronological = [...apiMessages].reverse();
    const pairs = await Promise.all(
      chronological.map(async (msg) => {
        const attachedFiles = await resolveAttachedFiles(msg.attached_files);
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

  const loadChats = async () => {
    setIsLoadingChats(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.CHATS.LIST}?limit=50`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
        return data.chats || [];
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
    return [];
  };

  const loadChatMessages = async (chatId) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.CHATS.MESSAGES(chatId)}?limit=50`, {
        credentials: 'include'
      });

      if (response.status === 404) {
        lastLoadedChatIdRef.current = null;
        router.replace('/ai-tutor');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const uiMessages = await convertApiMessagesToUi(data.messages || []);
        setMessages(uiMessages);
      } else if (response.status === 401) {
        handleLogout();
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

  // Scroll to last user message so it sits at top of viewport (exact position as on mount)
  const scrollToLastUserMessage = (smooth = false) => {
    let lastUserMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        lastUserMsg = messages[i];
        break;
      }
    }

    const behavior = smooth ? "smooth" : "auto";
    if (lastUserMsg) {
      const element = document.getElementById(`message-${lastUserMsg.id}`);
      if (element) {
        element.scrollIntoView({ behavior, block: "start" });
        return;
      }
    }
    // Fallback if no user message is found
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) {
      setShowScrollBottom(false);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

    // Condition 1: The response of the latest message is completely visible
    let isResponseFullyVisible = distanceFromBottom <= 60;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg) {
      const lastMsgEl = document.getElementById(`message-${lastMsg.id}`);
      if (lastMsgEl) {
        const lastMsgRect = lastMsgEl.getBoundingClientRect();
        if (lastMsgRect.bottom <= containerRect.bottom + 20) {
          isResponseFullyVisible = true;
        }
      }
    }

    // Condition 2: The latest user message is at the top of the page (or scrolled past it)
    let lastUserMsg = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "user") {
        lastUserMsg = messages[i];
        break;
      }
    }

    let isLastUserMsgAtOrPastTop = false;
    if (lastUserMsg) {
      const userMsgEl = document.getElementById(`message-${lastUserMsg.id}`);
      if (userMsgEl) {
        const userMsgRect = userMsgEl.getBoundingClientRect();
        isLastUserMsgAtOrPastTop = userMsgRect.top <= containerRect.top + 80;
      }
    }

    const shouldHide = isResponseFullyVisible || isLastUserMsgAtOrPastTop;
    setShowScrollBottom(!shouldHide);
  };

  // Client-side dynamic placeholder selection for desktop and mobile (SSR & Vercel friendly)
  useEffect(() => {
    const pickRandomPlaceholder = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const list = isMobile ? MOBILE_PLACEHOLDERS : DESKTOP_PLACEHOLDERS;
      const randomText = list[Math.floor(Math.random() * list.length)];
      setPlaceholder(randomText);
    };

    pickRandomPlaceholder();
  }, [activeChatId]);

  useEffect(() => {
    scrollToLastUserMessage();
    setShowScrollBottom(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update document title dynamically based on active chat and prevent Next.js from overwriting it
  useEffect(() => {
    let desiredTitle = "Personalized AI Tutor | JEE Challenger";

    if (activeChatId && chats.length > 0) {
      const activeChat = chats.find(c => c.id === activeChatId);
      if (activeChat) {
        desiredTitle = `${activeChat.title} - AI Tutor | JEE Challenger`;
      } else {
        desiredTitle = "AI Tutor Chat | JEE Challenger";
      }
    }

    document.title = desiredTitle;

    const observer = new MutationObserver(() => {
      if (document.title !== desiredTitle) {
        document.title = desiredTitle;
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [activeChatId, chats]);

  // Group messages by date
  const messageGroups = groupMessagesByDate(messages);

  // Sort groups by their earliest message timestamp
  const sortedGroupEntries = Object.entries(messageGroups).sort(([, messagesA], [, messagesB]) => {
    const earliestA = Math.min(...messagesA.map(m => new Date(m.timestamp)));
    const earliestB = Math.min(...messagesB.map(m => new Date(m.timestamp)));
    return earliestA - earliestB;
  });

  // Show loading state while NextAuth determines session status
  if (status === "loading") {
    return (
      <div className="fixed inset-0 h-[100dvh] bg-gray-50 dark:bg-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-3xl" />
      </div>
    );
  }

  // Show loading spinner while redirecting if unauthenticated
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="fixed inset-0 h-[100dvh] bg-gray-50 dark:bg-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-3xl" />
      </div>
    );
  }

  const handleDirectFileUpload = async (files) => {
    setUploadError("");
    setIsUploading(true);

    const compiledFiles = [];

    try {
      for (const file of Array.from(files)) {
        const reqResponse = await fetch(API_ENDPOINTS.FILES.REQUEST_UPLOAD, {
          method: 'POST',
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            mime_type: file.type || 'application/octet-stream',
            file_size: file.size
          })
        });

        if (reqResponse.status === 401) {
          handleLogout();
          return;
        }

        if (!reqResponse.ok) {
          const errorMessage = await parseApiError(reqResponse, `Upload failed (HTTP ${reqResponse.status})`);
          throw new Error(errorMessage);
        }

        const reqData = await reqResponse.json();
        const { presigned_url, file_path } = reqData;

        const r2Response = await fetch(presigned_url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type || 'application/octet-stream'
          },
          body: file
        });

        if (!r2Response.ok) {
          throw new Error(`Direct upload failed with status code: ${r2Response.status}`);
        }

        const confirmResponse = await fetch(API_ENDPOINTS.FILES.CONFIRM_UPLOAD, {
          method: 'POST',
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_path: file_path,
            filename: file.name,
            mime_type: file.type || 'application/octet-stream',
            file_size: file.size
          })
        });

        if (!confirmResponse.ok) {
          throw new Error(`Failed to commit file upload state metadata token.`);
        }

        const confirmData = await confirmResponse.json();
        if (confirmData.files && confirmData.files[0]) {
          compiledFiles.push(confirmData.files[0]);
        }
      }

      setAttachedFiles(prev => [...prev, ...compiledFiles]);
    } catch (error) {
      console.error(error);
      let displayError = 'Failed to upload files';
      if (error && typeof error.message === 'string' && error.message.trim()) {
        const msg = error.message.trim();
        if (!msg.startsWith('TypeError') && !msg.includes('Failed to fetch')) {
          displayError = msg;
        }
      }
      setUploadError(displayError);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachedFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || status !== "authenticated") return;

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

    const fileIds = attachedFiles.map((file) => file.id);
    const controller = new AbortController();
    setAbortController(controller);

    try {
      let response;
      let data;

      if (!activeChatId) {
        response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.text,
            file_ids: fileIds.length > 0 ? fileIds : undefined,
          }),
          signal: controller.signal,
        });
      } else {
        response = await fetch(API_ENDPOINTS.CHATS.MESSAGES(activeChatId), {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.text,
            file_ids: fileIds.length > 0 ? fileIds : null,
          }),
          signal: controller.signal,
        });
      }

      if (response.status === 401) {
        handleLogout();
        return;
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
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, updated_at: new Date().toISOString() }
            : c
        ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      );
      setAttachedFiles([]);
    } catch (error) {
      if (error.name === 'AbortError' || error === 'User stopped generation') {
        const stopMessage = {
          id: crypto.randomUUID(),
          text: "Generation stopped.",
          sender: "ai",
          timestamp: new Date(),
          isError: true,
          failedText: userMessage.text,
        };
        setMessages((prev) => [...prev, stopMessage]);
        return;
      }

      console.error("Error sending message:", error);

      let displayMessage = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      if (error && typeof error.message === 'string' && error.message.trim()) {
        const msg = error.message.trim();
        if (!msg.startsWith('TypeError') && !msg.startsWith('SyntaxError') && !msg.includes('Failed to fetch')) {
          displayMessage = msg;
        }
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
    const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024));
    if (isMobileDevice) {
      return;
    }

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
    try {
      const response = await fetch(API_ENDPOINTS.CHATS.DELETE(chatId), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setChats((prev) => prev.filter((c) => c.id !== chatId));

        if (activeChatId === chatId) {
          lastLoadedChatIdRef.current = null;
          router.push('/ai-tutor');
        }
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleRenameChat = async (chatId, title) => {
    try {
      const response = await fetch(API_ENDPOINTS.CHATS.UPDATE(chatId), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setChats((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, title } : c))
        );
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: window.location.pathname + window.location.search });
  };

  return (
    <div className="fixed inset-0 h-[100dvh] bg-gray-50 dark:bg-black overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <AITutorNavbar
          user={session.user}
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
            initialChatId={initialChatIdRef.current}
            onToggle={handleToggleSidebar}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />

          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Messages Wrapper with Scroll-to-Bottom Button */}
            <div className="relative flex-1 min-h-0 flex flex-col">
              <ChatMessageList
                messagesContainerRef={messagesContainerRef}
                messagesEndRef={messagesEndRef}
                onScroll={handleMessagesScroll}
                isLoadingMessages={isLoadingMessages}
                messageGroups={messageGroups}
                sortedGroupEntries={sortedGroupEntries}
                isLoading={isLoading}
                onSelectSuggestion={(suggestion) => setInputMessage(suggestion)}
                onRetryMessage={(message) => {
                  setMessages((prev) => prev.filter((m) => m.id !== message.id));
                  setInputMessage(message.failedText);
                  inputRef.current?.focus();
                }}
              />

              {/* Floating Scroll to Latest Message Button */}
              {showScrollBottom && (
                <button
                  onClick={() => scrollToLastUserMessage(true)}
                  className="absolute bottom-4 right-5 sm:right-8 z-30 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg shadow-blue-500/25 dark:shadow-purple-900/40 border border-white/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group cursor-pointer"
                  aria-label="Scroll to latest message"
                  title="Scroll to latest message"
                >
                  <FaChevronDown className="text-sm sm:text-base group-hover:translate-y-0.5 transition-transform duration-150" />
                </button>
              )}
            </div>

            {/* Input Area */}
            <ChatInputArea
              attachedFiles={attachedFiles}
              removeAttachedFile={removeAttachedFile}
              isUploading={isUploading}
              uploadError={uploadError}
              fileInputRef={fileInputRef}
              inputRef={inputRef}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              placeholder={placeholder}
              handleKeyPress={handleKeyPress}
              handleDirectFileUpload={handleDirectFileUpload}
              isLoading={isLoading}
              abortController={abortController}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorComponent;
