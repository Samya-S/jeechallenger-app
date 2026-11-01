# JEE Challenger: Computer-Based Test (CBT) Engine — Master Specification
**Document Version:** 1.4.0  
**Status:** Approved Architectural Blueprint (Source of Truth)  
**Target Applications:** `jeechallenger-app`, `jeechallenger-pyqs`, `jeechallenger-admin`
**Last Updated:** November 1, 2026 (Question ID isolation in Auto-Submit/Transfer, Mistake Vault uniqueness, and Go microservice dual resolution)

---

## Table of Contents
1. [Core Philosophy & High-Level System Architecture](#1-core-philosophy--high-level-system-architecture)
   - [1.1 Strict Microservices Boundary (Zero Direct PYQ DB Access in Next.js)](#11-strict-microservices-boundary-zero-direct-pyq-db-access-in-nextjs)
2. [Authentic Frontend UI Specifications](#2-authentic-frontend-ui-specifications)
   - [2.1 JEE Main (NTA CBT Interface)](#21-jee-main-nta-cbt-interface)
   - [2.2 JEE Advanced (TCS iON CBT Interface)](#22-jee-advanced-tcs-ion-cbt-interface)
   - [2.3 On-Screen Virtual Numeric Keypad](#23-on-screen-virtual-numeric-keypad)
   - [2.4 Layout Containment & Responsive Design](#24-layout-containment--responsive-design)
3. [In-Flight State & Zero Data Loss Sync Engine](#3-in-flight-state--zero-data-loss-sync-engine)
   - [3.1 The 3-Tier Storage Hierarchy](#31-the-3-tier-storage-hierarchy)
   - [3.2 Upstash Redis Delta Schema](#32-upstash-redis-delta-schema)
   - [3.3 Disconnection, Offline Queue & Recovery](#33-disconnection-offline-queue--recovery)
4. [Multi-Device Concurrency & Anti-Collision (Leased Mutex)](#4-multi-device-concurrency--anti-collision-leased-mutex)
5. [Exam Security, Fullscreen Kiosk & Integrity Rules](#5-exam-security-fullscreen-kiosk--integrity-rules)
6. [Telemetry & Time-Tracking Engine](#6-telemetry--time-tracking-engine)
7. [The Scoring Judge & Evaluation Logic](#7-the-scoring-judge--evaluation-logic)
   - [7.1 Question-Type Scoring Algorithms](#71-question-type-scoring-algorithms)
   - [7.2 Numerical Range Evaluation](#72-numerical-range-evaluation)
   - [7.3 Section B (5 of 10) Attempt Rule](#73-section-b-5-of-10-attempt-rule)
   - [7.4 Dropped & Ambiguous Questions](#74-dropped--ambiguous-questions)
   - [7.5 Palette Evaluation Rules](#75-palette-evaluation-rules)
8. [Lifecycle, Submission & Automated Abandonment Finalization](#8-lifecycle-submission--automated-abandonment-finalization)
9. [Next.js API Route Contracts & Webhooks](#9-nextjs-api-route-contracts--webhooks)
10. [Client-Side State Machine (Zustand Store)](#10-client-side-state-machine-zustand-store)
11. [Authoritative MongoDB Atlas Schemas](#11-authoritative-mongodb-atlas-schemas)
12. [Post-Exam Scorecard & Review Experience](#12-post-exam-scorecard--review-experience)
13. [Exhaustive Edge Cases & Failure Mitigation Matrix](#13-exhaustive-edge-cases--failure-mitigation-matrix)
14. [Pre-Flight Verification & Acceptance Checklist](#14-pre-flight-verification--acceptance-checklist)

---

## 1. Core Philosophy & High-Level System Architecture

JEE Challenger CBT is designed as a **Destination Feature**—a high-stakes, 3-hour authentic mock examination environment ("LeetCode for JEE") engineered for maximum retention and realistic muscle memory building.

### Architectural Tenet: "Fat Client, Thin Server"
1. **Zero Vercel Compute During Exam**: When an exam starts, the entire paper payload (75–90 questions) is fetched as a single cached JSON object. During the 180-minute exam, Vercel serverless functions are completely bypassed for UI interactions.
2. **Zero Connection Pool Saturation**: Direct writes to MongoDB Atlas during active testing are strictly forbidden. In-flight clicks and states are routed to Upstash Redis via lightweight HTTP REST calls, protecting MongoDB Atlas connection limits from exhaustion.
3. **No Watermarks or Simulation Branding**: The exam interface has zero cheesy labels (no "Simulation Mode", no "NTA-Style Replica" watermarks). It matches the official testing hall interface 1:1.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          IN-FLIGHT FLOW                                │
├────────────────────────────────────────────────────────────────────────┤
│ Student Clicks Answer                                                  │
│   ├── 0 ms: React State (Immediate DOM update, palette color change)   │
│   ├── 0 ms: Browser IndexedDB (Instant local crash protection)         │
│   └── 15-30 ms: Non-blocking HTTP REST to Upstash Redis Delta Hash     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         On Submission or 180:00
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FINALIZATION FLOW                               │
├────────────────────────────────────────────────────────────────────────┤
│   1. Read in-flight hash from Upstash Redis                            │
│   2. Execute Server-Side Scoring Judge (MCQ, Multi, Numeric, 5-of-10)  │
│   3. Atomic Write to MongoDB Atlas: test_submissions collection        │
│   4. Purge temporary Redis hash                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1.1 Strict Microservices Boundary (Zero Direct PYQ DB Access in Next.js)

To maintain absolute architectural purity across the ecosystem:
1. **PYQ Microservice Exclusivity**:
   * The Go backend (`jeechallenger-pyqs`) is the **sole system** authorized to connect directly to the `jee_challenger_pyqs` MongoDB database for papers and questions.
   * Next.js frontend (`jeechallenger-app`) **never queries `papers` or `production` directly via MongoDB**.
2. **Canonical Microservice Endpoints**:
   * **Exam Room Ingestion**: `GET /papers/{slug}` — The Go service reassembles questions in strict section order (`paper.sections[].question_ids`), transforms image URLs to CDN format, and returns the complete test payload.
   * **Scorecard Evaluation & Review**: `GET /cbt/submissions/{id}` and `GET /cbt/submissions` — Authenticated via NextAuth-signed HS256 JWT tokens.
3. **Fail-Fast & Zero Fallback Logics**:
   * If an endpoint returns 404 or an error, execution stops immediately and renders `notFound()`.
   * **Zero Fallback Queries**: The frontend must never fall back to querying the database directly if the microservice fails.

---

## 2. Authentic Frontend UI Specifications

### 2.1 JEE Main (NTA CBT Interface)
The layout strictly mirrors the National Testing Agency examination hall software:

* **Top Header**:
  * Left: Candidate Name, Roll Number, Exam Title (`JEE (Main) - 2026`), Subject List, and System Terminal ID (e.g., `C001`).
  * Center/Right: Candidate Photo Box, Language Selector (`View in: English`), and global Countdown Timer: `Time Left : 02:45:12`.
* **Section Bar (Top Tabs)**:
  * Six horizontal section selectors: `Physics Section A`, `Physics Section B`, `Chemistry Section A`, `Chemistry Section B`, `Mathematics Section A`, `Mathematics Section B`.
  * Candidate has complete freedom to jump between any subject or section at any second during the 180 minutes.
  * Top-Right Utility Buttons:
    * **"Question Paper"**: Opens a read-only modal previewing all questions in the test/section simultaneously.
    * **"Instructions"**: Opens the exam marking guidelines overlay.
* **Central Question Window (75% Viewport)**:
  * Question Number header with Marks breakdown (`+4, -1`).
  * Text and formulas rendered with KaTeX.
  * Diagrams rendered via native HTML `<img />` tags pointing to Cloudflare R2 / CDN.
  * **Comprehension Layout**: Split-screen with locked left-pane passage text (`linked_passage_text`) and scrollable right-pane question.
* **Question Palette (25% Viewport, Collapsible)**:
  * 5 official status states:
    1. ⬜ **Not Visited** (Grey rectangle with number)
    2. 🟥 **Not Answered** (Red polygon)
    3. 🟩 **Answered** (Green polygon)
    4. 🟪 **Marked for Review** (Purple circle)
    5. 🟪🟢 **Answered & Marked for Review** (Purple circle with green square indicator — evaluated by judge)
  * **Unsaved Palette Jump Trait (Crucial NTA Rule)**: If a candidate selects an option and clicks a question number directly on the palette without clicking *"Save & Next"* or *"Save & Mark for Review"*, **the selection is discarded** and the question remains in state 2 (Red).
* **Fixed Bottom Action Bar (Never scrolls off screen)**:
  * Left: `Save & Next` (Green button), `Save & Mark for Review` (Purple button with green tick indicator).
  * Center: `Clear Response` (White button with grey outline).
  * Right: `Mark for Review & Next` (Purple button), `Submit` (Far right).

---

### 2.2 JEE Advanced (TCS iON CBT Interface)
The layout strictly mirrors the Indian Institute of Technology / TCS iON examination platform:

* **Two-Tier Section Hierarchy**:
  * **Tier 1 (Part Tabs)**: `PART I: PHYSICS` | `PART II: CHEMISTRY` | `PART III: MATHEMATICS`.
  * **Tier 2 (Section Sub-Tabs)**: Directly reflects that specific paper's question types: `Sec 1` (Single Correct), `Sec 2` (One or More than One Correct), `Sec 3` (Numerical Value), `Sec 4` (Paragraph / Matching).
  * **Dynamic Section-Filtered Palette**: The right-hand palette updates dynamically to show **only the questions belonging to the currently active Section**.
* **Accessibility Zoom Bar**:
  * `A+`, `A`, `A-` controls in the header to increase/decrease font sizes dynamically.
* **Input Elements by Section**:
  * Single Correct: Circular radio buttons.
  * Multiple Correct: Square checkboxes.
  * Numerical: Read-only input field bound to the on-screen virtual keypad.

---

### 2.3 On-Screen Virtual Numeric Keypad
* **Authenticity Enforcement**: Physical keyboard input is **completely blocked** on numerical questions (`e.preventDefault()` on `keydown`/`keypress`/`paste`).
* **Mouse-Only Keypad**: A virtual on-screen keypad containing buttons:
  `[ 1 ] [ 2 ] [ 3 ]`  
  `[ 4 ] [ 5 ] [ 6 ]`  
  `[ 7 ] [ 8 ] [ 9 ]`  
  `[ . ] [ 0 ] [ - ]`  
  `[ Backspace ] [ Clear ]`
* **Input Rules**:
  * Only one negative sign allowed, strictly as the first character.
  * Only one decimal point allowed.

---

### 2.4 Layout Containment & Responsive Design
* **Primary Target**: 1366 × 768 px (the standard Indian test center terminal resolution).
* **Viewport Lockdown**: Outer layout locked to `100vh` / `100vw` with `overflow: hidden`.
* **Independent Scrolling**: The question text area and passage area scroll internally. The top header, subject tabs, question palette, and bottom action bar are permanently fixed.

---

## 3. In-Flight State & Zero Data Loss Sync Engine

### 3.1 The 3-Tier Storage Hierarchy

| Layer | Technology | Latency | Purpose |
| :--- | :--- | :--- | :--- |
| **Layer 1: Visual** | React State (Zustand) | **0 ms** | Instantaneous button fill, keypad display, palette update |
| **Layer 2: Local Crash Guard** | Browser IndexedDB (`idb-keyval`, 1 KB) | **<1 ms** | Protects against accidental tab close, browser crash, or power kill |
| **Layer 3: Cloud Persistence** | Upstash Redis REST API (`HSET`) | **15–30 ms** | Cloud durable in-memory state; allows instant device handover |

---

### 3.2 Upstash Redis Delta Schema

* **Redis Key**: `cbt:session:{userId}:{paperId}`
* **Data Structure**: Redis Hash (`HSET`)
* **Key Expiration (TTL)**: `18000` seconds (5 hours) — ensures stale memory auto-cleans without leaving orphaned database clutter.

#### Hash Fields (Keyed Strictly by Question ID `q_{_id}`):
```javascript
// Metadata Fields
"started_at": 1714002000,
"expires_at": 1714012800, // UTC Epoch seconds
"active_instance_id": "inst_7f9c2a",
"last_heartbeat": 1714003420,
"status": "IN_PROGRESS", // "IN_PROGRESS" | "SUBMITTED"

// Question Fields (One field per unique MongoDB Question ObjectId)
// Eliminates numbering collisions across subjects in JEE Advanced & custom exams
"q_6a816d1950c0eddd0485e442": JSON.stringify({
  "selected_options": ["B"], // Mirrors DB correct_answer array
  "numeric_value": null,
  "color_state": 3, // 3: Answered, 5: Answered & Marked for Review
  "time_spent_seconds": 125,
  "updated_at": 1714002125
}),
"q_6a816d1950c0eddd0485e452": JSON.stringify({
  "selected_options": ["A", "C"], // Multi-correct selections
  "numeric_value": null,
  "color_state": 3,
  "time_spent_seconds": 140,
  "updated_at": 1714002220
}),
"q_6a816d1950c0eddd0485e462": JSON.stringify({
  "selected_options": [],
  "numeric_value": "42.5", // Numerical integer/decimal entry
  "color_state": 5,
  "time_spent_seconds": 210,
  "updated_at": 1714002335
})
```

> [!IMPORTANT]
> **Zero `parseInt` Rule on Question Keys**:
> All backend consumers (`auto-submit`, `session/transfer`, `session/start`) must extract question IDs directly as strings via `key.replace('q_', '')`. Parsing with `parseInt(key.replace('q_', ''), 10)` truncates hexadecimal ObjectIds at the first non-numeric character (e.g. `6a81...` becomes `6`), causing severe cross-question answer overwrites and evaluation loss. Always handle question identifiers strictly as string ObjectIds.

---

### 3.3 Disconnection, Offline Queue & Recovery
1. Every state change writes to local IndexedDB immediately.
2. The question number is added to an in-memory `pendingSyncQueue` Set.
3. A non-blocking worker flushes `pendingSyncQueue` to `/api/cbt/session/sync-delta`.
4. **If Network Drops**:
   * The UI remains fully functional; writes continue into IndexedDB.
   * `pendingSyncQueue` retains un-synced question keys.
   * When `window.addEventListener('online')` fires, the queue flushes the entire accumulated batch in a single atomic `HSET` call.

---

## 4. Multi-Device Concurrency & Anti-Collision (Leased Mutex)

To prevent simultaneous two-device cheating (e.g. two people solving different subjects at the same time) and race-condition delta corruption:

```
[Device B opens active exam]
           │
           ▼
[Server checks Redis: cbt:session:{sessionId}]
           │
           ├── Device A has an active heartbeat (< 30s ago)
           │
           ▼
[Device B displays Transfer Modal]:
  "An active test session is running on another device.
   Transfer exam to this device? (The other device will be disconnected)."
           │
           ▼ (User clicks "Transfer to this Device")
[Server updates Redis: active_instance_id = "inst_B"]
           │
           ▼
[Device A sends next heartbeat/click with "inst_A"]
           │
           ▼
[Server returns HTTP 409 Conflict]
           │
           ▼
[Device A locked immediately with immovable full-screen overlay]:
  "SESSION TRANSFERRED: Exam was transferred to another device.
   Simultaneous sessions are not permitted. This window is disabled."
```

* **Safety Guarantee**: Exactly one device holds the active lease at any given millisecond. If Device A had legitimate hardware failure, Device B can take over seamlessly without administrative intervention.

---

## 5. Exam Security, Fullscreen Kiosk & Integrity Rules

* **Mandatory Fullscreen on Start**: Clicking "Start Test" triggers `document.documentElement.requestFullscreen()`.
* **Exit Detection & Screen Lock**:
  * If the user exits fullscreen (`ESC`, `F11`, or window blur):
  * The test screen is instantly concealed behind an opaque modal.
  * **Explicit Warning**:
    > **"EXAM PAUSED (TIMER IS RUNNING) — Fullscreen mode is required to proceed. Click to resume."**
  * The master 180-minute countdown continues ticking without pause.
  * No artificial 3-strike disqualification rules (matches the actual testing hall kiosk).
* **Keyboard & Context Menu Lockdown**:
  * Right-click disabled (`e.preventDefault()` on `contextmenu`).
  * Text selection disabled via CSS (`user-select: none`).
  * Key shortcuts intercepted: `F5`, `Ctrl+R`, `Ctrl+W`, `Ctrl+Shift+I` (DevTools).
  * `window.onbeforeunload` triggers navigation confirmation warning.

---

## 6. Telemetry & Time-Tracking Engine

### The Problem with Naive Timing
Using `setInterval(() => seconds++, 1000)` drifts by several minutes over a 3-hour test due to background browser throttling.

### The Timestamp Delta Accumulator
1. **Epoch Tracking**: When question $Q_k$ becomes active:
   `activeQuestionEnteredAt = Date.now()`
2. **On Question Switch** (Next, Previous, Palette Jump):
   ```javascript
   const elapsed = Math.round((Date.now() - activeQuestionEnteredAt) / 1000);
   questionTimeMap[activeQId] = (questionTimeMap[activeQId] || 0) + elapsed;
   activeQuestionId = nextQId;
   activeQuestionEnteredAt = Date.now();
   ```
3. **Multi-Visit Accumulation**: If a candidate visits Q1 three separate times (30s, 75s, 15s), `questionTimeMap[1] = 120` seconds.
4. **10-Second In-Flight Heartbeat**: Every 10 seconds, the active question's elapsed slice is written to the local cache. If the computer crashes or loses power, time spent on the active question is accurate to within 10 seconds.
5. **Exact Final Question Time at 00:00:00**:
   When the master timer hits `00:00:00`, the `onTimerExpire()` handler calculates the exact remaining delta synchronously before dispatching the payload:
   `exactFinal = Math.round((Date.now() - activeQuestionEnteredAt) / 1000)`
   `questionTimeMap[activeQId] += exactFinal`

---

## 7. The Scoring Judge & Evaluation Logic

### 7.1 Question-Type Scoring Algorithms

| Question Type | Correct | Incorrect | Unattempted | Partial Marking |
| :--- | :---: | :---: | :---: | :--- |
| **Single Correct (MCQ)** | `+4` / `+3` | `-1` | `0` | None |
| **Numerical Value** | `+4` / `+3` | `-1` (Mains) / `0` (Adv) | `0` | None (Range or exact match) |
| **Multiple Correct** | `+4` | `-2` / `-1` | `0` | **Official JEE Advanced Rules (`MULTI_CORRECT_PARTIAL`)**:<br>• **Full Marks (`+4`)**: If all correct options are chosen and zero incorrect options are chosen.<br>• **Partial Marks (`+3`)**: If 4 options are correct and 3 are chosen (none incorrect).<br>• **Partial Marks (`+2`)**: If 3 or more options are correct and 2 are chosen (none incorrect).<br>• **Partial Marks (`+1`)**: If 2 or more options are correct and 1 is chosen (none incorrect).<br>• **Penalty (`-2` or `-1`)**: If **any** incorrect option is chosen.<br>• Under `MULTI_CORRECT_NO_PARTIAL`: Exact match awards full marks, any mismatch awards penalty or 0. |

---

### 7.2 Numerical Range Evaluation
Numerical answers in MongoDB Atlas contain `is_range`:
* `is_range: false`: String comparison with `exact_value` (e.g. `entered.trim() === String(exact_value)`).
* `is_range: true`: Range condition:
  $$\text{min\_value} \le V_{\text{candidate}} \le \text{max\_value}$$

---

### 7.3 Section B (5 of 10) Attempt Rule
* In papers where Section B contains 10 questions with 5 to attempt:
* **The candidate may interact with and enter answers across any questions freely.** No blocking modals or artificial alerts.
* **The Judge Rule**: The backend evaluates strictly the **first 5 attempted questions in numerical order**. Any answers beyond the first 5 in ascending numerical order are marked `is_evaluated: false` and awarded `0` marks.

---

### 7.4 Dropped & Ambiguous Questions
* Any historical question with ambiguous keys or officially dropped by NTA/IIT is stored as `source_of_answer: "OFFICIAL_KEY"` with `correct_answer: "MARKS_TO_ALL"`.
* **The Judge Rule**: Full positive marks (`+4`) are awarded to every candidate.

---

### 7.5 Palette Evaluation Rules
* **State 3: Answered** $\rightarrow$ Evaluated.
* **State 5: Answered & Marked for Review** $\rightarrow$ Evaluated.
* **States 1, 2, and 4** $\rightarrow$ Treated as unattempted (0 marks).

---

## 8. Lifecycle, Submission & Automated Abandonment Finalization

```
[Start Test] ──> Generate session, set expires_at (UTC epoch), schedule QStash
       │
       ├── Path A: Student submits manually
       │     1. Open "Exam Summary Table"
       │     2. Confirm "Final Submit"
       │     3. POST /api/cbt/submit
       │
       └── Path B: Student abandons at minute 40 / Laptop dies
             │
             ▼
       [Master Clock reaches expires_at (180:00)]
             │
             ▼
       [Scheduled QStash webhook / Serverless cron triggers /api/cbt/auto-submit]
             │
             ▼
       1. Read in-flight delta from Upstash Redis
       2. Run Scoring Judge
       3. Write completed record to MongoDB Atlas test_submissions
       4. Mark status: "AUTO_SUBMITTED_TIME_EXPIRED"
       5. Purge temporary Redis hash
```

* **Zero Data Loss Guarantee**: A student who walks away at minute 40 will have their 40 minutes of work evaluated and permanently saved to their account when the 180-minute window closes.

---

## 9. Next.js API Route Contracts & Webhooks

### 9.1 `POST /api/cbt/session/start`
Initializes a new test attempt or resumes an existing one.
* **Request Payload**:
  ```json
  {
    "paper_id": "JEE_Main_2024_01_27_Shift_1",
    "instance_id": "inst_7f9c2a"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "session_id": "cbt_sess_89a12c",
    "paper_id": "JEE_Main_2024_01_27_Shift_1",
    "server_now": 1714002000000,
    "expires_at": 1714012800000,
    "duration_minutes": 180,
    "is_resumed": false,
    "active_instance_id": "inst_7f9c2a",
    "rehydrated_answers": {}
  }
  ```

---

### 9.2 `POST /api/cbt/session/sync-delta`
Non-blocking background delta sync called on answer changes or 10s heartbeat.
* **Request Payload**:
  ```json
  {
    "session_id": "cbt_sess_89a12c",
    "instance_id": "inst_7f9c2a",
    "delta": {
      "q_14": {
        "selected_option": "B",
        "numeric_value": null,
        "color_state": 3,
        "time_spent_seconds": 125,
        "updated_at": 1714002125
      }
    }
  }
  ```
* **Responses**:
  * `200 OK`: `{ "success": true }`
  * `409 Conflict`: `{ "error": "SESSION_REVOKED", "message": "Exam transferred to another device." }`

---

### 9.3 `POST /api/cbt/session/transfer`
Claims the active instance lease for a new device and rehydrates in-flight state.
* **Request Payload**:
  ```json
  {
    "session_id": "cbt:session:userId:paperId",
    "new_instance_id": "inst_dev_b_991"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "active_instance_id": "inst_dev_b_991",
    "expires_at": 1714012800000,
    "duration_minutes": 180,
    "rehydrated_answers": {
      "6a816d1950c0eddd0485e442": { "selected_options": ["B"], "numeric_value": null }
    }
  }
  ```
  *Note: Question keys in `rehydrated_answers` are string ObjectIds matching frontend store indices without integer truncation.*

---

### 9.4 `POST /api/cbt/submit`
Manual submission or client-side timer expiration.
* **Request Payload**:
  ```json
  {
    "session_id": "cbt:session:userId:paperId",
    "instance_id": "inst_7f9c2a",
    "final_question_time_map": { "6a816d1950c0eddd0485e442": 135 }
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "submission_id": "6720f128...",
    "total_score": 184,
    "max_marks": 300,
    "redirect_url": "/mock-test/results/6720f128..."
  }
  ```

---

### 9.5 `POST /api/cbt/auto-submit` (Webhook)
Secured endpoint invoked by Upstash QStash or background reconciler at `expires_at`.
* **Headers**: `Upstash-Signature: ...` or internal authorization bearer token.
* **Action**:
  1. Checks if session is already `SUBMITTED`. If so, exits immediately (idempotent).
  2. Reads in-flight answers from Redis hash, extracting question keys directly via `qId = key.replace('q_', '')`.
  3. Executes Scoring Judge against `production` and `papers` MongoDB collections.
  4. Inserts completed submission into `test_submissions`.
  5. Auto-populates `mistake_vault` uniquely filtered by `{ user_id, paper_id, question_id }`.
  6. Purges Redis key.

---

## 10. Client-Side State Machine (Zustand Store)

The CBT frontend state is managed via a dedicated Zustand store:

```typescript
interface CBTStore {
  // Session Metadata
  sessionId: string | null;
  paperId: string | null;
  examType: "JEE_MAIN" | "JEE_ADVANCED";
  serverTimeOffset: number; // server_now - client_now
  expiresAt: number;        // UTC epoch milliseconds
  instanceId: string;       // unique to current tab

  // Exam Data
  paperMetadata: PaperDocument;
  questions: QuestionDocument[];
  activeQuestionIndex: number;
  activeSubject: string;
  activeSectionIndex: number;

  // In-Flight Candidate Responses (Keyed Strictly by Question ID: String(q._id))
  answers: Record<string, { selected_options: string[]; numeric_value: string | null }>;
  paletteStates: Record<string, 1 | 2 | 3 | 4 | 5>;
  questionTimeMap: Record<string, number>; // qId -> seconds
  activeQuestionEnteredAt: number;        // Date.now() timestamp
  uncommittedAnswer: { selected_options: string[]; numeric_value: string | null };

  // Sync & Telemetry Queues
  pendingSyncQueue: Set<string>; // Set of dirty qIds
  isSyncing: boolean;
  isOnline: boolean;

  // Kiosk & Security State
  isFullscreen: boolean;
  isLocked: boolean;
  isTerminated: boolean; // revoked by another device (409)

  // Actions
  selectOption: (option: string) => void;
  toggleMultiOption: (option: string) => void;
  setNumericValue: (val: string) => void;
  saveAndNext: () => void;
  saveAndMarkForReview: () => void;
  markForReviewAndNext: () => void;
  clearResponse: () => void;
  jumpToQuestion: (targetIndex: number) => void; // Discards unsaved selection!
  triggerHeartbeat: () => Promise<void>;
  submitExam: () => Promise<void>;
}
```

---

## 11. Authoritative MongoDB Atlas Schemas

### Canonical Database Schema Relation (Zero Fallback Policy)
Direct audit of the MongoDB Atlas `jee_challenger_pyqs` database:
* **`production` collection (2,973 questions)**: `paper_id` is 0. All 2,973 documents use **`original_paper_id`**.
* **`papers` collection**: primary paper identifier is **`paper_id`** (e.g. `JEE_Advanced_2026_Paper_1`).
* **Canonical Relational Contract**: `production.original_paper_id === papers.paper_id`.
* All backend queries strictly enforce `{ original_paper_id: paper.paper_id }`. No fallback hacks or `$or: [{ paper_id }]` logic.

### Collection: `test_submissions` (Database: `jee_challenger_pyqs`)

```javascript
{
  "_id": ObjectId("6720f12850c0eddd0485ec99"),
  "user_id": ObjectId("664b38d7664030ffcb6bb10"),
  "paper_id": "JEE_Main_2024_01_27_Shift_1",
  "paper_title": "JEE Main 2024 (27 Jan Shift 1)",
  "exam_type": "JEE_MAIN",
  "status": "EVALUATED", // "MANUAL_SUBMISSION" | "AUTO_SUBMITTED_TIME_EXPIRED"
  "started_at": ISODate("2026-10-27T10:00:00.000Z"),
  "submitted_at": ISODate("2026-10-27T13:00:00.000Z"),
  "time_taken_seconds": 10800,
  
  "summary": {
    "total_score": 184,
    "max_marks": 300,
    "accuracy_percentage": 88.4,
    "total_attempted": 52,
    "total_correct": 46,
    "total_incorrect": 6,
    "total_unattempted": 23,
    "subject_scores": {
      "Physics": { "score": 64, "attempted": 18, "correct": 16, "incorrect": 2, "unattempted": 7 },
      "Chemistry": { "score": 72, "attempted": 20, "correct": 18, "incorrect": 2, "unattempted": 5 },
      "Mathematics": { "score": 48, "attempted": 14, "correct": 12, "incorrect": 2, "unattempted": 11 }
    },
    "pacing": {
      "time_traps_count": 3,
      "speed_wins_count": 8
    }
  },

  "question_attempts": [
    {
      "question_id": ObjectId("6a716d9b7664030ffcb6bb95"),
      "question_number": 1,
      "subject": "Mathematics",
      "section_name": "Mathematics Section A",
      "question_type": "MCQ",
      "selected_option": "B",
      "selected_options": ["B"],
      "numeric_value": null,
      "color_state": 3,
      "is_evaluated": true,
      "is_correct": true,
      "marks_awarded": 4,
      "time_spent_seconds": 135,
      "is_speed_win": false,
      "is_time_trap": false
    },
    {
      "question_id": ObjectId("6a716d9b7664030ffcb6bb98"),
      "question_number": 5,
      "subject": "Chemistry",
      "section_name": "Chemistry Section 2",
      "question_type": "MULTI_CORRECT",
      "selected_option": "A,C",
      "selected_options": ["A", "C"],
      "numeric_value": null,
      "color_state": 3,
      "is_evaluated": true,
      "is_correct": true,
      "marks_awarded": 2, // Partial credit under MULTI_CORRECT_PARTIAL
      "time_spent_seconds": 145,
      "is_speed_win": false,
      "is_time_trap": false
    },
    {
      "question_id": ObjectId("6a716d9b7664030ffcb6bba9"),
      "question_number": 21,
      "subject": "Mathematics",
      "section_name": "Mathematics Section B",
      "question_type": "NUMERIC",
      "selected_option": null,
      "selected_options": [],
      "numeric_value": "4",
      "color_state": 5,
      "is_evaluated": true,
      "is_correct": true,
      "marks_awarded": 4,
      "time_spent_seconds": 240,
      "is_speed_win": false,
      "is_time_trap": false
    }
  ]
}
```

---

## 12. Post-Exam Scorecard & Review Experience

Once submitted, the student lands on the permanent analysis route (`/mock-test/results/[submissionId]`):

1. **Executive Scorecard Banner**: Total Score, Max Marks, Subject Scores, Accuracy %, Time Used, and factual **Attempt Rate** (`84.0% (63/75)`). Zero misleading pseudo-percentiles ("Emptiness is better than wrong").
2. **Design System Color Harmony**:
   * **Best Score Overview Card**: Royal Blue (`bg-blue-50/50 text-blue-600 border-blue-200`)
   * **Mistake Vault Overview Card**: Golden Amber (`bg-amber-50/50 text-amber-600 border-amber-200`) with Bookmark icon
   * **Subject Filter Pills**: Physics (Blue), Chemistry (Emerald), Mathematics (Purple), All (Neutral dark/light)
3. **Pacing Heatmap & Interactive Time Traps**:
   * Symmetrical 3-row layout categorized into Time Traps, Speed Wins, and Subject Averages.
   * **Interactive Click-to-Jump**: Clicking any Time Trap or Speed Win pill smoothly scrolls to that question's review card, automatically switches to the correct subject filter, opens the step-by-step solution, and pulses with an amber focus highlight (`ring-4 ring-amber-500 shadow-2xl`).
4. **Active Recall Mistake Vault**:
   * Automatically populated with all incorrect attempts (`is_correct === false`).
   * Step-by-step solutions are **collapsed and closed by default** so candidates can attempt the problem again without immediate answer leakage.
   * Solution reveals exclusively when the user clicks **"View Step-by-Step Solution"**.
5. **Multi-Correct Review**:
   * Renders multiple selected option badges and highlights partial credit awards (`Partially Correct (+X marks)` vs `Correct` vs `Incorrect`).
6. **In-Situ Bug Reporting**:
   * Direct `<Bug />` report button on every scorecard solution card pre-filling question metadata into `ReportQuestionModal`.

---

## 13. Exhaustive Edge Cases & Failure Mitigation Matrix

| # | Edge Case | Mitigation / System Response |
| :--- | :--- | :--- |
| **1** | **Local Clock / Timezone Tampering** | Countdown timer is computed as $\text{expires\_at} - (\text{server\_now} + \Delta\text{local})$. Changing client timezone or OS clock does not add extra time. |
| **2** | **Accidental Tab Close / Refresh** | On mount, React reads IndexedDB (`idb-keyval`) in <2 ms, restoring all options, palette states, and timer instantly. |
| **3** | **Wi-Fi Loss for Extended Period** | Answers queue locally in IndexedDB. UI never locks or shows spinners. Flushes seamlessly when connectivity resumes. |
| **4** | **Simultaneous 2-Device Attempt** | Single-Instance Leased Mutex in Redis: Device B prompts to transfer; confirming instantly revokes Device A with an immovable 409 lockout screen. |
| **5** | **Student Abandons at Minute 40** | Upstash QStash scheduled webhook triggers at 180:00, evaluates the in-flight Redis delta, writes full attempt history to MongoDB Atlas, and cleans Redis. |
| **6** | **Unsaved Palette Jump** | Replicates NTA behavior: selecting an option and jumping directly via the palette without clicking *"Save & Next"* discards the unsaved choice. |
| **7** | **Double-Click on "Final Submit"** | Submission endpoint is idempotent; client disables submit button with immediate optimistic lock. |
| **8** | **Screen Resolution Containment** | Full layout containment locked to viewport (`100vh`/`100vw`). Fixed bottom bar and header; questions and passages scroll internally. |
| **9** | **Physical Keyboard in Numerical Qs** | `keydown` and `paste` events strictly prevented; input accepted solely via on-screen mouse clicks. |
| **10** | **Section B >5 Attempts** | Judge evaluates strictly the first 5 attempted questions in numerical order, discarding attempts 6+ with 0 marks. |
| **11** | **LaTeX / Diagram Rendering Failure** | KaTeX errors fall back to raw math string; diagram images have explicit error fallback placeholders pointing to redundant CDN origins. |
| **12** | **Mid-Submission Power Failure** | Because the in-flight delta exists in Redis up to the last 10 seconds, the serverless auto-submitter finalizes the exam at `expires_at` even if the student's machine never powers on again. |

---

## 14. Pre-Flight Verification & Acceptance Checklist

Before any production deployment of the CBT Engine:
- [ ] **NTA Palette Test**: Verify that clicking directly on Question 15 after choosing option B resets option B without saving.
- [ ] **Section B Rule Test**: Submit 7 answers in Section B; verify that the judge only marks the first 5 in ascending numerical order.
- [ ] **Keyboard Lock Test**: Confirm that typing numbers via physical keyboard into numerical fields produces zero input.
- [ ] **Offline Disconnection Test**: Turn off Wi-Fi, answer 5 questions, turn on Wi-Fi; confirm all 5 questions sync to Redis with exact timestamps.
- [ ] **Concurrent Device Test**: Open test on Device A, open on Device B, click transfer; confirm Device A is instantly locked with the 409 overlay.
- [ ] **Abandonment Auto-Submit Test**: Start test, close browser, simulate arrival of `expires_at`; verify `test_submissions` document is created in MongoDB Atlas with status `AUTO_SUBMITTED_TIME_EXPIRED`.
- [ ] **1366x768 Viewport Test**: Verify bottom action bar (`Save & Next`, `Clear Response`) is permanently visible without page scrolling.
