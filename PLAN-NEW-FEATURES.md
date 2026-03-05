# 🚀 Personal Group - New Features Implementation Plan

**Objective:** Implement Video Library, Guest Pass, Group Classes, Gamification, and Plan Status.

---

## 1. 📹 Video Library Implementation
**Goal:** Provide correct execution guidance within the active session.

### Schema Changes
- **File:** `types.ts`
- **Update:** `Exercise` interface
  - Add `videoUrl?: string` (Youtube/Vimeo/MP4)
  - Add `videoDuration?: number`

### Data Updates
- **File:** `data/exercises.ts`
- **Action:** Add placeholder video URLs (e.g., standard gym execution videos) to `INITIAL_EXERCISES`.

### UI Changes
- **File:** `views/ActiveSession.tsx`
- **Action:**
  - Add a "Play Video" button over the exercise image.
  - Implement a Modal or Inline Player to watch the execution.

---

## 2. 🎟️ Guest Pass System
**Goal:** Allow students to invite friends with Admin validation.

### Schema Changes
- **File:** `types.ts`
- **Update:** `User` interface
  - Add `guestPassesAvailable: number`
  - Add `guestPassesUsed: string[]` (User IDs or dates)

### UI Changes
- **File:** `views/Profile.tsx` (or new `views/GuestPass.tsx`)
- **Action:**
  - Create a "Convide um Amigo" card.
  - Show remaining passes (Rule: 1/month).
  - Button "Gerar Convite" -> Generates a QR Code / Token.
  - **Disclaimer:** "Necessário validação na recepção".

---

## 3. 📅 Group Classes (Merged with Wellness)
**Goal:** Unified scheduling for Spa and Gym Classes.

### Schema Changes
- **File:** `types.ts`
- **Update:** `WellnessService` -> `ServiceOrClass`
  - Add `type: 'WELLNESS' | 'CLASS'`
  - Add `capacity?: number`
  - Add `instructor?: string`

### UI Changes
- **File:** `views/Wellness.tsx`
- **Action:**
  - Rename view to `Agenda` or keep `Wellness` but broaden scope.
  - Add Tabs: `WELLNESS (SPA)` | `AULAS (GROUP)`
  - Update `renderServices` to filter by type.
  - Update `renderSchedule` to handle class capacities (mocked for now).

---

## 4. 💳 Plan & Subscription Status
**Goal:** Read-only view of financial/subscription status.

### Schema Changes
- **File:** `types.ts`
- **Update:** `User` interface
  - Add `plan: { type: 'GOLD' | 'PLATINUM', name: string, renewalDate: string, status: 'ACTIVE' | 'PENDING' | 'OVERDUE' }`

### UI Changes
- **File:** `views/Profile.tsx`
- **Action:**
  - Add "Meu Plano" section.
  - Show Status Badge (Active = Green, Overdue = Red).
  - Button "Falar com Gerente" (WhatsApp link) for plan changes.

---

## 5. 🏆 Gamification (Clubs)
**Goal:** Engage users with badges and squads.

### Schema Changes
- **File:** `types.ts`
- **Update:** `User` interface
  - Add `gamification: { level: number, points: number, badges: string[], club: string }`

### UI Changes
- **File:** `views/Profile.tsx` or `views/Home.tsx`
- **Action:**
  - Display "Level" and "Club Badge" (e.g., "Club 20+", "Team Iron").

---

## 📅 Execution Order
1.  **Types & Data:** Update `types.ts`, `data/exercises.ts`, `constants.ts`.
2.  **Video:** Update `ActiveSession.tsx`.
3.  **Wellness/Classes:** Refactor `Wellness.tsx`.
4.  **Profile Features:** Implement Plan, Guest Pass, and Gamification in `Profile.tsx`.
