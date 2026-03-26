import React from 'react'
import { Circle } from 'lucide-react'
import { useIncidentStore } from '@/store'

export function Header() {
  const { isConnected } = useIncidentStore()

  const statusColor = isConnected
    ? 'bg-green-500'
    : 'bg-red-500'
  const statusText = isConnected ? 'Connected' : 'Disconnected'

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Realtime Incident Center
          </h1>
          <p className="text-gray-600 mt-1">
            Live monitoring for system incidents
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
          <span className="text-sm font-medium text-gray-700">{statusText}</span>
        </div>
      </div>
    </header>
  )
}
