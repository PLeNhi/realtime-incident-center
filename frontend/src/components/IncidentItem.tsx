import React from 'react'
import type { Incident } from '@/types'
import { getStatusColor, getStatusLabel, getSeverityLabel, getSeverityBadgeColor } from '@/lib/utils'
import { formatCompactRelativeTime } from '@/lib/time'
import { useIncidentStore } from '@/store'

interface IncidentItemProps {
  incident: Incident
  isSelected: boolean
  onClick: () => void
}

export function IncidentItem({
  incident,
  isSelected,
  onClick,
}: IncidentItemProps) {
  const { highlightedIncidentIds } = useIncidentStore()
  const isHighlighted = highlightedIncidentIds.has(incident.id)

  return (
    <div
      onClick={onClick}
      className={`p-3 cursor-pointer transition-all rounded-lg ${
        isSelected
          ? 'bg-orange-50 border-l-4 border-orange-500'
          : isHighlighted
            ? 'bg-orange-50 border border-orange-200 animate-pulse'
            : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2 text-sm">
          {incident.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getSeverityBadgeColor(incident.severity)}`}>
          {getSeverityLabel(incident.severity)}
        </span>
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(
            incident.status
          )}`}
        >
          {getStatusLabel(incident.status)}
        </span>
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-50 text-gray-700 border border-gray-200">
          {incident.service}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium">{formatCompactRelativeTime(incident.updatedAt)}</span>
      </div>
    </div>
  )
}
