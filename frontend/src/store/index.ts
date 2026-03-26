import { create } from 'zustand';
import type {
  Incident,
  IncidentStatus,
  Severity,
  IncidentEvent,
} from '@/types';
import { orderBySeverity, orderByStatus } from '@/lib/time';

export type SocketStatus = 'connected' | 'reconnecting' | 'disconnected';
export type SortOption =
  | 'latest-updated'
  | 'newest-created'
  | 'severity'
  | 'status';

interface IncidentStore {
  incidents: Incident[];
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (incident: Incident) => void;
  getIncident: (id: string) => Incident | undefined;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Filtering
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  severityFilter: Severity | null;
  setSeverityFilter: (severity: Severity | null) => void;
  statusFilter: IncidentStatus | null;
  setStatusFilter: (status: IncidentStatus | null) => void;
  serviceFilter: string | null;
  setServiceFilter: (service: string | null) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  clearFilters: () => void;

  // Filtering helpers
  getFilteredIncidents: () => Incident[];
  getAvailableServices: () => string[];

  // UI state
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  highlightedIncidentIds: Set<string>;
  addHighlightedIncident: (id: string) => void;
  removeHighlightedIncident: (id: string) => void;

  // Events
  events: IncidentEvent[];
  addEvent: (event: IncidentEvent) => void;
  clearEvents: () => void;

  // Socket state
  socketStatus: SocketStatus;
  setSocketStatus: (status: SocketStatus) => void;
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
        inc.id === incident.id ? incident : inc,
      ),
    })),
  getIncident: (id) => get().incidents.find((inc) => inc.id === id),

  loading: true,
  setLoading: (loading) => set({ loading }),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  severityFilter: null,
  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  statusFilter: null,
  setStatusFilter: (status) => set({ statusFilter: status }),
  serviceFilter: null,
  setServiceFilter: (service) => set({ serviceFilter: service }),
  sortBy: 'latest-updated',
  setSortBy: (sort) => set({ sortBy: sort }),
  clearFilters: () =>
    set({
      searchTerm: '',
      severityFilter: null,
      statusFilter: null,
      serviceFilter: null,
    }),

  getFilteredIncidents: () => {
    const state = get();
    let filtered = [...state.incidents];

    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inc) =>
          inc.title.toLowerCase().includes(term) ||
          inc.description.toLowerCase().includes(term),
      );
    }

    if (state.severityFilter) {
      filtered = filtered.filter(
        (inc) => inc.severity === state.severityFilter,
      );
    }

    if (state.statusFilter) {
      filtered = filtered.filter((inc) => inc.status === state.statusFilter);
    }

    if (state.serviceFilter) {
      filtered = filtered.filter((inc) => inc.service === state.serviceFilter);
    }

    // Apply sorting
    if (state.sortBy === 'latest-updated') {
      filtered.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    } else if (state.sortBy === 'newest-created') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (state.sortBy === 'severity') {
      filtered.sort(
        (a, b) => orderBySeverity(a.severity) - orderBySeverity(b.severity),
      );
    } else if (state.sortBy === 'status') {
      filtered.sort(
        (a, b) => orderByStatus(a.status) - orderByStatus(b.status),
      );
    }

    return filtered;
  },

  getAvailableServices: () => {
    const services = new Set(get().incidents.map((inc) => inc.service));
    return Array.from(services).sort();
  },

  selectedIncidentId: null,
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

  highlightedIncidentIds: new Set(),
  addHighlightedIncident: (id) =>
    set((state) => ({
      highlightedIncidentIds: new Set([...state.highlightedIncidentIds, id]),
    })),
  removeHighlightedIncident: (id) =>
    set((state) => {
      const newSet = new Set(state.highlightedIncidentIds);
      newSet.delete(id);
      return { highlightedIncidentIds: newSet };
    }),

  events: [],
  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 15),
    })),
  clearEvents: () => set({ events: [] }),

  socketStatus: 'disconnected',
  setSocketStatus: (status) => set({ socketStatus: status }),
}));
