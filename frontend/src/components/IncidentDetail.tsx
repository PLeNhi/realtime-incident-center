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
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select an incident to view details</p>
      </div>
    )
  }

  const canAcknowledge = incident.status === 'open'
  const canResolve = incident.status === 'open' || incident.status === 'acknowledged'

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {incident.title}
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded border ${getSeverityBadgeColor(incident.severity)} bg-white`}>
            {getSeverityLabel(incident.severity)}
          </span>
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded border ${getStatusColor(
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
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">{incident.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Service</p>
            <p className="font-medium text-gray-900">{incident.service}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Severity</p>
            <p className="font-medium text-gray-900">
              {getSeverityLabel(incident.severity)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="font-medium text-gray-900">
              {getStatusLabel(incident.status)}
            </p>
          </div>
          {incident.owner && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Owner</p>
              <p className="font-medium text-gray-900">{incident.owner}</p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Created</p>
              <p className="text-sm text-gray-900">
                {format(new Date(incident.createdAt), 'MMM d, yyyy HH:mm:ss')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Updated</p>
              <p className="text-sm text-gray-900">
                {formatDistanceToNow(new Date(incident.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Metric */}
        {incident.metric && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Affected Component</p>
            <p className="font-medium text-gray-900">{incident.metric}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3">
        <button
          onClick={onAcknowledge}
          disabled={!canAcknowledge || isLoading}
          className={`flex-1 px-4 py-2 rounded font-medium transition ${
            canAcknowledge
              ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Loading...' : 'Acknowledge'}
        </button>
        <button
          onClick={onResolve}
          disabled={!canResolve || isLoading}
          className={`flex-1 px-4 py-2 rounded font-medium transition ${
            canResolve
              ? 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Loading...' : 'Resolve'}
        </button>
      </div>
    </div>
  )
}
