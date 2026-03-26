# Realtime Incident Center - Frontend

Modern React dashboard for monitoring system incidents in realtime.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- TanStack React Query
- Socket.IO Client
- date-fns

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build

```bash
npm run build
```

## Features

- Real-time incident monitoring
- Live WebSocket updates
- Advanced filtering and search
- Incident details panel
- Acknowledge/Resolve actions
- Event feed
- Connection status indicator

## Project Structure

```
src/
├── api/          # API clients and Socket.IO setup
├── components/   # React components
├── hooks/        # Custom React hooks
├── lib/          # Utilities and helpers
├── store/        # Zustand store
├── types/        # TypeScript type definitions
├── App.tsx       # Main app component
└── main.tsx      # Entry point
```
