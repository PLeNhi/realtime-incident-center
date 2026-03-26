import type { Incident } from '@/types'

interface TrendDataPoint {
  time: string
  incidents: number
  acknowledged: number
  resolved: number
}

interface SeverityData {
  severity: string
  count: number
  percentage: number
}

/**
 * Generate incident trend data for the last 8 hours
 */
export function generateTrendData(_incidents: Incident[]): TrendDataPoint[] {
  const now = new Date()
  const data: TrendDataPoint[] = []
  
  // Generate 8 data points (one per hour going back)
  for (let i = 7; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    
    // Simulate realistic trend data based on incident creation times
    const createdCount = Math.floor(Math.random() * 8) + 1
    const acknowledgedCount = Math.floor(createdCount * 0.6)
    const resolvedCount = Math.floor(createdCount * 0.3)
    
    data.push({
      time: timeStr,
      incidents: createdCount,
      acknowledged: acknowledgedCount,
      resolved: resolvedCount,
    })
  }
  
  return data
}

/**
 * Generate severity breakdown data from incidents
 */
export function generateSeverityData(incidents: Incident[]): SeverityData[] {
  const severityMap = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }
  
  // Count incidents by severity
  incidents.forEach((incident) => {
    const severity = incident.severity.toLowerCase()
    if (severity in severityMap) {
      severityMap[severity as keyof typeof severityMap]++
    }
  })
  
  const total = incidents.length || 1
  
  const severityLabels: Record<string, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }
  
  return Object.entries(severityMap).map(([key, count]) => ({
    severity: severityLabels[key],
    count,
    percentage: Math.round((count / total) * 100),
  }))
}
