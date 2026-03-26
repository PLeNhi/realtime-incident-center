# Realtime Incident Center - Backend

Node.js/Express server with Socket.IO for real-time incident monitoring.

## Tech Stack

- Express.js
- Socket.IO
- TypeScript
- Node.js

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

The server will start on `http://localhost:3001`

### Build

```bash
npm run build
```

## API Endpoints

### GET /api/incidents

Fetch all incidents

**Response:**

```json
[
  {
    "id": "abc123",
    "title": "High CPU Usage",
    "description": "Server CPU usage exceeded 90%",
    "service": "API Gateway",
    "severity": "critical",
    "status": "open",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "owner": "ops-team",
    "metric": "CPU"
  }
]
```

### POST /api/incidents/:id/acknowledge

Acknowledge an incident

**Response:** Updated incident

### POST /api/incidents/:id/resolve

Resolve an incident

**Response:** Updated incident

## WebSocket Events

### incident:created

Emitted when a new incident is created

### incident:updated

Emitted when an incident is updated

### incidents:sync

Emitted to newly connected clients with all current incidents

## Features

- In-memory mock incident data
- Automatic incident generation (simulates production incidents)
- Real-time Socket.IO updates
- RESTful API endpoints
- CORS enabled
- Type-safe with TypeScript

## Mock Data Generation

The server automatically generates new incidents at random intervals (every 10-30 seconds) to simulate a live incident environment. Incidents are stored in memory and are not persisted.
