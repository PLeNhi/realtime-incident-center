import type { Severity, IncidentStatus, Incident } from '@/types'

export function getSeverityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300',
  }
  return colors[severity]
}

export function getSeverityBadgeColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: 'text-red-600',
    high: 'text-orange-600',
    medium: 'text-yellow-600',
    low: 'text-green-600',
  }
  return colors[severity]
}

export function getStatusColor(status: IncidentStatus): string {
  const colors: Record<IncidentStatus, string> = {
    open: 'bg-red-100 text-red-800 border-red-300',
    acknowledged: 'bg-blue-100 text-blue-800 border-blue-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
  }
  return colors[status]
}

export function getStatusLabel(status: IncidentStatus): string {
  const labels: Record<IncidentStatus, string> = {
    open: 'Open',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
  }
  return labels[status]
}

export function getSeverityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }
  return labels[severity]
}

export function getCountByStatus(
  incidents: Incident[],
  status: IncidentStatus
): number {
  return incidents.filter((inc) => inc.status === status).length
}

export function getCountBySeverity(
  incidents: Incident[],
  severity: Severity
): number {
  return incidents.filter((inc) => inc.severity === severity).length
}
