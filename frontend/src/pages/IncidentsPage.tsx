import { useState } from 'react';
import { useIncidentStore } from '@/store';
import { FilterBar } from '@/components/FilterBar';
import { IncidentItem } from '@/components/IncidentItem';
import { IncidentDetail } from '@/components/IncidentDetail';
import { showSuccessToast, showErrorToast } from '@/store/toasts';
import { acknowledgeIncident, resolveIncident } from '@/api';

export function IncidentsPage() {
  const {
    selectedIncidentId,
    setSelectedIncidentId,
    getFilteredIncidents,
    getIncident,
    updateIncident,
    loading,
  } = useIncidentStore();

  const [actionLoading, setActionLoading] = useState(false);

  const filteredIncidents = getFilteredIncidents();
  const selectedIncident = selectedIncidentId
    ? getIncident(selectedIncidentId)
    : null;

  const handleAcknowledge = async () => {
    if (!selectedIncident) return;

    const originalIncident = selectedIncident;
    const optimisticIncident = {
      ...selectedIncident,
      status: 'acknowledged' as const,
    };

    updateIncident(optimisticIncident);
    setActionLoading(true);

    try {
      const updated = await acknowledgeIncident(selectedIncident.id);
      updateIncident(updated);
      showSuccessToast('Incident acknowledged');
    } catch (err) {
      updateIncident(originalIncident);
      showErrorToast('Failed to acknowledge incident');
      console.error('Failed to acknowledge:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedIncident) return;

    const originalIncident = selectedIncident;
    const optimisticIncident = {
      ...selectedIncident,
      status: 'resolved' as const,
    };

    updateIncident(optimisticIncident);
    setActionLoading(true);

    try {
      const updated = await resolveIncident(selectedIncident.id);
      updateIncident(updated);
      showSuccessToast('Incident resolved');
    } catch (err) {
      updateIncident(originalIncident);
      showErrorToast('Failed to resolve incident');
      console.error('Failed to resolve:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
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
                        incident.id === selectedIncidentId ? null : incident.id,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
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
  );
}
