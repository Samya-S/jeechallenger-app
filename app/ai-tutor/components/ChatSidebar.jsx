"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
  FloatingPortal,
  useClick,
  useDismiss,
  useInteractions,
  useHover,
} from "@floating-ui/react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Edit3,
  Check,
  X,
  MoreVertical,
  Home,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@teispace/next-themes";
import { FaSpinner } from "react-icons/fa";
import ChatListSkeleton from "./skeletons/ChatListSkeleton";

// Date categorization helper
const categorizeDate = (isoString) => {
  if (!isoString) return "Older";
  const date = new Date(isoString);
  const now = new Date();

  // Reset to midnight for day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const chatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today - chatDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Previous 7 Days";
  return "Older";
};

// --- Custom Tooltip Component ---
const HoverTooltip = ({
  children,
  text,
  side = "right",
  delay = 300,
  disabled = false,
  wrapperClassName = "w-full",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: !disabled && isOpen,
    onOpenChange: setIsOpen,
    placement: side,
    middleware: [offset(10), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: delay, close: 100 },
    mouseOnly: true,
  });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className={wrapperClassName}>
        {children}
      </div>
      {!disabled && isOpen && text && (
        <FloatingPortal>
          <div
            /* eslint-disable-next-line react-hooks/refs */
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="hidden lg:block z-[10050] max-w-xs px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 bg-white/95 dark:bg-[#131b2e]/95 backdrop-blur-md rounded-xl shadow-lg shadow-slate-200/60 dark:shadow-2xl dark:shadow-black/70 border border-slate-200/90 dark:border-slate-700/80 pointer-events-none transition-opacity leading-snug break-words"
          >
            {text}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

// --- ChatRow Component ---
const ChatRow = ({
  chat,
  activeChatId,
  isEditing,
  isRenaming,
  onSelectChat,
  onDeleteChat,
  startRename,
  editTitle,
  setEditTitle,
  handleRenameKeyDown,
  confirmRename,
  cancelRename,
  editInputRef,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isMenuOpen,
    onOpenChange: setIsMenuOpen,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const isActive = chat.id === activeChatId;

  return (
    <li className="relative group/row" data-chat-id={chat.id}>
      <HoverTooltip text={isEditing ? null : chat.title} side="right" delay={400} disabled={isMenuOpen || isEditing}>
        <div
          onClick={() => !isEditing && onSelectChat(chat.id)}
          className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
            isActive
              ? "bg-blue-50/90 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50 shadow-xs"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent"
          }`}
        >
          {isEditing ? (
            <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
              <input
                ref={editInputRef}
                value={editTitle}
                disabled={isRenaming}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => handleRenameKeyDown(chat.id, e)}
                className="flex-1 w-full text-xs px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-blue-500 outline-none text-slate-900 dark:text-slate-100 disabled:opacity-60 shadow-inner"
              />
              <button
                type="button"
                disabled={isRenaming}
                onClick={(e) => confirmRename(chat.id, e)}
                className="text-emerald-600 hover:text-emerald-700 p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                title="Save rename"
                aria-label="Save rename"
              >
                {isRenaming ? (
                  <FaSpinner className="animate-spin text-xs text-blue-500" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                disabled={isRenaming}
                onClick={cancelRename}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Cancel rename"
                aria-label="Cancel rename"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
              )}
              <MessageSquare
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-400 group-hover/row:text-slate-600 dark:group-hover/row:text-slate-300"
                }`}
              />

              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-medium truncate leading-tight">
                  {chat.title}
                </p>
              </div>

              {/* Action Menu Trigger (Three dots) */}
              <button
                ref={refs.setReference}
                type="button"
                {...getReferenceProps({
                  onClick(event) {
                    event.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  },
                })}
                className={`p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-opacity ${
                  isMenuOpen ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
                }`}
                aria-label="Chat options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Action Dropdown Menu */}
              {isMenuOpen && (
                <FloatingPortal>
                  <div
                    /* eslint-disable-next-line react-hooks/refs */
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="w-32 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-[10020] backdrop-blur-md"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        startRename(chat, e);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-slate-400" />
                      <span>Rename</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-rose-500" />
                      <span>Delete</span>
                    </button>
                  </div>
                </FloatingPortal>
              )}
            </>
          )}
        </div>
      </HoverTooltip>
    </li>
  );
};

// --- Main ChatSidebar Component ---
const ChatSidebar = ({
  chats = [],
  activeChatId,
  isLoadingChats,
  isOpen,
  initialChatId = null,
  onToggle,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  user,
  onLogout,
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const editInputRef = useRef(null);
  const listContainerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const hasAutoScrolledRef = useRef(false);

  const isDark = (resolvedTheme ?? theme) === "dark";

  // Filter chats by search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase().trim();
    return chats.filter((c) => (c.title || "").toLowerCase().includes(q));
  }, [chats, searchQuery]);

  // Group filtered chats into date categories
  const groupedChats = useMemo(() => {
    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: [],
    };

    filteredChats.forEach((chat) => {
      const category = categorizeDate(chat.last_message_at);
      if (groups[category]) {
        groups[category].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return groups;
  }, [filteredChats]);

  // Auto-scroll the sidebar to bring the active chat into center on direct URL load
  useEffect(() => {
    if (!initialChatId || hasAutoScrolledRef.current) return;
    if (!isOpen || isLoadingChats || !chats || chats.length === 0) return;

    const container = listContainerRef.current;
    if (!container) return;

    const escapedId = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(initialChatId) : initialChatId;
    const activeElement = container.querySelector(`[data-chat-id="${escapedId}"]`);
    if (!activeElement) {
      if (!isLoadingChats) {
        hasAutoScrolledRef.current = true;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!container || !activeElement || hasAutoScrolledRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      if (containerRect.height === 0 || elementRect.height === 0) return;

      const elementRelativeTop = elementRect.top - containerRect.top;
      const desiredRelativeTop = (containerRect.height - elementRect.height) / 2;
      const scrollDelta = elementRelativeTop - desiredRelativeTop;
      const targetScrollTop = container.scrollTop + scrollDelta;

      try {
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });
      } catch {
        container.scrollTop = Math.max(0, targetScrollTop);
      }

      hasAutoScrolledRef.current = true;
    }, 150);

    return () => clearTimeout(timer);
  }, [initialChatId, isOpen, isLoadingChats, chats]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Close user dropdown on outside click or Escape key
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userDropdownOpen]);

  const startRename = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const cancelRename = (e) => {
    if (isRenaming) return;
    e?.stopPropagation();
    setEditingId(null);
    setEditTitle("");
  };

  const confirmRename = async (chatId, e) => {
    e?.stopPropagation();
    const trimmed = editTitle.trim();
    if (!trimmed || isRenaming) return;
    setIsRenaming(true);
    try {
      await onRenameChat(chatId, trimmed);
    } finally {
      setIsRenaming(false);
      setEditingId(null);
      setEditTitle("");
    }
  };

  const handleRenameKeyDown = (chatId, e) => {
    if (isRenaming) return;
    if (e.key === "Enter") {
      e.preventDefault();
      confirmRename(chatId, e);
    } else if (e.key === "Escape") {
      cancelRename(e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDeleteChat(deleteConfirmId);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      {/* 1. Mobile Backdrop Overlay */}
      <div
        onClick={onToggle}
        className={`fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm z-[9990] lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* 2. Unified Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[9999] lg:z-30 h-full bg-slate-50 dark:bg-[#090e18] border-r border-slate-200/90 dark:border-slate-800/90 transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
          isOpen
            ? "w-72 sm:w-80 translate-x-0"
            : "w-0 -translate-x-full lg:w-16 lg:translate-x-0"
        }`}
      >
        {/* --- A. Expanded Desktop & Mobile Drawer View --- */}
        <div
          className={`flex flex-col h-full overflow-hidden transition-opacity duration-300 ${
            !isOpen ? "opacity-0 hidden" : "opacity-100 flex"
          }`}
        >
          {/* Header with JEE Challenger Brand and Collapse Toggle */}
          <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2.5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-90"
              title="JEE Challenger Home"
            >
              <img
                src="/brand/jee-challenger-navbar-no-tagline-light-mode.svg"
                alt="JEE Challenger"
                className="h-7 w-auto dark:hidden"
              />
              <img
                src="/brand/jee-challenger-navbar-no-tagline-dark-mode.svg"
                alt="JEE Challenger"
                className="h-7 w-auto hidden dark:block"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                AI Tutor
              </span>
            </Link>

            {/* Sidebar toggle button (PanelLeftClose) */}
            <button
              type="button"
              onClick={onToggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar & Compact '+ New' Chat Button Side-by-Side */}
          <div className="flex items-center gap-2 px-3 pt-3 pb-2 shrink-0">
            {/* Live Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-8 pr-7 py-2 text-xs bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400 outline-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ring-offset-transparent transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Small '+ New' Chat Button */}
            <button
              type="button"
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs hover:shadow-sm active:scale-95 shrink-0 group"
              title="New Chat"
              aria-label="New chat"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
              <span>New</span>
            </button>
          </div>

          {/* Conversations Section */}
          <div
            ref={listContainerRef}
            className={`flex-1 px-2.5 py-2 scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-700 ${
              isLoadingChats ? "overflow-hidden" : "overflow-y-auto"
            }`}
          >
            {isLoadingChats ? (
              <ChatListSkeleton />
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-10 px-4 text-slate-400 dark:text-slate-400 text-xs">
                {searchQuery ? (
                  <>
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">No chats found</p>
                    <p className="text-[11px]">No matches for &ldquo;{searchQuery}&rdquo;</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">No chats yet</p>
                    <p className="text-[11px]">Click &ldquo;New Chat&rdquo; to start learning with AI Tutor</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedChats).map(([category, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                        {category}
                      </div>
                      <ul className="space-y-1">
                        {items.map((chat) => (
                          <ChatRow
                            key={chat.id}
                            chat={chat}
                            activeChatId={activeChatId}
                            isEditing={editingId === chat.id}
                            isRenaming={editingId === chat.id && isRenaming}
                            onSelectChat={onSelectChat}
                            onDeleteChat={(id) => setDeleteConfirmId(id)}
                            startRename={startRename}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            editInputRef={editInputRef}
                            cancelRename={cancelRename}
                            confirmRename={confirmRename}
                            handleRenameKeyDown={handleRenameKeyDown}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop-Only Bottom Controls: User Profile, Theme Toggle, Return (Hidden on mobile since mobile top bar already handles it) */}
          <div className="hidden lg:block p-2.5 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-slate-100/50 dark:bg-slate-900/40">
            <div className="relative" ref={userDropdownRef}>
              <div className="flex items-center justify-between p-1.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                {/* User avatar & info button */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 flex-1 min-w-0 px-1 py-0.5 rounded-lg text-left hover:opacity-90 transition-opacity"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {user?.name || "Student"}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate leading-tight">
                      {user?.email || "JEE Challenger"}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="group/theme w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-3.5 h-3.5 text-slate-400 group-hover/theme:text-amber-400 transition-colors" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-500 group-hover/theme:text-slate-800 dark:group-hover/theme:text-slate-200 transition-colors" />
                  )}
                </button>
              </div>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn">
                  <Link
                    href="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors"
                  >
                    <Home className="w-3.5 h-3.5 text-blue-500" />
                    <span>Return to Home</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>My Profile</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- B. Collapsed Desktop Rail View (w-16) --- */}
        {!isOpen && (
          <div className="hidden lg:flex flex-col items-center justify-between h-full py-3.5 px-2">
            {/* Top Section: Brand Icon & Expand & New Chat */}
            <div className="flex flex-col items-center gap-3">
              {/* Brand Icon */}
              <Link
                href="/"
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <img
                  src="/brand/jee-challenger-icon-512-rounded.png"
                  alt="JEE Challenger"
                  className="w-7 h-7 object-contain"
                />
              </Link>

              {/* Expand Sidebar Button (PanelLeftOpen) */}
              <button
                type="button"
                onClick={onToggle}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>

              {/* Compact New Chat Button */}
              <button
                type="button"
                onClick={onNewChat}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
                aria-label="New chat"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="w-8 border-t border-slate-200 dark:border-slate-800 my-1" />

              {/* Recent chats quick list in collapsed mode (Tooltips strictly only for chats) */}
              <div className={`flex flex-col items-center gap-1.5 max-h-[48vh] scrollbar-hide py-1 ${isLoadingChats ? "overflow-hidden" : "overflow-y-auto"}`}>
                {isLoadingChats ? (
                  <div className="flex flex-col items-center gap-2 py-1 animate-pulse select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <div key={i} className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
                    ))}
                  </div>
                ) : (
                  chats.slice(0, 8).map((chat) => (
                    <HoverTooltip
                      key={chat.id}
                      text={chat.title}
                      side="right"
                      delay={200}
                      wrapperClassName="flex items-center justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                          chat.id === activeChatId
                            ? "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold border border-blue-300 dark:border-blue-800"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                        }`}
                        aria-label={chat.title}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </HoverTooltip>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Section: Theme Toggle & User Avatar */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="group/rail-theme w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-slate-400 group-hover/rail-theme:text-amber-400 transition-colors" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-500 group-hover/rail-theme:text-slate-800 dark:group-hover/rail-theme:text-slate-200 transition-colors" />
                )}
              </button>

              <Link
                href="/profile"
                className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-blue-500 transition-all"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                )}
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* 3. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 z-[10050] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm shadow-2xl animate-fadeIn">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Delete Conversation?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              This action cannot be undone. All messages and solutions in this chat will be permanently removed.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => !isDeleting && setDeleteConfirmId(null)}
                className="flex-1 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl disabled:opacity-50 transition-colors font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl disabled:opacity-70 flex items-center justify-center gap-1.5 transition-colors font-medium text-xs shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;
