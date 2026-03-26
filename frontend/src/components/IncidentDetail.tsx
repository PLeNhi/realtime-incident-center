import React from 'react'
import type { Incident } from '@/types'
import { getStatusColor, getStatusLabel, getSeverityLabel, getSeverityBadgeColor } from '@/lib/utils'
import { formatDistanceToNow, format } from 'date-fns'

interface IncidentDetailProps {
  incident: Incident | null
  onAcknowledge?: () => void
  onResolve?: () => void
  isLoading?: boolean
}

export function IncidentDetail({
  incident,
  onAcknowledge,
  onResolve,
  isLoading = false,
}: IncidentDetailProps) {
  if (!incident) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Select an incident to view details</p>
        </div>
      </div>
    )
  }

  const canAcknowledge = incident.status === 'open'
  const canResolve = incident.status === 'open' || incident.status === 'acknowledged'

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {incident.title}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded border ${getSeverityBadgeColor(incident.severity)}`}>
            {getSeverityLabel(incident.severity)}
          </span>
          <span
            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded border ${getStatusColor(
              incident.status
            )}`}
          >
            {getStatusLabel(incident.status)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Description</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{incident.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Service</p>
            <p className="text-sm font-medium text-gray-900">{incident.service}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Severity</p>
            <p className="text-sm font-medium text-gray-900">
              {getSeverityLabel(incident.severity)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Status</p>
            <p className="text-sm font-medium text-gray-900">
              {getStatusLabel(incident.status)}
            </p>
          </div>
          {incident.owner && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Owner</p>
              <p className="text-sm font-medium text-gray-900">{incident.owner}</p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Created</p>
            <p className="text-xs text-gray-700">
              {format(new Date(incident.createdAt), 'MMM d, yyyy HH:mm:ss')}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Updated</p>
            <p className="text-xs text-gray-700">
              {formatDistanceToNow(new Date(incident.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {/* Metric */}
        {incident.metric && (
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Affected Component</p>
            <p className="text-sm font-medium text-gray-900">{incident.metric}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-6 bg-white flex gap-3">
        <button
          onClick={onAcknowledge}
          disabled={!canAcknowledge || isLoading}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            canAcknowledge
              ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Loading...' : 'Acknowledge'}
        </button>
        <button
          onClick={onResolve}
          disabled={!canResolve || isLoading}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            canResolve
              ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Loading...' : 'Resolve'}
        </button>
      </div>
    </div>
  )
}
