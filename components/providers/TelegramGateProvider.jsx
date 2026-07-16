"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import TelegramGateModal from "./TelegramGateModal";

const TelegramGateContext = createContext(null);

export function useTelegramGate() {
  return useContext(TelegramGateContext);
}

export default function TelegramGateProvider({ children }) {
  const [modalState, setModalState] = useState({ isOpen: false, targetUrl: null });

  const openGate = useCallback((url) => {
    setModalState({ isOpen: true, targetUrl: url });
  }, []);

  const closeGate = useCallback(() => {
    setModalState({ isOpen: false, targetUrl: null });
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href?.includes("t.me/c/")) return;

      e.preventDefault();
      e.stopPropagation();
      openGate(href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [openGate]);

  return (
    <TelegramGateContext.Provider value={{ openGate }}>
      {children}
      <TelegramGateModal
        isOpen={modalState.isOpen}
        targetUrl={modalState.targetUrl}
        onClose={closeGate}
      />
    </TelegramGateContext.Provider>
  );
}