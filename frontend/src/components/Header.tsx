import { useIncidentStore } from '@/store'

export function Header() {
  const { isConnected } = useIncidentStore()

  const statusColor = isConnected
    ? 'bg-green-500'
    : 'bg-red-500'
  const statusBgColor = isConnected
    ? 'bg-green-50'
    : 'bg-red-50'
  const statusTextColor = isConnected
    ? 'text-green-700'
    : 'text-red-700'
  const statusBorderColor = isConnected
    ? 'border-green-200'
    : 'border-red-200'
  const statusText = isConnected ? 'Connected' : 'Disconnected'

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Realtime Incident Center
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Live monitoring for system incidents
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusBgColor} ${statusBorderColor}`}>
          <div className={`w-2 h-2 rounded-full ${statusColor} ${isConnected ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-semibold ${statusTextColor}`}>{statusText}</span>
        </div>
      </div>
    </header>
  )
}
