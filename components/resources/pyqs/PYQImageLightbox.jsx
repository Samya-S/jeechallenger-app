"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function PYQImageLightbox({ src, alt = "Zoomed Diagram", onClose }) {
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const imageRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const initialTouchDistance = useRef(null);
  const initialTouchScale = useRef(1);

  const updatePosition = useCallback((newPos) => {
    positionRef.current = newPos;
    setPosition(newPos);
  }, []);

  // Mount only on client for Portal
  useEffect(() => {
    setMounted(true);
    // Lock body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Reset zoom & pan
  const handleReset = useCallback(() => {
    setScale(1);
    updatePosition({ x: 0, y: 0 });
  }, [updatePosition]);

  // Toggle 1x / 2x zoom on image click
  const handleImageClick = (e) => {
    e.stopPropagation();
    // Ignore click if the user was dragging/panning
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    if (scale === 1) {
      setScale(2);
    } else {
      handleReset();
    }
  };

  const handleZoomIn = (e) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) updatePosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.2, 3.5));
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.2, 1);
        if (next === 1) updatePosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Mouse Drag handlers with global window listeners for smooth panning
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    if (e.button !== 0) return;
    e.stopPropagation();

    hasDragged.current = false;
    dragOrigin.current = { x: e.clientX, y: e.clientY };
    dragStart.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e) => {
      const dist = Math.hypot(
        e.clientX - dragOrigin.current.x,
        e.clientY - dragOrigin.current.y
      );
      if (dist > 5) {
        hasDragged.current = true;
      }
      updatePosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => {
        hasDragged.current = false;
      }, 150);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, updatePosition]);

  // Touch handlers for mobile pinch-to-zoom & pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      hasDragged.current = true;
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialTouchDistance.current = distance;
      initialTouchScale.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      hasDragged.current = false;
      dragOrigin.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragStart.current = {
        x: e.touches[0].clientX - positionRef.current.x,
        y: e.touches[0].clientY - positionRef.current.y,
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialTouchDistance.current) {
      e.preventDefault();
      hasDragged.current = true;
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDistance / initialTouchDistance.current;
      const newScale = Math.min(Math.max(initialTouchScale.current * factor, 1), 3.5);
      setScale(newScale);
      if (newScale === 1) {
        updatePosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - dragOrigin.current.x,
        e.touches[0].clientY - dragOrigin.current.y
      );
      if (dist > 5) {
        hasDragged.current = true;
      }
      updatePosition({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      initialTouchDistance.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
      setTimeout(() => {
        hasDragged.current = false;
      }, 150);
    }
  };

  if (!mounted || !src) return null;

  return createPortal(
    <div
      onClick={onClose}
      onWheel={handleWheel}
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none cursor-zoom-out"
    >
      {/* Top Bar Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 right-4 z-10 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Diagram Viewer"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center backdrop-blur-md shadow-xl border border-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center overflow-hidden p-2"
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200/20 dark:border-gray-800 pointer-events-auto select-none"
          draggable={false}
        />
      </div>

      {/* Floating Bottom Control Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-900/90 dark:bg-gray-800/90 text-white backdrop-blur-md border border-white/10 shadow-2xl z-10 cursor-default"
      >
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= 1}
          aria-label="Zoom Out"
          className="p-2 rounded-xl hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-bold px-2 min-w-[3.5rem] text-center text-gray-300">
          {Math.round(scale * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= 3.5}
          aria-label="Zoom In"
          className="p-2 rounded-xl hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {scale > 1 && (
          <>
            <div className="h-4 w-px bg-white/20 mx-1" />
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset Zoom"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-white/10 active:scale-95 text-xs font-semibold text-orange-400 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
