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
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom hooks
│   │   ├── lib/       # Utilities and helpers
│   │   ├── store/     # Zustand state management
│   │   ├── types/     # TypeScript types
│   │   └── App.tsx    # Main app component
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

## ✨ Features

### Dashboard

- **Header**: App title, subtitle, connection status badge
- **Stats Cards**: Total, Open, Acknowledged, Resolved, Critical incidents
- **Filter Bar**: Search, filter by severity/status/service, sort options
- **Incident List**: Scrollable list with real-time updates
- **Detail Panel**: Full incident information with actions
- **Event Feed**: Real-time event log (Created, Acknowledged, Resolved)

### Real-time Updates

- Live WebSocket connection with automatic reconnection
- Instant incident list updates
- Detail panel synchronization
- Event feed on all changes

### Filtering & Search

- Full-text search by title and description
- Filter by severity (Critical, High, Medium, Low)
- Filter by status (Open, Acknowledged, Resolved)
- Filter by service
- Sort by latest first or oldest first

### Actions

- **Acknowledge**: Mark incident as acknowledged
- **Resolve**: Mark incident as resolved
- Context-aware button states

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
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **date-fns** - Date formatting

### Backend

- **Express.js** - Web server
- **Socket.IO** - Real-time server
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

- ✅ Modern React patterns and hooks
- ✅ TypeScript best practices
- ✅ State management with Zustand
- ✅ Real-time WebSocket integration
- ✅ Responsive design with Tailwind
- ✅ Component composition and reusability
- ✅ Type-safe full-stack development
- ✅ Clean project structure
- ✅ Professional UI/UX design

## 📄 License

MIT
