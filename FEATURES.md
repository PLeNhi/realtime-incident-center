# Features & Implementation Guide

## Dashboard Sections

### 1. Header Section

Located at the top of the page.

**Component:** `Header.tsx`

**Features:**

- Application title: "Realtime Incident Center"
- Subtitle: "Live monitoring for system incidents"
- Connection status indicator (top-right):
  - Green pulsing dot when connected
  - Red dot when disconnected
  - Real-time updates as status changes

**Implementation Details:**

- Uses Zustand store to get `isConnected` state
- Socket.IO connection automatically manages this state
- Tailwind CSS for styling

### 2. Overview Statistics Cards

Shows key metrics below the header.

**Component:** `StatsCards.tsx`

**Cards Displayed:**

1. **Total Incidents** - Count of all incidents
2. **Open** - Count of incidents with status "open" (red)
3. **Acknowledged** - Count of incidents with status "acknowledged" (blue)
4. **Resolved** - Count of incidents with status "resolved" (green)
5. **Critical** - Count of incidents with severity "critical" (red)

**Features:**

- Auto-updates when incidents change
- Real-time computation using useMemo
- Responsive grid layout (2-5 columns based on screen size)
- Cards have subtle borders and shadows

### 3. Filter Bar

Location: Below stats cards, spans full width.

**Component:** `FilterBar.tsx`

**Filter Controls:**

1. **Search Input**
   - Full-text search by title and description
   - Real-time filtering as you type

2. **Severity Filter**
   - Options: All, Critical, High, Medium, Low
   - Filters incident list by SELECT

3. **Status Filter**
   - Options: All, Open, Acknowledged, Resolved
   - Only shows matching statuses

4. **Service Filter**
   - Dynamic list based on available services
   - Only shows if services exist

5. **Sort Control**
   - "Latest First" - Sorts by most recently updated
   - "Oldest First" - Sorts by least recently updated

**Features:**

- "Clear all" button appears when filters active
- Responsive layout: flex row on desktop, wraps on mobile
- All filters combined (AND logic)
- Real-time filtering updates incident list

### 4. Incident List (Left Column)

Location: Left side on desktop, full width on mobile.

**Component:** `IncidentItem.tsx` (individual items)

**Each Incident Shows:**

- Title (truncated to 2 lines)
- Service name
- Severity badge (Critical, High, Medium, Low)
- Status badge (Open, Acknowledged, Resolved)
- Time since last update ("5 minutes ago", "2 hours ago")

**Behaviors:**

- Click to select/deselect
- Selected incident is highlighted with blue background
- Hover effect on non-selected items
- Newly created incidents appear at top
- List scrolls independently
- Real-time updates reorder list automatically

**Responsive:**

- Full width on mobile
- ~33% width on desktop
- Takes 50% on tablet

### 5. Incident Detail Panel (Right Column)

Location: Right side on desktop, below list on mobile.

**Component:** `IncidentDetail.tsx`

**Displays When Incident Selected:**

**Header Section:**

- Full incident title
- Severity badge with color coding
- Status badge

**Main Content:**

- Description (full text)
- Service
- Severity
- Status
- Owner (if available)
- Created timestamp
- Updated timestamp (relative: "5 minutes ago")
- Affected component/metric

**Action Buttons:**

- **Acknowledge Button**
  - Enabled: When status is "open"
  - Disabled: When status is "acknowledged" or "resolved"
  - Action: Changes status to "acknowledged"

- **Resolve Button**
  - Enabled: When status is "open" or "acknowledged"
  - Disabled: When status is already "resolved"
  - Action: Changes status to "resolved"

**Behaviors:**

- Updates in real-time when externally modified
- Shows loading state during action (button text changes)
- Disabled state when action in progress
- Auto-scrolls content if too tall
- Graceful "Select an incident" message when none selected

### 6. Real-Time Event Feed

Location: Below incident list (left column).

**Component:** `EventFeed.tsx`

**Shows:**

- Recent events (last 15)
- Event type icons:
  - ✨ Incident Created
  - 👀 Incident Acknowledged
  - ✅ Incident Resolved
  - 📝 Incident Updated

**Each Event Item:**

- Event type and action
- Incident title
- Relative timestamp ("2 minutes ago")

**Behaviors:**

- Auto-updates with each incident change
- Keeps only 15 most recent events
- Scrolls if overflow
- Compact visual design

## State Management (Zustand Store)

**File:** `store/index.ts`

**State Properties:**

```typescript
// Incident data
incidents: Incident[]
selectedIncidentId: string | null
events: IncidentEvent[]

// Filters
searchTerm: string
severityFilter: Severity | null
statusFilter: IncidentStatus | null
serviceFilter: string | null
sortBy: 'latest' | 'oldest'

// Connection state
isConnected: boolean
```

**Actions:**

```typescript
setIncidents(); // Bulk set incidents
addIncident(); // Add new incident
updateIncident(); // Update existing
getIncident(); // Retrieve by ID
getFilteredIncidents(); // Get filtered + sorted
getAvailableServices(); // Unique services
setSelectedIncidentId(); // Select incident
addEvent(); // Add event to feed
setIsConnected(); // Update connection state
```

## Real-Time Updates (Socket.IO)

**File:** `hooks/useSocketConnection.ts`

**Connection Events:**

1. `connect` - Connection established
2. `disconnect` - Connection lost
3. `incident:created` - New incident created
4. `incident:updated` - Incident status changed

**Update Flow:**

1. Server emits `incident:created` or `incident:updated`
2. Hook receives event
3. Store updates automatically
4. Components re-render with new data

**Auto-Reconnection:**

- Automatic reconnect every 1-5 seconds
- Max 5 reconnection attempts
- Visual indicator shows connection state

## API Endpoints

**Backend:** `backend/src/server.ts`

### GET /api/incidents

- Returns all incidents
- Called once on app load
- Used to populate initial state

### POST /api/incidents/:id/acknowledge

- Sets incident status to "acknowledged"
- Emits socket event to all clients
- Returns updated incident

### POST /api/incidents/:id/resolve

- Sets incident status to "resolved"
- Emits socket event to all clients
- Returns updated incident

## Styling System

**Files:**

- `index.css` - Global styles
- `tailwind.config.js` - Tailwind configuration

**Color Scheme:**

- **Severity Colors:**
  - Critical: Red (#ef4444)
  - High: Orange (#f97316)
  - Medium: Yellow (#eab308)
  - Low: Green (#22c55e)

- **Status Colors:**
  - Open: Red background
  - Acknowledged: Blue background
  - Resolved: Green background

**Key Classes:**

- Cards: Clean white bg, soft borders
- Badges: Colored backgrounds with text
- Buttons: State-based styling
- Input fields: Focus ring on focus

## Responsive Design

**Mobile (< 640px):**

- Single column layout
- Full width panels
- Wrap filter controls

**Tablet (640px - 1024px):**

- 2 columns where possible
- Filters in 2 rows
- Side-by-side list/detail

**Desktop (> 1024px):**

- 3 panel layout
  - Left: Filter + List + Events (33%)
  - Right: Detail (66%)
- All filters in single row

## Performance Optimizations

1. **Client-side Filtering:** All filtering done in browser
2. **Zustand Store:** Minimal re-renders, only components that changed
3. **useMemo:** Stats cards recalculated only when incidents change
4. **Event Feed Limit:** Keeps only 15 events to limit memory
5. **Lazy Updates:** Socket events processed asynchronously

## Error Handling

- API errors logged to console
- User sees toast message for failed actions
- Network disconnection shows in header
- Invalid incident IDs handled gracefully

## Accessibility Features

- Semantic HTML (header, main, section)
- Color accompanied by text/icons
- Keyboard-friendly buttons and inputs
- Clear focus indicators
- ARIA labels where needed

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supporting ES2020

## Future Enhancement Ideas

- [ ] Incident search by ID
- [ ] Bulk actions (acknowledge multiple)
- [ ] Advanced filtering (date range, owner)
- [ ] Custom incident creation
- [ ] Notification preferences
- [ ] Dark mode
- [ ] Export incident data
- [ ] Dashboard customization
- [ ] User roles/permissions
- [ ] Incident history/timeline
