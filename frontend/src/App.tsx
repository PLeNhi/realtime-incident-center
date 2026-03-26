import { useEffect, useState } from 'react'
import { useIncidentStore } from '@/store'
import { useSocketConnection } from '@/hooks/useSocketConnection'
import { fetchIncidents, acknowledgeIncident, resolveIncident } from '@/api'
import { Header } from '@/components/Header'
import { StatsCards } from '@/components/StatsCards'
import { FilterBar } from '@/components/FilterBar'
import { IncidentItem } from '@/components/IncidentItem'
import { IncidentDetail } from '@/components/IncidentDetail'
import { ToastContainer } from '@/components/ToastContainer'
import { IncidentTrendChart } from '@/components/IncidentTrendChart'
import { IncidentBySeverityChart } from '@/components/IncidentBySeverityChart'
import { showSuccessToast, showErrorToast } from '@/store/toasts'
import { generateTrendData, generateSeverityData } from '@/lib/charts'
// import { EventFeed } from '@/components/EventFeed'

export function App() {
  const {
    setIncidents,
    selectedIncidentId,
    setSelectedIncidentId,
    getFilteredIncidents,
    getIncident,
    updateIncident,
    incidents,
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

  // Force re-render every 30 seconds to update relative times
  const [, setTimeUpdate] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(t => t + 1)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredIncidents = getFilteredIncidents()
  const selectedIncident = selectedIncidentId
    ? getIncident(selectedIncidentId)
    : null

  const handleAcknowledge = async () => {
    if (!selectedIncident) return

    const originalIncident = selectedIncident
    const optimisticIncident = { ...selectedIncident, status: 'acknowledged' as const }

    // Optimistically update UI
    updateIncident(optimisticIncident)
    setActionLoading(true)

    try {
      const updated = await acknowledgeIncident(selectedIncident.id)
      updateIncident(updated)
      showSuccessToast('Incident acknowledged')
    } catch (err) {
      // Rollback on error
      updateIncident(originalIncident)
      showErrorToast('Failed to acknowledge incident')
      console.error('Failed to acknowledge:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleResolve = async () => {
    if (!selectedIncident) return

    const originalIncident = selectedIncident
    const optimisticIncident = { ...selectedIncident, status: 'resolved' as const }

    // Optimistically update UI
    updateIncident(optimisticIncident)
    setActionLoading(true)

    try {
      const updated = await resolveIncident(selectedIncident.id)
      updateIncident(updated)
      showSuccessToast('Incident resolved')
    } catch (err) {
      // Rollback on error
      updateIncident(originalIncident)
      showErrorToast('Failed to resolve incident')
      console.error('Failed to resolve:', err)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-amber-50">
      <Header />

      <StatsCards />

      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Charts Section */}
      {!loading && incidents.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 bg-amber-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <IncidentTrendChart data={generateTrendData(incidents)} />
            <IncidentBySeverityChart data={generateSeverityData(incidents)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Incident List */}
        <div className="w-full lg:w-1/3 flex flex-col border-r border-gray-200 bg-white">
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

          {/* <EventFeed /> */}
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

      <ToastContainer />
    </div>
  )
}
