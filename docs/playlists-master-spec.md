# JEE Challenger: Question Playlists & Custom Bookmarks — Master Specification
**Document Version:** 1.0.0  
**Status:** Approved Architectural Blueprint (Source of Truth)  
**Target Applications:** `jeechallenger-app`, `jeechallenger-pyqs`  
**Last Updated:** November 1, 2026

---

## 1. Core Architecture & Microservice Boundaries

### 1.1 Zero Direct MongoDB Access in Next.js
In strict adherence to the JEE Challenger platform architecture:
* `jeechallenger-app` performs **zero** direct MongoDB connections or queries for questions, papers, or playlists.
* All playlist CRUD, question hydration, deduplication, and slug resolution flow exclusively through the Go microservice (`jeechallenger-pyqs`) via server-side API proxy routes:
  * NextAuth cookie -> Next.js API route (`app/api/playlists/...`) -> Re-signed HS256 JWT -> Go backend (`http://localhost:8080/playlists` or `PYQS_API_URL`).

### 1.2 Dumb Frontend Principle
* Next.js renders only the presentation layer.
* Business validation (maximum 100 playlists, 500 questions per playlist, slug generation, duplicate detection) is executed exclusively inside the Go microservice.

---

## 2. URL Specification & Access Control

### 2.1 Unified URL Structure (`/lists/[slug]`)
Every playlist (system default or custom) is assigned a globally unique slug generated as:
$$\text{slug} = \text{slugify(list\_name)} + \text{"-"} + \text{cryptoHex(6)}$$
Examples:
* Favourites: `/lists/favourites-143bb4`
* Mistake Vault: `/lists/mistake-vault-8942fa`
* Custom: `/lists/must-do-calculus-traps-7cdd77`

There is **no** separate private vs public URL. The URL is always `/lists/[slug]`.

### 2.2 Routing & Access Rules
1. **Direct Navigation to `/lists`**:
   * **Authenticated User**: Automatically loads their default **Favourites** playlist slug so there is never an empty screen.
   * **Unauthenticated Visitor**: Redirected to `/login?callbackUrl=/lists`.
2. **Accessing `/lists/[slug]`**:
   * **Public Playlist**: Accessible by anyone (authenticated or guest). Renders in read-only mode for visitors; renders full management controls for the owner.
   * **Private Playlist**:
     * Owner (logged in): Renders full management controls (add/remove questions, edit metadata, privacy toggle).
     * Non-owner (logged in or guest): Renders a clean *"This playlist is private"* screen with a *"Sign in"* prompt.

---

## 3. Question Cards & Bookmark Popover UX

### 3.1 Bookmark Button on `PYQQuestionCard`
* Positioned in the top-right toolbar of every question card.
* **Visual States**:
  * **Filled Icon** (accent blue): Question is present in at least one of the user's playlists.
  * **Outline Icon** (muted gray): Question is not present in any playlist.

### 3.2 Popover Interaction Flow
* **Authenticated User**:
  1. Clicking opens a compact popover displaying all user playlists with checkboxes.
  2. Checking/unchecking triggers an immediate background mutation (`POST` / `DELETE` to Go microservice).
  3. Inline input at bottom: `+ Create new list...` allows creating a custom playlist on the fly and immediately adding the current question to it.
* **Unauthenticated Visitor**:
  * Shows a clean, minimal popover text: *"Sign in to save questions to your lists"*. No aggressive dialogs or jarring redirects.

---

## 4. Deletion Policy & Limits

### 4.1 Deletion Policy
* **Custom Playlists**: Hard delete with a confirmation modal: *"Are you sure you want to delete '[List Name]'? This action cannot be undone."*
* **Default System Playlists (`Favourites` and `Mistake Vault`)**:
  * Delete button is **completely hidden** (not rendered in the DOM).

### 4.2 Anti-Abuse Capacity & Error Handling
* Anti-abuse ceilings:
  * **100 playlists** per account.
  * **500 questions** per playlist.
* Human-friendly error toasts if crossed:
  * *"You have reached the maximum limit of 100 playlists. Please delete an unused playlist to create a new one."*
  * *"This playlist has reached its maximum capacity of 500 questions."*

---

## 5. UI Design Tokens & Responsive Layouts

### 5.1 Design Tokens
* **Dark Mode**: `bg-gray-950`, `bg-gray-900`, `border-gray-800`, `text-gray-100`, `text-gray-400`.
* **Light Mode**: `bg-white`, `bg-slate-50`, `border-slate-200`, `text-slate-900`, `text-slate-600`.
* **Accent**: Primary Blue (`bg-blue-600`, `text-blue-500`, `ring-blue-500`).

### 5.2 Question Table Columns
1. **Index**: `#1`, `#2`, ...
2. **Title**: Clickable question title navigating to `/pyq/[slug]`.
3. **Subject**: Color-coded pill (Physics: cyan, Chemistry: emerald, Math: violet).
4. **Chapter**: Subtle badge.
5. **Exam & Year**: Formatted (e.g. `JEE Main 2026 · 2 Apr Shift 1`).
6. **Difficulty**: Easy (green), Medium (amber), Hard (red).
7. **Action**: "Solve" link button.
