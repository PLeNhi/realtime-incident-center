# Realtime Incident Center

A modern, responsive web dashboard for monitoring system incidents in real-time. Built with React, TypeScript, Tailwind CSS, and Socket.IO.

## 🎯 Overview

This is an MVP frontend portfolio project showcasing:

- Real-time data synchronization with WebSocket
- Modern React state management (Zustand)
- Clean, responsive UI design
- Type-safe TypeScript codebase
- Incident filtering and search
- Live status updates

## 🏗️ Project Structure

```
realtime-incident-center/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── api/       # API client and Socket.IO setup
│   │   ├── components/ # React components (shared, reusable)
│   │   ├── hooks/     # Custom hooks
│   │   ├── lib/       # Utilities and helpers
│   │   ├── pages/     # Page components (DashboardPage, IncidentsPage)
│   │   ├── store/     # Zustand state management
│   │   ├── types/     # TypeScript types
│   │   ├── main.tsx   # Entry point
│   │   ├── App.tsx    # Main app with tab navigation
│   │   └── index.css  # Global styles
│   ├── public/        # Static assets (logo.svg, favicon.svg)
│   └── package.json
├── backend/           # Express + Socket.IO server
│   ├── src/
│   │   ├── services/  # Business logic
│   │   ├── types.ts   # TypeScript types
│   │   └── server.ts  # Express server
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### One-command setup (Turborepo built-in):

```bash
npm install
npm run dev
```

This monorepo uses **Turborepo** for intelligent caching and parallel task execution.

````

This starts both frontend and backend simultaneously.

### Or manual setup:

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm run dev
````

Server runs on `http://localhost:3001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## ✨ V2 Features & Enhancements

This V2 release adds advanced frontend engineering patterns for a polished, production-like experience:

### 🎯 Core Enhancements

- **Relative Time Updates** - All timestamps update every 30 seconds without full page reload using `formatRelativeTime` utility (e.g., "5 minutes ago", "now")
- **New Incident Highlighting** - Fresh incidents pulse with an orange glow for 3 seconds, then fade to normal state
- **Optimistic Updates** - Actions execute instantly on UI, rollback gracefully on error with user feedback
- **Toast Notifications** - Success/error/info/warning toasts auto-dismiss after 3 seconds with contextual messages
- **Enhanced Socket Handling** - 3-state connection tracking: connected, reconnecting, disconnected with animated status indicators
- **Incident Timeline** - Visual timeline showing incident history (created → acknowledged → resolved)
- **Advanced Sorting** - Sort by latest-updated, newest-created, severity priority, or status priority
- **Skeleton Loaders** - Loading states for stats cards, incident items, and detail panels
- **Empty State Polish** - Helpful messages when no data available

### 🎨 UI/UX Improvements

- **Header Status Display** - Dynamic socket status with sublabels ("Receiving live updates", "Attempting to restore connection")
- **Highlight Animations** - Orange-50 background with pulse animation for newly created incidents
- **Organized Detail Panel** - 4-section layout: Summary, Details, Timeline, Actions
- **Event Feed Icons** - Emoji icons and relative timestamps for all event types
- **Metadata Grid** - Clean grid layout for service, severity, status, owner, created, updated
- **Button States** - Disabled/loading states for actions, disabled buttons when actions unavailable

### 💡 Advanced Patterns

**Optimistic Updates Pattern:**

```typescript
// 1. Save original
const originalIncident = selectedIncident
// 2. Update UI immediately
updateIncident({ ...selectedIncident, status: 'acknowledged' })
// 3. Confirm with server
const updated = await acknowledgeIncident(id)
// 4. Or rollback on error
catch (err) { updateIncident(originalIncident) }
```

**Socket Lifecycle:**

```
connected → emit events → show toasts
reconnecting → show spinner, disable actions
disconnected → show red status, warn user
connected → auto-retry failed actions
```

**Relative Time Auto-Refresh:**

```typescript
// Every 30 seconds, force re-render
useEffect(() => {
  const interval = setInterval(() => setTimeUpdate((t) => t + 1), 30000);
  return () => clearInterval(interval);
}, []);
```

## ✨ Features

### Dashboard

- **Header**: App title, subtitle, 3-state connection status badge with animations
- **Stats Cards**: Total, Open, Acknowledged, Resolved, Critical incidents with skeleton loaders
- **Filter Bar**: Search, filter by severity/status/service, 4 sort options with clear filters button
- **Incident List**: Real-time updates with highlight animation for new incidents, compact relative times
- **Detail Panel**: 4-section layout (Summary, Details, Timeline, Actions) with incident history timeline
- **Event Feed**: Real-time event log with emoji icons and relative timestamps, instant updates

### Real-time Updates

- Live WebSocket connection with automatic 3-state tracking and reconnection
- Instant incident list updates with visual highlighting for new incidents
- Detail panel synchronization with timeline of changes
- Event feed with optimistic updates and toast notifications
- 30-second relative time refresh for "X ago" timestamps

### Filtering & Search

- Full-text search by title and description
- Filter by severity (Critical, High, Medium, Low)
- Filter by status (Open, Acknowledged, Resolved)
- Filter by service
- Sort by 4 options: Latest Updated, Newest Created, Severity Priority, Status Priority
- Clear filters button to reset all filters at once

### Actions

- **Acknowledge**: Mark incident as acknowledged with optimistic update
- **Resolve**: Mark incident as resolved with optimistic update
- Instant UI feedback with toast notifications
- Automatic rollback on errors
- Context-aware button states (disabled when not available)

## 📑 Page Structure & Navigation

The dashboard features a **tab-based navigation system** with two main views:

### 1. Dashboard Page (Default)

- **Purpose**: High-level overview of system health
- **Components**:
  - Stats Cards (5 key metrics with icons)
  - Incident Trend Chart (8-hour visualization)
  - Incidents by Severity Chart (breakdown)
  - Quick Stats (response time, resolution rate, P1 count, uptime)
- **Use case**: Executives, managers, quick status checks

### 2. Incidents Page

- **Purpose**: Deep-dive incident management
- **Components**:
  - Incident List (left sidebar with filters and search)
  - Incident Detail Panel (right sidebar with full details and timeline)
- **Use case**: DevOps engineers, incident responders, detailed work

### Navigation Tabs

- Located in header below main branding
- Two tabs: "📊 Dashboard" and "🚨 Incidents"
- Active tab highlighted in orange with underline
- Quick keyboard accessibility and visual clarity

### Layout Responsiveness

- **Desktop**: Side-by-side layout (list 1/3, detail 2/3)
- **Mobile**: Stacked layout with full-width components
- **Smooth transitions** between pages without losing state

## 🎨 Design Principles

- **Simple**: Clean, minimal interface focused on readability
- **Modern**: Contemporary design with Tailwind CSS
- **Responsive**: Desktop and mobile optimized
- **Accessible**: Semantic HTML, keyboard-friendly
- **Dashboard-like**: Easy to scan at a glance

## 📦 Tech Stack

### Monorepo

- **Turborepo** - Intelligent build system with smart caching

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management with V2 enhancements (socket status, highlighting, sorting)
- **Socket.IO Client** - Real-time communication with 3-state lifecycle tracking
- **date-fns** - Date formatting and relative time calculations
- **lucide-react** - Icon library

### Frontend V2 Utilities & Components

- **`lib/time.ts`** - Time formatting (formatRelativeTime, formatCompactRelativeTime, formatAbsoluteDateTime)
- **`store/toasts.ts`** - Toast notification system with auto-dismiss
- **`components/ToastContainer.tsx`** - Toast UI with 4 types (success, error, info, warning)
- **`components/Timeline.tsx`** - Incident history timeline with event icons
- **`components/Skeletons.tsx`** - Loading state components (stats, items, detail panels)

### Backend

- **Express.js** - Web server
- **Socket.IO** - Real-time server with incident streaming
- **TypeScript** - Type safety
- **Node.js** - Runtime

## 📖 Development

### Frontend Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

### Backend Commands

```bash
npm run dev      # Start dev server
npm run build    # Build TypeScript
npm start        # Run production build
```

## 🔌 API Endpoints

### GET /api/incidents

Get all incidents

### POST /api/incidents/:id/acknowledge

Acknowledge an incident

### POST /api/incidents/:id/resolve

Resolve an incident

## 🎯 WebSocket Events

- `incident:created` - New incident created
- `incident:updated` - Incident status changed
- `incidents:sync` - Initial sync on connect

## 📝 Mock Data

The backend generates mock incidents automatically:

- Random incident generation every 10-30 seconds
- Mix of severities and statuses
- Multiple services
- In-memory storage (no persistence)

## 🎓 Portfolio Notes

This project demonstrates:

- ✅ Modern React patterns and hooks with custom state management
- ✅ TypeScript best practices with comprehensive type definitions
- ✅ State management with Zustand including V2 enhancements
- ✅ Real-time WebSocket integration with 3-state lifecycle tracking
- ✅ Responsive design with Tailwind CSS
- ✅ **V2 Enhancements:**
  - Optimistic updates with graceful error handling
  - Toast notifications for user feedback
  - Relative time formatting with auto-refresh intervals
  - New incident highlighting with visual effects
  - Advanced component composition (Timeline, Skeletons)
  - Socket status tracking and reconnection UX
  - Production-grade error recovery patterns
- ✅ Component composition and reusability
- ✅ Type-safe full-stack development
- ✅ Clean project structure
- ✅ Professional UI/UX design

## 📄 License

MIT
