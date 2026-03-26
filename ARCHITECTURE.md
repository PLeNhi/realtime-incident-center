# System Architecture & Data Flow

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Application                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Components                                        │  │  │
│  │  │  • Header (connection status)                      │  │  │
│  │  │  • StatsCards (metrics)                            │  │  │
│  │  │  • FilterBar (search/filters)                      │  │  │
│  │  │  • IncidentList (main list)                        │  │  │
│  │  │  • IncidentDetail (detail panel)                   │  │  │
│  │  │  • EventFeed (real-time events)                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                         ▲                                  │  │
│  │                         │ (subscribe)                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Zustand Store (State Management)                  │  │  │
│  │  │  • incidents[]                                     │  │  │
│  │  │  • filters (search, severity, status, service)    │  │  │
│  │  │  • selectedIncidentId                             │  │  │
│  │  │  • events[]                                       │  │  │
│  │  │  • isConnected                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                         ▲                                  │  │
│  │                         │ (dispatch)                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Socket.IO Client + API Client                    │  │  │
│  │  │  • WebSocket connection                           │  │  │
│  │  │  • HTTP API calls                                 │  │  │
│  │  │  • Event listeners                                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP + WebSocket
                            │
┌─────────────────────────────────────────────────────────────────┐
│                  Node.js/Express Server                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express Routes                                         │  │
│  │  • GET /api/incidents                                  │  │
│  │  • POST /api/incidents/:id/acknowledge                │  │
│  │  • POST /api/incidents/:id/resolve                    │  │
│  │  • GET /health                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         ▲                                       │
│                         │                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Socket.IO Server                                       │  │
│  │  • incident:created                                    │  │
│  │  • incident:updated                                    │  │
│  │  • incidents:sync                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         ▲                                       │
│                         │ (notify)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  IncidentService (In-Memory)                           │  │
│  │  • incidents Map                                       │  │
│  │  • generateIncidents()                                 │  │
│  │  • acknowledgeIncident()                               │  │
│  │  • resolveIncident()                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 1. Initial Load Flow

```
User Opens App
    ↓
Browser requests http://localhost:5173
    ↓
Vite serves index.html + React app
    ↓
App.tsx mounts
    ↓
useSocketConnection() hook initializes
    ↓
Socket.IO establishes connection to http://localhost:3001
    ↓
Backend emits incident:sync with all incidents
    ↓
Store.setIncidents() updates state
    ↓
Components re-render with initial data
    ↓
UI displays incidents list, stats, event feed
    ↓
Header shows green "Connected" status
```

### 2. Real-Time Incident Creation Flow

```
Backend generates new incident
    ↓
IncidentService.addIncident()
    ↓
Socket.IO emits incident:created { incident }
    ↓
All connected clients receive event
    ↓
useSocketConnection hook catches event
    ↓
Store.addIncident() adds to incidents array
    ↓
Store.addEvent() adds to event feed
    ↓
Components re-render (new incident at top)
    ↓
User sees:
  • New incident in list
  • Updated stats cards
  • New event in feed
```

### 3. User Action Flow (Acknowledge)

```
User clicks "Acknowledge" button
    ↓
IncidentDetail.onAcknowledge() called
    ↓
API client calls POST /api/incidents/:id/acknowledge
    ↓
Backend IncidentService.acknowledgeIncident()
    ↓
Status changed to "acknowledged"
    ↓
Backend notifies through updatedCallback
    ↓
Socket.IO emits incident:updated { incident }
    ↓
All clients receive update
    ↓
useSocketConnection hook catches event
    ↓
Store.updateIncident() updates in array
    ↓
Store.addEvent() logs the event
    ↓
Components re-render:
  • Detail panel status badge updates
  • List item status updates
  • Stats cards recalculate
  • Event feed shows new event
```

### 4. Filtering Flow

```
User types in search box
    ↓
FilterBar calls setSearchTerm(value)
    ↓
Store.searchTerm updates
    ↓
Components subscribe to store update
    ↓
Store.getFilteredIncidents() recalculates
    ↓
Applies filters:
  1. Search filter (title + description)
  2. Severity filter
  3. Status filter
  4. Service filter
  5. Sort by latest/oldest
    ↓
IncidentItem components re-render with filtered list
    ↓
User sees only matching incidents
```

---

## 🔌 API Contracts

### Incident Type

```typescript
interface Incident {
  id: string; // Unique ID
  title: string; // Incident title
  description: string; // Full description
  service: string; // Service name
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "acknowledged" | "resolved";
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  owner?: string; // Team/person responsible
  metric?: string; // Affected component
}
```

### Event Type

```typescript
interface IncidentEvent {
  id: string; // Unique ID
  type: "created" | "acknowledged" | "resolved" | "updated";
  incidentId: string;
  incidentTitle: string;
  timestamp: string; // ISO timestamp
}
```

---

## 🔗 WebSocket Events

### Server → Client

#### `incident:created`

```javascript
socket.emit("incident:created", incident);
// When: New incident generated every 10-30 seconds
// Payload: Full Incident object
// Action: AddIncident to store, add Event
```

#### `incident:updated`

```javascript
socket.emit("incident:updated", incident);
// When: Incident status changed (acknowledge/resolve)
// Payload: Full Incident object
// Action: UpdateIncident in store, add Event
```

#### `incidents:sync`

```javascript
socket.emit('incidents:sync', incidents[])
// When: Client first connects
// Payload: Array of all Incident objects
// Action: setIncidents in store (initial load)
```

---

## 💾 Store State Structure

```typescript
{
  // Incident data
  incidents: Incident[]                    // All incidents
  selectedIncidentId: string | null        // Currently selected
  events: IncidentEvent[]                  // Event feed (max 15)

  // Filters
  searchTerm: string                       // Search text
  severityFilter: Severity | null          // Severity filter
  statusFilter: IncidentStatus | null      // Status filter
  serviceFilter: string | null             // Service filter
  sortBy: 'latest' | 'oldest'             // Sort order

  // Connection
  isConnected: boolean                     // Socket connection state
}
```

---

## 🎯 Component Hierarchy

```
App
├── Header
│   └── Connection Status Badge
├── StatsCards
│   ├── Total Card
│   ├── Open Card
│   ├── Acknowledged Card
│   ├── Resolved Card
│   └── Critical Card
├── FilterBar
│   ├── Search Input
│   ├── Severity Select
│   ├── Status Select
│   ├── Service Select
│   └── Sort Select
├── Left Column (Sidebar)
│   ├── FilterBar
│   ├── Incident List
│   │   └── IncidentItem[] (filtered)
│   │       ├── Title
│   │       ├── Service
│   │       ├── Severity Badge
│   │       ├── Status Badge
│   │       └── Updated Time
│   └── EventFeed
│       └── EventFeedItem[]
│           ├── Icon
│           ├── Title
│           └── Timestamp
└── Right Column (Detail Panel)
    └── IncidentDetail
        ├── Header
        │   ├── Title
        │   ├── Severity Badge
        │   └── Status Badge
        ├── Content
        │   ├── Description
        │   ├── Service
        │   ├── Severity
        │   ├── Status
        │   ├── Owner
        │   ├── Created Time
        │   ├── Updated Time
        │   └── Metric
        └── Actions
            ├── Acknowledge Button
            └── Resolve Button
```

---

## 🔄 State Update Flow

```
User Action / Server Event
    ↓
Hook/Component Handler
    ↓
API Call or Store Action
    ↓
      ├─→ API Call → Backend → Database Change → Socket Event
      │
      └─→ Store Update → State Change
    ↓
Store Subscribers Notified
    ↓
Components Re-render (Zustand)
    ↓
UI Updates
    ↓
User Sees Changes Immediately
```

---

## 🚀 Request/Response Examples

### GET /api/incidents

**Request:**

```http
GET http://localhost:3001/api/incidents
```

**Response (200 OK):**

```json
[
  {
    "id": "abc123",
    "title": "High CPU Usage",
    "description": "Server CPU exceeded 90%",
    "service": "API Gateway",
    "severity": "critical",
    "status": "open",
    "createdAt": "2024-03-26T10:30:00Z",
    "updatedAt": "2024-03-26T10:35:00Z",
    "owner": "ops-team",
    "metric": "CPU"
  },
  ...
]
```

### POST /api/incidents/:id/acknowledge

**Request:**

```http
POST http://localhost:3001/api/incidents/abc123/acknowledge
Content-Type: application/json
```

**Response (200 OK):**

```json
{
  "id": "abc123",
  "title": "High CPU Usage",
  "description": "Server CPU exceeded 90%",
  "service": "API Gateway",
  "severity": "critical",
  "status": "acknowledged",  ← Changed
  "createdAt": "2024-03-26T10:30:00Z",
  "updatedAt": "2024-03-26T10:36:00Z",  ← Updated
  "owner": "ops-team",
  "metric": "CPU"
}
```

---

## 📈 Performance Characteristics

| Operation          | Time      | Notes                    |
| ------------------ | --------- | ------------------------ |
| Initial load       | <1s       | Fetch incidents + render |
| Filter search      | <50ms     | Client-side only         |
| Incident selection | <10ms     | Store update             |
| Acknowledge action | 100-200ms | API call + socket        |
| Real-time update   | <200ms    | Socket deliver + render  |
| Event feed update  | <50ms     | Store update             |
| Stats recalc       | <30ms     | useMemo optimization     |

---

## 🔐 Security Considerations

For production, add:

- ✅ Input validation
- ✅ Authentication/Auth
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ SQL injection prevention (if DB added)
- ✅ XSS prevention (React handles most)
- ✅ HTTPS/WSS
- ✅ API request signing

Current MVP: No security measures (local dev only)

---

## 📞 Connection Lifecycle

```
1. User opens app
2. Socket.IO client auto-connects to ws://localhost:3001
3. Server receives connection
4. Server emits incidents:sync with all data
5. Client receives and populates store
6. Header changes to "Connected"
7. Client listens for incident:created and incident:updated
8. When events arrive, store updates automatically
9. If connection drops:
   - Header changes to "Disconnected"
   - Client auto-reconnects (exponential backoff)
   - Server sends incidents:sync again
10. Connection maintains during filtering/selections
11. All real-time events update UI in real-time
```

---

This architecture ensures:

- ✅ Real-time synchronization
- ✅ Responsive user experience
- ✅ Scalable state management
- ✅ Clean separation of concerns
- ✅ Easy to extend and maintain
