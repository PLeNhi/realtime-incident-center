import { useEffect } from 'react'
import { socket } from '@/api'
import { useIncidentStore } from '@/store'
import { showInfoToast, showSuccessToast, showErrorToast } from '@/store/toasts'
import type { Incident, IncidentEvent } from '@/types'

export function useSocketConnection() {
  const { setSocketStatus, addIncident, updateIncident, addEvent, addHighlightedIncident, removeHighlightedIncident } =
    useIncidentStore()

  useEffect(() => {
    const handleConnect = () => {
      setSocketStatus('connected')
      showSuccessToast('Connection restored')
      console.log('Socket connected')
    }

    const handleDisconnect = () => {
      setSocketStatus('disconnected')
      showErrorToast('Connection lost. Attempting to reconnect...')
      console.log('Socket disconnected')
    }

    const handleReconnecting = () => {
      setSocketStatus('reconnecting')
      console.log('Socket reconnecting')
    }

    const handleIncidentCreated = (incident: Incident) => {
      addIncident(incident)
      
      // Highlight new incident for visual feedback
      addHighlightedIncident(incident.id)
      setTimeout(() => removeHighlightedIncident(incident.id), 3000)

      addEvent({
        id: Math.random().toString(36).slice(2),
        type: 'created',
        incidentId: incident.id,
        incidentTitle: incident.title,
        timestamp: new Date().toISOString(),
        description: `Severity: ${incident.severity}`,
      })

      showInfoToast(`New incident: ${incident.title}`)
    }

    const handleIncidentUpdated = (incident: Incident) => {
      updateIncident(incident)

      // Determine event type based on status
      let eventType: 'acknowledged' | 'resolved' | 'updated' = 'updated'
      let description = ''
      if (incident.status === 'acknowledged') {
        eventType = 'acknowledged'
        description = 'Acknowledged by system'
      } else if (incident.status === 'resolved') {
        eventType = 'resolved'
        description = 'Resolved'
      }

      addEvent({
        id: Math.random().toString(36).slice(2),
        type: eventType,
        incidentId: incident.id,
        incidentTitle: incident.title,
        timestamp: new Date().toISOString(),
        description,
      })
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleReconnecting)
    socket.on('incident:created', handleIncidentCreated)
    socket.on('incident:updated', handleIncidentUpdated)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleReconnecting)
      socket.off('incident:created', handleIncidentCreated)
      socket.off('incident:updated', handleIncidentUpdated)
    }
  }, [setSocketStatus, addIncident, updateIncident, addEvent, addHighlightedIncident, removeHighlightedIncident])

  return socket
}
