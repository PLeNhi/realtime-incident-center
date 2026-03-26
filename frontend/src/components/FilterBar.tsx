import { useIncidentStore, type SortOption } from '@/store';
import type { Severity, IncidentStatus } from '@/types';

export function FilterBar() {
  const {
    searchTerm,
    setSearchTerm,
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    sortBy,
    setSortBy,
    clearFilters,
    getAvailableServices,
    incidents,
  } = useIncidentStore();

  const services = getAvailableServices();
  const hasActiveFilters =
    searchTerm || severityFilter || statusFilter || serviceFilter;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 transition-all hover:border-gray-300"
        />

        {/* Severity Filter */}
        <select
          value={severityFilter || ''}
          onChange={(e) =>
            setSeverityFilter((e.target.value as Severity) || null)
          }
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 transition-all hover:border-gray-300 bg-white"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter || ''}
          onChange={(e) =>
            setStatusFilter((e.target.value as IncidentStatus) || null)
          }
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 transition-all hover:border-gray-300 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Service Filter */}
        {services.length > 0 && (
          <select
            value={serviceFilter || ''}
            onChange={(e) => setServiceFilter(e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 transition-all hover:border-gray-300 bg-white"
          >
            <option value="">All Services</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        )}

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 transition-all hover:border-gray-300 bg-white"
        >
          <option value="latest-updated">Latest Updated</option>
          <option value="newest-created">Newest Created</option>
          <option value="severity">Severity</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-200">
          <span className="text-xs font-semibold">Active filters:</span>
          <button
            onClick={() => clearFilters()}
            className="text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {incidents.length === 0 && (
        <div className="text-sm text-gray-500">No incidents found</div>
      )}
    </div>
  );
}
