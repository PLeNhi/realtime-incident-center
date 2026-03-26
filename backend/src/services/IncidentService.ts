import { Incident, Severity, IncidentStatus } from './types.js'

const SERVICES = ['API Gateway', 'Auth Service', 'Database', 'Cache', 'Message Queue', 'Web Server']
const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low']
const TITLES = [
  'High CPU Usage Detected',
  'Database Connection Timeout',
  'Memory Leak in Worker Process',
  'Network Latency Spike',
  'SSL Certificate Expiration Warning',
  'Disk Space Low',
  'API Response Time Degradation',
  'Unusual Traffic Pattern',
]
const DESCRIPTIONS = [
  'Server CPU usage exceeded 90% threshold',
  'Database connection pool exhausted',
  'Process memory usage increasing over time',
  'Network latency between services increased by 200ms',
  'SSL certificate will expire in 30 days',
  'Disk usage on server reached 85%',
  'Average API response time increased from 100ms to 500ms',
  'Traffic from unknown IP addresses detected',
]

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function createMockIncident(
  id?: string,
  status: IncidentStatus = 'open'
): Incident {
  const now = new Date()
  const createdOffset = Math.floor(Math.random() * 86400000) // Random ms in last 24h
  const createdAt = new Date(now.getTime() - createdOffset)

  return {
    id: id || generateId(),
    title: getRandomItem(TITLES),
    description: getRandomItem(DESCRIPTIONS),
    service: getRandomItem(SERVICES),
    severity: getRandomItem(SEVERITIES),
    status,
    createdAt: createdAt.toISOString(),
    updatedAt: now.toISOString(),
    owner: Math.random() > 0.5 ? 'ops-team' : 'devops-team',
    metric: getRandomItem(['CPU', 'Memory', 'Disk', 'Network', 'Database']),
  }
}

export class IncidentService {
  private incidents: Map<string, Incident> = new Map()
  private updateCallbacks: Array<(incident: Incident) => void> = []

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData(): void {
    // Create initial incidents
    const count = Math.floor(Math.random() * 5) + 8 // 8-12 incidents
    for (let i = 0; i < count; i++) {
      const status = Math.random() > 0.6 ? 'open' : Math.random() > 0.5 ? 'acknowledged' : 'resolved'
      const incident = createMockIncident(undefined, status as IncidentStatus)
      this.incidents.set(incident.id, incident)
    }

    // Start generating new incidents periodically
    this.startGeneratingIncidents()
  }

  private startGeneratingIncidents(): void {
    // Generate new incident every 10-30 seconds
    setInterval(() => {
      if (Math.random() > 0.3) {
        const incident = createMockIncident()
        this.incidents.set(incident.id, incident)
        this.notifyUpdate(incident)
      }
    }, 10000 + Math.random() * 20000)
  }

  private notifyUpdate(incident: Incident): void {
    this.updateCallbacks.forEach((cb) => cb(incident))
  }

  onUpdate(callback: (incident: Incident) => void): void {
    this.updateCallbacks.push(callback)
  }

  getAllIncidents(): Incident[] {
    return Array.from(this.incidents.values())
  }

  getIncident(id: string): Incident | undefined {
    return this.incidents.get(id)
  }

  acknowledgeIncident(id: string): Incident | undefined {
    const incident = this.incidents.get(id)
    if (incident && incident.status === 'open') {
      incident.status = 'acknowledged'
      incident.updatedAt = new Date().toISOString()
      this.notifyUpdate(incident)
    }
    return incident
  }

  resolveIncident(id: string): Incident | undefined {
    const incident = this.incidents.get(id)
    if (incident && (incident.status === 'open' || incident.status === 'acknowledged')) {
      incident.status = 'resolved'
      incident.updatedAt = new Date().toISOString()
      this.notifyUpdate(incident)
    }
    return incident
  }
}
