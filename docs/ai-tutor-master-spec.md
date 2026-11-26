# JEE Challenger: AI Tutor Engine — Master Specification
**Document Version:** 2.0.0  
**Status:** Approved Architectural Blueprint (Source of Truth)  
**Target Applications:** `jeechallenger-app`, `jeechallenger-ai`  
**Last Updated:** November 26, 2026 (UI Revamp, Unified Shared Skeletons, Zero-Jitter State Machine, Dual-Mode Sidebar)

---

## Table of Contents
1. [Core Philosophy & High-Level System Architecture](#1-core-philosophy--high-level-system-architecture)
   - [1.1 Unbuffered Next.js BFF SSE Proxy](#11-unbuffered-nextjs-bff-sse-proxy)
   - [1.2 Session Authentication & Security](#12-session-authentication--security)
2. [Authentic Frontend UI & Responsive Layout Anatomy](#2-authentic-frontend-ui--responsive-layout-anatomy)
   - [2.1 Desktop Dual-Mode Sidebar (Expanded & Collapsed Rail)](#21-desktop-dual-mode-sidebar-expanded--collapsed-rail)
   - [2.2 Mobile Responsive Architecture (Fixed Header & Slideover Drawer)](#22-mobile-responsive-architecture-fixed-header--slideover-drawer)
   - [2.3 Layout Containment & Vertical Rhythm](#23-layout-containment--vertical-rhythm)
3. [Zero-Jitter Loading & Shared Skeleton Engine](#3-zero-jitter-loading--shared-skeleton-engine)
   - [3.1 The Two-Phase Loading Lifecycle](#31-the-two-phase-loading-lifecycle)
   - [3.2 Single Source of Truth Skeleton Primitives](#32-single-source-of-truth-skeleton-primitives)
   - [3.3 Alternating Conversational Rhythm & 90% Fade Mask](#33-alternating-conversational-rhythm--90-fade-mask)
4. [Client State Machine & Lifecycle](#4-client-state-machine--lifecycle)
   - [4.1 Route-Derived State Initialization (Eliminating Layout Flashes)](#41-route-derived-state-initialization-eliminating-layout-flashes)
   - [4.2 Welcome Screen Route Guard](#42-welcome-screen-route-guard)
   - [4.3 Background Stream Persistence Across Chat Navigation](#43-background-stream-persistence-across-chat-navigation)
   - [4.4 Auto-Scroll State Machine & Smart Pause on Scroll-Up](#44-auto-scroll-state-machine--smart-pause-on-scroll-up)
5. [Multimedia Upload & Drag-and-Drop Pipeline](#5-multimedia-upload--drag-and-drop-pipeline)
   - [5.1 Full-Window Drag-and-Drop Overlay](#51-full-window-drag-and-drop-overlay)
   - [5.2 Clipboard Direct Image Paste (`Ctrl + V`)](#52-clipboard-direct-image-paste-ctrl--v)
   - [5.3 File Preview Strip & Upload Lifecycle](#53-file-preview-strip--upload-lifecycle)
6. [Conversational Math & Derivation Engine](#6-conversational-math--derivation-engine)
   - [6.1 LaTeX / KaTeX Layout Constraints](#61-latex--katex-layout-constraints)
   - [6.2 Ephemeral Floating Date Pill](#62-ephemeral-floating-date-pill)
   - [6.3 Message & Code Copy Actions](#63-message--code-copy-actions)
7. [Error Handling, Network Timeouts & Fallback Resilience](#7-error-handling-network-timeouts--fallback-resilience)

---

## 1. Core Philosophy & High-Level System Architecture

The **JEE Challenger AI Tutor** is engineered as a dedicated 24/7 personal STEM doubt-solving environment specifically optimized for JEE Main and JEE Advanced preparation across Physics, Chemistry, and Mathematics.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend (BFF)                          │
│                                                                        │
│  app/ai-tutor/              app/api/ai/                                │
│  ├── AITutorComponent.jsx   ├── chats/stream/route.js (SSE Proxy)     │
│  ├── layout.jsx (Guard)     ├── chats/messages/route.js               │
│  └── components/            └── files/upload/route.js                 │
└───────────────────┬────────────────────────────────────────────────────┘
                    │ Unbuffered SSE Streaming (HTTP/2)
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 FastAPI AI Microservice (ai-api)                       │
│                                                                        │
│  • Multi-Tier Gemini LLM Orchestrator (Pro / Flash / Fallback)         │
│  • LaTeX Equation Normalization & Math Derivations                     │
│  • MongoDB Atlas: `jee_challenger_ai.chats` & `messages`               │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Unbuffered Next.js BFF SSE Proxy
- Client-side requests stream through Next.js App Router route handlers (`app/api/ai/...`) which act as an unbuffered proxy to the Python FastAPI microservice (`ai.js`).
- Proxy headers strictly enforce zero intermediate caching and immediate chunk flushing:
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache, no-transform`
  - `Connection: keep-alive`
  - `X-Accel-Buffering: no`
- Tokens delivered via Server-Sent Events (SSE) pipe into client-side `TextDecoderStream` instances, enabling instant word-by-word equation rendering without waiting for complete turns.

### 1.2 Session Authentication & Security
- Authenticated via Google OAuth 2.0 through centralized auth (`AuthProvider.jsx`), validated server-side by signed `user_session` JWTs.
- Internal service-to-service calls carry an HMAC-signed `X-Internal-Token` header generated via `server/services/internal-token.js`.
- Unauthenticated requests are intercepted and redirected to `/login?callbackUrl=...`.

---

## 2. Authentic Frontend UI & Responsive Layout Anatomy

### 2.1 Desktop Dual-Mode Sidebar (Expanded & Collapsed Rail)
- **Expanded Mode (`w-72 sm:w-80`):**
  - **Brand Header:** Official light/dark JEE Challenger SVG logos with AI Tutor pill.
  - **Toolbar:** Real-time case-insensitive chat search input and "+ New" chat creation button side-by-side.
  - **Categorized History:** Chats grouped by timestamp (*Today*, *Yesterday*, *Previous 7 Days*, *Older*).
  - **Context Actions:** Non-intrusive 3-dot dropdown menu for inline chat renaming and deletion.
  - **Footer:** Integrated theme toggle switch and user profile dropdown with navigation shortcuts.
- **Collapsed Rail Mode (`w-16`):**
  - Expands canvas width on smaller monitors.
  - Displays quick brand icon, expand toggle, "+ New" button, and 8 recent chat icons.
  - Uses `@floating-ui/react` (`HoverTooltip`) with a strict 200ms delay to display chat titles cleanly to the right without UI jitter.

### 2.2 Mobile Responsive Architecture (Fixed Header & Slideover Drawer)
- **Mobile Navbar (`h-14` / 57px):** Strictly rendered on `< 1024px` (`lg:hidden`). Houses the sidebar toggle button, brand logo, and user profile avatar with dropdown.
- **Slideover Drawer:** Full-height off-canvas drawer with backdrop blur (`z-50`), dismissing on outside click or navigation.
- **Virtual Keyboard Handling:** `focusInput` strictly skips mobile devices (`window.innerWidth < 1024` or touch devices) to prevent unexpected viewport jumps or virtual keyboard popups on cold page load.

### 2.3 Layout Containment & Vertical Rhythm
- Root viewport locked via `h-[100dvh]` and `document.body.style.overscrollBehavior = 'none'` to prevent mobile browser URL bar bouncing and scroll chaining.
- Desktop canvas has a **24px top clearance** to the first date pill (`pt-0 pb-4 sm:pb-6` container + `my-6` date pill margin).
- Mobile canvas aligns with **0px gap** immediately under the 57px top bar.

---

## 3. Zero-Jitter Loading & Shared Skeleton Engine

### 3.1 The Two-Phase Loading Lifecycle

| Phase | Trigger Condition | Displayed Elements |
| :--- | :--- | :--- |
| **Phase 1: Cold Page Load** | Suspense fallback / NextAuth session resolving (`status === "loading"`) | Full wireframe shell: placeholder logo, search bar box, new chat box, `<ChatListSkeleton />`, profile box, `<MessageListSkeleton />`, and input placeholder. |
| **Phase 2: Live Shell Loaded** | Authenticated session active; components mounted | **Real, interactive controls:** Brand logo, search bar, New Chat button, user profile, and input box. Dynamic slots show skeletons (`<ChatListSkeleton />` while chats fetch; `<MessageListSkeleton />` while messages fetch). |

### 3.2 Single Source of Truth Skeleton Primitives
To prevent design drift, 140+ lines of duplicate Tailwind markup were consolidated into two reusable primitives under `app/ai-tutor/components/skeletons/`:
1. `ChatListSkeleton.jsx`: Renders staggered placeholder items across Today, Yesterday, Previous 7 Days, and Older.
2. `MessageListSkeleton.jsx`: Renders alternating conversational exchange wireframes.

Both `AITutorSkeleton.jsx` and live components (`ChatSidebar.jsx`, `ChatMessageList.jsx`) consume these identical primitives, guaranteeing 100% pixel-perfect visual continuity between cold load and data arrival.

### 3.3 Alternating Conversational Rhythm & 90% Fade Mask
To avoid synthetic cloned looks:
- **Exchange 1:** Detailed user problem statement (`w-72 sm:w-96`) + Full AI derivation card with shaded math sub-block.
- **Exchange 2:** Compact follow-up query (`w-64 sm:w-80`) + Short AI clarification response.
- **Fade Mask:** Top 90% is solid black; bottom 10% softly feathers to transparent (`[mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]`), filling viewports naturally down to the input area.

---

## 4. Client State Machine & Lifecycle

### 4.1 Route-Derived State Initialization (Eliminating Layout Flashes)
In `AITutorComponent.jsx`, message loading state is derived directly from the route URL on frame 0:
```js
const [isLoadingMessages, setIsLoadingMessages] = useState(Boolean(urlChatId));
```
When navigating to `/ai-tutor/chat/[chatId]`, `isLoadingMessages` is `true` before React effects run, eliminating race conditions.

### 4.2 Welcome Screen Route Guard
In `ChatMessageList.jsx`, `<WelcomeScreen />` is strictly guarded by route type:
```jsx
{isLoadingMessages ? (
  <MessageListSkeleton />
) : !isChatPage ? (
  <WelcomeScreen onSelectSuggestion={onSelectSuggestion} />
) : sortedGroupEntries.length === 0 ? (
  <EmptyChatNotice />
) : (
  <MessageGroupList ... />
)}
```
It is structurally impossible for the welcome screen to flash on an existing chat page.

### 4.3 Background Stream Persistence Across Chat Navigation
- In alignment with professional AI products (ChatGPT, Claude), clicking away to another chat while an answer is streaming does **not** aggressively abort the backend generation.
- The backend continues processing and commits the completed response to MongoDB Atlas.
- When the student returns to that chat, the full response is available in history.

### 4.4 Auto-Scroll State Machine & Smart Pause on Scroll-Up
- **Active Streaming:** Automatically pins to bottom as new tokens arrive.
- **Student Pause:** If the student scrolls up $> 80\text{px}$ to inspect earlier derivation steps, auto-scroll immediately pauses (`isAutoScrollPausedRef.current = true`) and reveals the floating "Scroll to Latest" button.
- **Resume:** Scrolling back within $50\text{px}$ of the bottom automatically unpauses auto-scroll.

---

## 5. Multimedia Upload & Drag-and-Drop Pipeline

### 5.1 Full-Window Drag-and-Drop Overlay
- Managed via `DragDropOverlay.jsx` with window-level listeners (`dragover`, `dragleave`, `drop`, `keydown`, `mouseup`).
- Dragging any image, PDF, or document anywhere over the browser window brings up a full-screen frosted glass overlay (`backdrop-blur-md`).
- Dismissible via `Escape` key or backdrop click.

### 5.2 Clipboard Direct Image Paste (`Ctrl + V`)
- The input textarea captures `paste` events containing `clipboardData.files`.
- Pasted screenshots or snips bypass system file dialogs and upload immediately to the attachment queue.

### 5.3 File Preview Strip & Upload Lifecycle
- Supports: `image/*`, `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`, `.xls`, `.xlsx`, `.txt`, `.csv`.
- Uploads request pre-signed URLs or proxy chunks through `/api/ai/files`.
- Selected attachments render as removable preview chips directly above the input textarea.

---

## 6. Conversational Math & Derivation Engine

### 6.1 LaTeX / KaTeX Layout Constraints
To prevent wide mathematical equations from breaking page layouts on mobile:
```css
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
```

### 6.2 Ephemeral Floating Date Pill
- Triggers strictly when scrolling up into message history ($> 40\text{px}$ from bottom and scrolling upward).
- Dynamically queries viewport boundaries of `[data-date-group]` to determine the active date section (*Today*, *Yesterday*, *Date*).
- Auto-fades after 1,400ms of inactivity or immediately upon scrolling down.

### 6.3 Message & Code Copy Actions
- Every AI response card includes an instant clipboard copy button with transient "Copied" checkmark feedback.
- Fenced code blocks and equation sub-cards provide direct code copy triggers.

---

## 7. Error Handling, Network Timeouts & Fallback Resilience

- **504 Gateway Timeouts:** Formatted as actionable messages with a 1-click **"Retry Message"** button that restores the original prompt into the input area.
- **429 Rate Limits:** Displays friendly cooldown notifications without freezing UI controls.
- **Network Disconnections:** The `abortController` cleanly cleans up in-flight reader buffers if generation is manually stopped via the square Stop button.
- **Multi-Model Fallbacks:** FastAPI automatically cascades from Gemini Pro to Gemini Flash if quotas or response latency thresholds are exceeded.
