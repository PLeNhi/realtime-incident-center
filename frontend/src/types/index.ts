export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'acknowledged' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  description: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  owner?: string;
  metric?: string;
}

export interface IncidentEvent {
  id: string;
  type: 'created' | 'acknowledged' | 'resolved' | 'updated';
  incidentId: string;
  incidentTitle: string;
  timestamp: string;
  description: string;
}
