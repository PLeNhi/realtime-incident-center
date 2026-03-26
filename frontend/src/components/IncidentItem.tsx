import React from 'react'
import type { Incident } from '@/types'
import { getStatusColor, getStatusLabel, getSeverityLabel, getSeverityBadgeColor } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

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
  return (
    <div
      onClick={onClick}
      className={`p-4 border-l-4 cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 border-blue-400 shadow-md'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">
          {incident.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getSeverityBadgeColor(incident.severity)} bg-white`}>
          {getSeverityLabel(incident.severity)}
        </span>
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
            incident.status
          )}`}
        >
          {getStatusLabel(incident.status)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{incident.service}</span>
        <span>{formatDistanceToNow(new Date(incident.updatedAt), { addSuffix: true })}</span>
      </div>
    </div>
  )
}
