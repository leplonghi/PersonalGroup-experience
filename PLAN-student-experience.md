# PLAN-student-experience

## Overview
Transform the current "Profile" section (`Profile.tsx`) into a comprehensive **Student Experience Dashboard**. This new hub will not only manage user data but also proactively show gym activities, personal trainer availability, wellness status, and performance reports. The UI must strictly adhere to the new "Blue-Centric" design system (`index.css`), utilizing `glass-panel`, `precision-bg`, and high-contrast blue gradients for a premium feel.

## Project Type
**WEB** (React/Vite + Tailwind CSS)

## Success Criteria
1.  **Dashboard Transformation**: `Profile.tsx` evolves into a dashboard showing "at-a-glance" info (Wellness, Schedule, Trainers).
2.  **New Data Stores**: Implementation of `mockGymData.ts` to power Schedules and Trainer availability.
3.  **Visual Overhaul**: Interface uses `bg-app` (midnight blue), `glass-card`, and `text-gradient` for a sleek, modern look. High contrast for readability.
4.  **Information Accessibility**: Students can see "What's happening now" and "Who is available" without deep clicking.

## Tech Stack
-   **React**: Core view library.
-   **Tailwind CSS**: v4/PostCSS (via `index.css`) for styling.
-   **Lucide React**: For premium iconography.
-   **TypeScript**: Robust typing for new data models.

## File Structure
```
/
├── data/
│   └── scheduleData.ts       # Mock data for Gym Classes & Trainer Schedules
├── components/
│   └── dashboard/            # New widgets for Student Hub
│       ├── ActivityCard.tsx  # Shows current/upcoming classes
│       ├── TrainerRow.tsx    # Shows available trainers
│       └── StatWidget.tsx    # For Reports/Wellness summary
├── views/
│   ├── StudentHub.tsx        # REPLACES or EXTENDS Profile.tsx
│   └── Profile.tsx           # (To be refactored/archived)
└── index.css                 # (Reference for design tokens)
```

## Task Breakdown

### Phase 1: Foundation & Data
| Task ID | Task Name | Description | Input | Output | Verify |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S-01** | **Create Mock Data** | Create `data/scheduleData.ts` with explicit types for `ClassSession` and `TrainerSlot`. Defined static data for the week. | Schema Definition | `data/scheduleData.ts` | `import { gymSchedule }` works |
| **S-02** | **Design Widget Components** | Create reusable dashboard widgets (`ActivityCard`, `TrainerRow`) in `components/dashboard/` using `glass-panel` styles. | `index.css` styles | Widget Components | Render in isolation check |

### Phase 2: Dashboard Implementation
| Task ID | Task Name | Description | Input | Output | Verify |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S-03** | **Build Student Hub View** | Create `views/StudentHub.tsx`. Layout using CSS Grid/Flex. Include "Welcome [User]", "Deep Health Survey" (Widget), "Today's Schedule". | Widgets, Data | `views/StudentHub.tsx` | View renders with correct background |
| **S-04** | **Integrate Wellness Widget** | Add a prominent "Wellness Day" widget that deep-links to `Wellness.tsx`. Show "Next Session" if booked (mocked for now). | `views/Wellness.tsx` (reference) | Widget in Hub | Button routes to Wellness view |
| **S-05** | **Implement Reports Section** | Add visuals for "Assessment Reports" and "Exercise Plans" (Cards with charts/icons). | Mock Data | UI Section | Visual check of charts/graphs |

### Phase 3: Routing & Polish
| Task ID | Task Name | Description | Input | Output | Verify |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S-06** | **Update Navigation** | Switch the main navigation/routing to point "Profile/Student" to the new `StudentHub.tsx`. | `App.tsx` or `Navigation.tsx` | Updated Routing | Click "Aluno" -> Goes to Dashboard |
| **S-07** | **Final UI Polish** | Apply `grain-overlay`, `precision-bg` effects. Ensure text contrast (white on dark blue). Check mobile responsiveness. | `index.css` | Polished UI | UX Audit Script / Visual Check |

## Phase X: Verification Checklist
- [ ] **Lint & Build**: Run `npm run lint` and `npm run build` to ensure no TS errors.
- [ ] **Data Integrity**: Mock data helps render all sections without "undefined" errors.
- [ ] **Design Compliance**:
    - [ ] No plain HTML colors (use `text-slate-300`, `text-blue-500`, etc.).
    - [ ] `glass-panel` used for all cards.
    - [ ] Background is `bg-app` (midnight blue).
- [ ] **Responsiveness**: Dashboard stacks correctly on mobile.

