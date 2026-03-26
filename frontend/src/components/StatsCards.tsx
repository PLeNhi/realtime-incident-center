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
    <div className="px-6 py-6 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Total Incidents</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Open</p>
          <p className="text-3xl font-bold text-red-600">{stats.open}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Acknowledged</p>
          <p className="text-3xl font-bold text-amber-600">{stats.acknowledged}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Critical</p>
          <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
        </div>
      </div>
    </div>
  )
}
