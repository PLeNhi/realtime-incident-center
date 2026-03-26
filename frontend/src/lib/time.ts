import { formatDistanceToNow, format } from 'date-fns'
import type { Severity, IncidentStatus } from '@/types'

/**
 * Format a date as relative time (e.g., "2m ago", "just now")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Get friendly relative time label (e.g., "2m", "1h", "just now")
 * Used for compact display
 */
export function formatCompactRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return format(dateObj, 'MMM d')
}

/**
 * Get absolute date/time for display in detail panels
 */
export function formatAbsoluteDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MMM d, yyyy HH:mm:ss')
}

/**
 * Sort incidents by severity (high to low)
 */
export function orderBySeverity(severityLevel: Severity): number {
  const order: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  }
  return order[severityLevel]
}

/**
 * Sort incidents by status (open, acknowledged, resolved)
 */
export function orderByStatus(status: IncidentStatus): number {
  const order: Record<IncidentStatus, number> = {
    open: 0,
    acknowledged: 1,
    resolved: 2,
  }
  return order[status]
}

/**
 * Generate human-readable event label
 */
export function labelForEventType(type: string): string {
  const labels: Record<string, string> = {
    created: 'Created',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
    updated: 'Updated',
    'severity-updated': 'Severity Updated',
    'status-changed': 'Status Changed',
  }
  return labels[type] || type
}

/**
 * Get emoji for event type
 */
export function emojiForEventType(type: string): string {
  const emojis: Record<string, string> = {
    created: '✨',
    acknowledged: '👀',
    resolved: '✅',
    updated: '📝',
    'severity-updated': '⚠️',
    'status-changed': '🔄',
  }
  return emojis[type] || '📌'
}
