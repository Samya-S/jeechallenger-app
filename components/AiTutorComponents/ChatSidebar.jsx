"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaPlus,
  FaComments,
  FaTrash,
  FaPen,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const formatRelativeDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ChatSidebar = ({
  chats,
  activeChatId,
  isLoadingChats,
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const startRename = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const cancelRename = (e) => {
    e?.stopPropagation();
    setEditingId(null);
    setEditTitle("");
  };

  const confirmRename = async (chatId, e) => {
    e?.stopPropagation();
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    await onRenameChat(chatId, trimmed);
    setEditingId(null);
    setEditTitle("");
  };

  const handleRenameKeyDown = (chatId, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmRename(chatId, e);
    } else if (e.key === "Escape") {
      cancelRename(e);
    }
  };

  /* ── Collapsed rail (desktop only) ── */
  if (isCollapsed) {
    return (
      <>
        <aside className="hidden lg:flex flex-col items-center w-14 flex-shrink-0 h-full bg-gray-100 dark:bg-[#0e1117] border-r border-gray-200 dark:border-gray-800 py-3 gap-3">
          <button
            onClick={onToggleCollapse}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <FaChevronRight className="text-sm" />
          </button>
          <button
            onClick={onNewChat}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
            title="New chat"
            aria-label="New chat"
          >
            <FaPlus className="text-sm" />
          </button>
          <div className="w-6 border-t border-gray-200 dark:border-gray-800" />
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-2 py-1 scrollbar-thin">
            {chats.slice(0, 8).map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                title={chat.title}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  chat.id === activeChatId
                    ? "bg-blue-600/20 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FaComments className="text-xs" />
              </button>
            ))}
          </div>
        </aside>
      </>
    );
  }

  /* ── Full sidebar ── */
  const sidebarPanel = (
    <aside
      className={`
        flex flex-col h-full flex-shrink-0
        bg-gray-100 dark:bg-[#0e1117]
        border-r border-gray-200 dark:border-gray-800
        transition-transform duration-300 ease-in-out
        w-72 sm:w-80
        fixed lg:relative inset-y-0 left-0 z-50
        pt-[4.5rem] lg:pt-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Conversations
        </span>
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        <button
          onClick={onClose}
          className="lg:hidden w-7 h-7 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>

      {/* New chat button */}
      <div className="px-3 py-3 flex-shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <FaPlus className="text-sm" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {isLoadingChats ? (
          <div className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <FaSpinner className="animate-spin mr-2 text-blue-500" />
            <span className="text-sm">Loading chats...</span>
          </div>
        ) : chats.length === 0 ? (
          <div className="px-2 py-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaComments className="text-blue-500 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              No conversations yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const isEditing = editingId === chat.id;

              return (
                <li key={chat.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => !isEditing && onSelectChat(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isEditing) onSelectChat(chat.id);
                    }}
                    className={`group relative flex items-center gap-2.5 px-3 py-3 rounded-xl cursor-pointer transition-[box-shadow,ring-color] duration-150 ${
                      isActive
                        ? "bg-white dark:bg-gray-800/90 shadow-sm ring-1 ring-blue-500/25 dark:ring-blue-400/20"
                        : "hover:bg-white/80 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                    )}

                    <FaComments
                      className={`flex-shrink-0 text-sm ml-0.5 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            ref={editInputRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleRenameKeyDown(chat.id, e)}
                            className="flex-1 min-w-0 text-sm px-2 py-1 rounded-lg border border-blue-400/50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                            maxLength={100}
                          />
                          <button
                            onClick={(e) => confirmRename(chat.id, e)}
                            className="p-1.5 rounded-md text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                            aria-label="Save rename"
                          >
                            <FaCheck className="text-xs" />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Cancel rename"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p
                            className={`text-sm font-medium truncate leading-snug ${
                              isActive
                                ? "text-gray-900 dark:text-gray-100"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {chat.title}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {formatRelativeDate(chat.updated_at)}
                          </p>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={(e) => startRename(chat, e)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          aria-label="Rename chat"
                        >
                          <FaPen className="text-xs" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(chat.id);
                          }}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          aria-label="Delete chat"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {sidebarPanel}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <FaTrash className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Chat
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Are you sure you want to delete this conversation and all its messages?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteChat(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;
