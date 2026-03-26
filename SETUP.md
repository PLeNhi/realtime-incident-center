# Setup & Installation Guide

## Prerequisites

- **Node.js**: 16.x or newer
- **npm**: 7.x or newer
- **macOS/Linux/Windows**: All platforms supported
- **Git**: For version control

## What is Turborepo?

This monorepo uses **Turborepo** for intelligent build orchestration and caching:

- **Parallel Execution**: Runs tasks across packages simultaneously
- **Smart Caching**: Caches build outputs to skip redundant builds
- **Task Orchestration**: Manages dependencies between packages
- **Incremental Builds**: Only rebuilds what changed

See [turbo.json](turbo.json) for build pipeline configuration.

## Project Installation

### Option 1: Automatic Setup (Recommended)

Install all dependencies for both frontend and backend at once:

```bash
# From the project root
npm install
```

This uses npm workspaces to install dependencies for both `frontend/` and `backend/` packages.

### Option 2: Manual Setup

Install frontend and backend separately:

```bash
# Backend
cd backend
npm install

# Frontend (in another directory/terminal)
cd ../frontend
npm install
```

## Running the Application

### Option 1: Run Both Simultaneously (Recommended)

From the project root, run both services at once:

```bash
npm run dev
```

This uses **Turborepo** to orchestrate parallel builds and caching:

- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

Turborepo automatically parallelizes tasks across packages and caches outputs for faster subsequent builds.

### Option 2: Run Services Separately

**Terminal 1 - Backend Server:**

```bash
npm run backend
# or
cd backend && npm run dev
```

Server runs at: `http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**

```bash
npm run frontend
# or
cd frontend && npm run dev
```

App runs at: `http://localhost:5173`

## Turborepo CLI Commands

### Common Commands

```bash
# Run dev across all packages (with caching)
npm run dev

# Build all packages (with caching & parallel execution)
npm run build

# Lint all packages
npm run lint

# Type-check all packages
npm run type-check

# Run dev in specific package
npm run frontend    # Frontend only
npm run backend     # Backend only

# Clean build cache and node_modules
npm run clean
```

### Filtering Tasks

Run tasks in specific packages:

```bash
# Build only frontend
turbo run build --filter=realtime-incident-center-frontend

# Dev only backend
turbo run dev --filter=realtime-incident-center-backend

# Run lint excluding node_modules
turbo run lint --scope=realtime-incident-center-frontend
```

## Accessing the Application

1. Open your browser to `http://localhost:5173`
2. The app will automatically connect to the backend on `http://localhost:3001`
3. You should see the dashboard with connected status indicator

> **Note:** If running from different machines, update `VITE_SOCKET_URL` in frontend to point to your backend server

## Troubleshooting

### Port Already in Use

If you get "Port already in use" errors:

```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

Or specify custom ports:

```bash
# Backend
PORT=3002 npm run backend

# Frontend - update vite.config.ts server.port
```

### Connection Issues

1. Verify backend is running: `curl http://localhost:3001/health`
2. Check browser console for errors
3. Verify CORS settings in [backend/src/server.ts](backend/src/server.ts)
4. Check firewall settings

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
# From project root
rm -rf frontend/node_modules backend/node_modules
npm install
```

## Development

### Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Start dev server
npm run dev

# Build TypeScript
npm run build
```

## Environment Configuration

### Frontend

Configure in `frontend/vite.config.ts`:

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

For production, set `VITE_SOCKET_URL`:

```bash
VITE_SOCKET_URL=https://api.example.com npm run build
```

### Backend

Configure environment:

```bash
PORT=3001  # Default: 3001
NODE_ENV=development  # or production
```

## Project Structure Overview

```
realtime-incident-center/
├── frontend/
│   ├── src/
│   │   ├── api/           # API clients
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities
│   │   ├── store/         # Zustand store
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── services/      # Business logic
│   │   ├── types.ts       # TypeScript types
│   │   └── server.ts      # Express server
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Root workspace config
└── README.md
```

## Testing the Application

1. **View Dashboard:**
   - Open `http://localhost:5173`
   - Check connection status in top right

2. **Test Filtering:**
   - Use search box to filter by title
   - Select severity, status, and service filters
   - Clear filters with "Clear all" button

3. **Test Real-time Updates:**
   - Watch for new incidents appearing
   - Event feed shows new incidents
   - Stats cards update automatically

4. **Test Actions:**
   - Click an incident to select it
   - Click "Acknowledge" to change status
   - Click "Resolve" to close incident
   - Watch detail panel and list update

## Performance Notes

- Mock data is generated in memory (no database)
- New incidents are generated every 10-30 seconds
- Event feed keeps last 15 events
- List automatically sorts by latest updates
- All filtering happens client-side via Zustand store

## Next Steps

1. ✅ Frontend running and connected
2. ✅ Real-time updates working
3. ✅ Filtering and search functional
4. ✅ Actions updating incident state

Consider adding for production:

- Backend database (PostgreSQL, MongoDB, etc.)
- Authentication & authorization
- User roles and permissions
- Persistent data storage
- Error boundaries and error handling
- Testing suite (Jest, React Testing Library)
- CI/CD pipeline
- Deployment configuration

## Support

Refer to individual README files:

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Main README](README.md)
