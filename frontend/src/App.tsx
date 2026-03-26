import React, { useEffect, useState } from 'react'
import { useIncidentStore } from '@/store'
import { useSocketConnection } from '@/hooks/useSocketConnection'
import { fetchIncidents, acknowledgeIncident, resolveIncident } from '@/api'
import { Header } from '@/components/Header'
import { StatsCards } from '@/components/StatsCards'
import { FilterBar } from '@/components/FilterBar'
import { IncidentItem } from '@/components/IncidentItem'
import { IncidentDetail } from '@/components/IncidentDetail'
import { EventFeed } from '@/components/EventFeed'

export function App() {
  const {
    setIncidents,
    selectedIncidentId,
    setSelectedIncidentId,
    getFilteredIncidents,
    getIncident,
    updateIncident,
  } = useIncidentStore()

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize socket connection
  useSocketConnection()

  // Load initial incidents
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const incidents = await fetchIncidents()
        setIncidents(incidents)
      } catch (err) {
        setError('Failed to load incidents')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadIncidents()
  }, [setIncidents])

  const filteredIncidents = getFilteredIncidents()
  const selectedIncident = selectedIncidentId
    ? getIncident(selectedIncidentId)
    : null

  const handleAcknowledge = async () => {
    if (!selectedIncident) return
    setActionLoading(true)
    try {
      const updated = await acknowledgeIncident(selectedIncident.id)
      updateIncident(updated)
    } catch (err) {
      console.error('Failed to acknowledge:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleResolve = async () => {
    if (!selectedIncident) return
    setActionLoading(true)
    try {
      const updated = await resolveIncident(selectedIncident.id)
      updateIncident(updated)
    } catch (err) {
      console.error('Failed to resolve:', err)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <StatsCards />

      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Incident List */}
        <div className="w-full lg:w-1/3 flex flex-col border-r border-gray-200 bg-gray-50">
          <FilterBar />

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Loading incidents...</p>
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No incidents found</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredIncidents.map((incident) => (
                  <IncidentItem
                    key={incident.id}
                    incident={incident}
                    isSelected={incident.id === selectedIncidentId}
                    onClick={() =>
                      setSelectedIncidentId(
                        incident.id === selectedIncidentId ? null : incident.id
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <EventFeed />
        </div>

        {/* Right: Incident Detail */}
        <div className="w-full lg:w-2/3 flex flex-col bg-white overflow-hidden">
          <IncidentDetail
            incident={selectedIncident}
            onAcknowledge={handleAcknowledge}
            onResolve={handleResolve}
            isLoading={actionLoading}
          />
        </div>
      </div>
    </div>
  )
}
