import { create } from 'zustand'
import type { Incident, IncidentStatus, Severity, IncidentEvent } from '@/types'

interface IncidentStore {
  incidents: Incident[]
  setIncidents: (incidents: Incident[]) => void
  addIncident: (incident: Incident) => void
  updateIncident: (incident: Incident) => void
  getIncident: (id: string) => Incident | undefined
  
  // Filtering
  searchTerm: string
  setSearchTerm: (term: string) => void
  severityFilter: Severity | null
  setSeverityFilter: (severity: Severity | null) => void
  statusFilter: IncidentStatus | null
  setStatusFilter: (status: IncidentStatus | null) => void
  serviceFilter: string | null
  setServiceFilter: (service: string | null) => void
  sortBy: 'latest' | 'oldest'
  setSortBy: (sort: 'latest' | 'oldest') => void
  
  // Filtering helpers
  getFilteredIncidents: () => Incident[]
  getAvailableServices: () => string[]
  
  // UI state
  selectedIncidentId: string | null
  setSelectedIncidentId: (id: string | null) => void
  
  // Events
  events: IncidentEvent[]
  addEvent: (event: IncidentEvent) => void
  clearEvents: () => void
  
  // Socket state
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents],
    })),
  updateIncident: (incident) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === incident.id ? incident : inc
      ),
    })),
  getIncident: (id) => get().incidents.find((inc) => inc.id === id),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  severityFilter: null,
  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  statusFilter: null,
  setStatusFilter: (status) => set({ statusFilter: status }),
  serviceFilter: null,
  setServiceFilter: (service) => set({ serviceFilter: service }),
  sortBy: 'latest',
  setSortBy: (sort) => set({ sortBy: sort }),

  getFilteredIncidents: () => {
    const state = get()
    let filtered = [...state.incidents]

    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (inc) =>
          inc.title.toLowerCase().includes(term) ||
          inc.description.toLowerCase().includes(term)
      )
    }

    if (state.severityFilter) {
      filtered = filtered.filter((inc) => inc.severity === state.severityFilter)
    }

    if (state.statusFilter) {
      filtered = filtered.filter((inc) => inc.status === state.statusFilter)
    }

    if (state.serviceFilter) {
      filtered = filtered.filter((inc) => inc.service === state.serviceFilter)
    }

    if (state.sortBy === 'latest') {
      filtered.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    } else {
      filtered.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      )
    }

    return filtered
  },

  getAvailableServices: () => {
    const services = new Set(get().incidents.map((inc) => inc.service))
    return Array.from(services).sort()
  },

  selectedIncidentId: null,
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

  events: [],
  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 15),
    })),
  clearEvents: () => set({ events: [] }),

  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
}))
