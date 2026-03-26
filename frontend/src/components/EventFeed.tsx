import { useIncidentStore } from '@/store'
import { formatDistanceToNow } from 'date-fns'

export function EventFeed() {
  const { events } = useIncidentStore()

  const getEventTypeIcon = (type: string): string => {
    switch (type) {
      case 'created':
        return '✨'
      case 'acknowledged':
        return '👀'
      case 'resolved':
        return '✅'
      default:
        return '📝'
    }
  }

  const getEventTypeLabel = (type: string): string => {
    switch (type) {
      case 'created':
        return 'Created'
      case 'acknowledged':
        return 'Acknowledged'
      case 'resolved':
        return 'Resolved'
      default:
        return 'Updated'
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Recent Events</h3>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No events yet</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 py-2 px-3 rounded hover:bg-gray-50 transition-colors"
            >
              <span className="text-base flex-shrink-0 mt-0.5">{getEventTypeIcon(event.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900">
                  {getEventTypeLabel(event.type)}
                </p>
                <p className="text-xs text-gray-600 truncate">{event.incidentTitle}</p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
