import { useEffect } from 'react'
import { socket } from '@/api'
import { useIncidentStore } from '@/store'
import type { Incident, IncidentEvent } from '@/types'

export function useSocketConnection() {
  const { setIsConnected, addIncident, updateIncident, addEvent } =
    useIncidentStore()

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true)
      console.log('Socket connected')
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      console.log('Socket disconnected')
    }

    const handleIncidentCreated = (incident: Incident) => {
      addIncident(incident)
      addEvent({
        id: Math.random().toString(36).slice(2),
        type: 'created',
        incidentId: incident.id,
        incidentTitle: incident.title,
        timestamp: new Date().toISOString(),
      })
    }

    const handleIncidentUpdated = (incident: Incident) => {
      updateIncident(incident)

      // Determine event type based on status
      let eventType: 'acknowledged' | 'resolved' | 'updated' = 'updated'
      if (incident.status === 'acknowledged') {
        eventType = 'acknowledged'
      } else if (incident.status === 'resolved') {
        eventType = 'resolved'
      }

      addEvent({
        id: Math.random().toString(36).slice(2),
        type: eventType,
        incidentId: incident.id,
        incidentTitle: incident.title,
        timestamp: new Date().toISOString(),
      })
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('incident:created', handleIncidentCreated)
    socket.on('incident:updated', handleIncidentUpdated)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('incident:created', handleIncidentCreated)
      socket.off('incident:updated', handleIncidentUpdated)
    }
  }, [setIsConnected, addIncident, updateIncident, addEvent])

  return socket
}
