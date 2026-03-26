import type { IncidentEvent } from '@/types'
import { formatRelativeTime, labelForEventType, emojiForEventType } from '@/lib/time'

interface TimelineProps {
  events: IncidentEvent[]
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No timeline events yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          {/* Timeline line and dot */}
          <div className="flex flex-col items-center">
            <div className="text-base flex-shrink-0">{emojiForEventType(event.type)}</div>
            {index < events.length - 1 && (
              <div className="w-0.5 h-8 bg-gray-200 my-1" />
            )}
          </div>

          {/* Event content */}
          <div className="flex-1 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                {labelForEventType(event.type)}
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(event.timestamp)}
              </p>
            </div>
            {event.description && (
              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
