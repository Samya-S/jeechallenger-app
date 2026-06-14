"use client";

import { useState, useRef, useEffect } from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
  FloatingPortal
} from "@floating-ui/react";
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
  FaEllipsisV,
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

const ChatRow = ({ chat, activeChatId, isEditing, onSelectChat, onDeleteChat, startRename, editingId, editTitle, setEditTitle, handleRenameKeyDown, confirmRename, cancelRename, editInputRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: isMenuOpen,
    onOpenChange: setIsMenuOpen,
    middleware: [
      // mainAxis: distance from button (vertical)
      // crossAxis: shift left/right (negative moves it left)
      offset({ mainAxis: 8, crossAxis: 115 }),
      flip(),
      shift({ padding: 10 })
    ],
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
  });

  const isActive = chat.id === activeChatId;

  return (
    <li className="relative">
      <div
        onClick={() => !isEditing && onSelectChat(chat.id)}
        className={`group relative flex items-center gap-2.5 px-3 py-3 rounded-xl cursor-pointer ${isActive ? "bg-white dark:bg-gray-800/90 shadow-sm" : "hover:bg-white/80 dark:hover:bg-gray-800/60"}`}
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
            {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />}
            <FaComments className={`flex-shrink-0 text-sm ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
            <div className="flex-1 truncate">
              <p className="text-sm truncate font-medium text-gray-700 dark:text-gray-300">{chat.title}</p>
            </div>

            <button
              ref={refs.setReference}
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FaEllipsisV className="text-xs" />
            </button>

            {isMenuOpen && (
              <FloatingPortal>
                <div
                  /* eslint-disable-next-line react-hooks/refs */
                  ref={refs.setFloating}
                  style={floatingStyles}
                  className="w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-1 z-[10000]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={(e) => { setIsMenuOpen(false); startRename(chat, e); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <FaPen className="text-[10px]" /> Rename
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <FaTrash className="text-[10px]" /> Delete
                  </button>
                </div>
              </FloatingPortal>
            )}
          </>
        )}
      </div>
    </li>
  );
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
  const [openMenuId, setOpenMenuId] = useState(null);

  const editInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startRename = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
    setOpenMenuId(null);
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
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* 2. Unified Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[9999] lg:z-auto h-full bg-gray-100 dark:bg-[#0e1117] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0
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
                {chats.map((chat) => (
                  <ChatRow
                    key={chat.id}
                    chat={chat}
                    activeChatId={activeChatId}
                    isEditing={editingId === chat.id}
                    onSelectChat={onSelectChat}
                    onDeleteChat={onDeleteChat}
                    startRename={(chat, e) => { setEditingId(chat.id); setEditTitle(chat.title); }}
                    editingId={editingId}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    editInputRef={editInputRef}
                    cancelRename={() => { setEditingId(null); setEditTitle(""); }}
                    confirmRename={async (id, e) => { await onRenameChat(id, editTitle); setEditingId(null); }}
                    handleRenameKeyDown={(id, e) => { if (e.key === 'Enter') onRenameChat(id, editTitle); }}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 4. Desktop Collapsed Rail */}
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