import React, { useMemo } from 'react'
import { useIncidentStore } from '@/store'
import { getCountByStatus, getCountBySeverity } from '@/lib/utils'

export function StatsCards() {
  const { incidents } = useIncidentStore()

  const stats = useMemo(() => {
    return {
      total: incidents.length,
      open: getCountByStatus(incidents, 'open'),
      acknowledged: getCountByStatus(incidents, 'acknowledged'),
      resolved: getCountByStatus(incidents, 'resolved'),
      critical: getCountBySeverity(incidents, 'critical'),
    }
  }, [incidents])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-6 py-6 bg-gray-50">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Open</p>
        <p className="text-3xl font-bold text-red-600">{stats.open}</p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Acknowledged</p>
        <p className="text-3xl font-bold text-blue-600">{stats.acknowledged}</p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Resolved</p>
        <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Critical</p>
        <p className="text-3xl font-bold text-severity-critical">{stats.critical}</p>
      </div>
    </div>
  )
}
