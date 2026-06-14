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
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ChatSidebar = ({
  chats,
  activeChatId,
  isLoadingChats,
  isOpen,
  onToggle,
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

  return (
    <>
      {/* 1. Mobile Background Overlay */}
      <div
        onClick={onToggle}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* 2. Unified Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[9999] lg:z-auto h-full bg-gray-100 dark:bg-[#0e1117] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0
          /* Responsive Widths and Positioning */
          ${isOpen ? "w-72 sm:w-80 translate-x-0" : "w-0 -translate-x-full lg:w-14 lg:translate-x-0"}
        `}
      >
        {/* 3. Main Sidebar Panel */}
        <div className={`flex flex-col h-full overflow-hidden transition-opacity duration-300 ${!isOpen ? "opacity-0 hidden" : "opacity-100 flex"}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <span className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 whitespace-nowrap">
              Conversations
            </span>
            <button
              onClick={onToggle}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <FaChevronLeft className="text-sm" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-3 py-3 shrink-0">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              <FaPlus className="text-sm" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
            {isLoadingChats ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <FaSpinner className="animate-spin mr-2 text-blue-500" />
              </div>
            ) : (
              <ul className="space-y-2 mt-2">
                {chats.map((chat) => {
                  const isActive = chat.id === activeChatId;
                  const isEditing = editingId === chat.id;

                  return (
                    <li key={chat.id}>
                      <div
                        onClick={() => !isEditing && onSelectChat(chat.id)}
                        className={`group relative flex items-center gap-2.5 px-3 py-3 rounded-xl cursor-pointer ${
                          isActive
                            ? "bg-white dark:bg-gray-800/90 shadow-sm"
                            : "hover:bg-white/80 dark:hover:bg-gray-800/60"
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              ref={editInputRef}
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => handleRenameKeyDown(chat.id, e)}
                              className="flex-1 w-full text-sm px-2 py-1 rounded bg-white dark:bg-gray-900 border border-blue-500 outline-none text-gray-900 dark:text-gray-100"
                            />
                            <button onClick={(e) => confirmRename(chat.id, e)} className="text-green-600 p-1"><FaCheck className="text-xs" /></button>
                            <button onClick={cancelRename} className="text-gray-400 p-1"><FaTimes className="text-xs" /></button>
                          </div>
                        ) : (
                          <>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                            )}
                            <FaComments className={`flex-shrink-0 text-sm ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
                            <div className="flex-1 truncate">
                              <p className="text-sm truncate font-medium text-gray-700 dark:text-gray-300">{chat.title}</p>
                              <p className="text-[10px] text-gray-400">{formatRelativeDate(chat.updated_at)}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => startRename(chat, e)} className="p-1.5 hover:text-blue-600 text-gray-400 transition-colors"><FaPen className="text-xs" /></button>
                              <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(chat.id); }} className="p-1.5 hover:text-red-600 text-gray-400 transition-colors"><FaTrash className="text-xs" /></button>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* 4. Desktop Collapsed Rail (Visible ONLY on desktop when closed) */}
        {!isOpen && (
          <div className="hidden lg:flex flex-col items-center py-3 gap-3">
             <button onClick={onToggle} className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"><FaChevronRight /></button>
             <button onClick={onNewChat} className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-md"><FaPlus /></button>
             <div className="w-6 border-t border-gray-200 dark:border-gray-800" />
             <div className="flex flex-col items-center gap-2 py-1">
                {chats.slice(0, 8).map((chat) => (
                  <button key={chat.id} onClick={() => onSelectChat(chat.id)} className={`w-9 h-9 flex items-center justify-center rounded-lg ${chat.id === activeChatId ? "bg-blue-600/20 text-blue-600" : "text-gray-400"}`}>
                    <FaComments className="text-xs" />
                  </button>
                ))}
             </div>
          </div>
        )}
      </aside>

      {/* 5. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Delete Chat?</h2>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">Cancel</button>
              <button onClick={async () => { await onDeleteChat(deleteConfirmId); setDeleteConfirmId(null); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;