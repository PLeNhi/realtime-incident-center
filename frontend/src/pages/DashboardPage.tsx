import { StatsCards } from '@/components/StatsCards';
import { IncidentTrendChart } from '@/components/IncidentTrendChart';
import { IncidentBySeverityChart } from '@/components/IncidentBySeverityChart';
import { generateTrendData, generateSeverityData } from '@/lib/charts';
import { useIncidentStore } from '@/store';

export function DashboardPage() {
  const { incidents } = useIncidentStore();

  return (
    <div className="flex flex-col h-full bg-amber-50 overflow-y-auto">
      <StatsCards />

      {/* Charts Section */}
      {incidents.length > 0 && (
        <div className="px-6 py-6 border-b border-gray-200 bg-amber-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <IncidentTrendChart data={generateTrendData(incidents)} />
            <IncidentBySeverityChart data={generateSeverityData(incidents)} />
          </div>
        </div>
      )}

      {/* Summary Stats in bottom section */}
      {incidents.length > 0 && (
        <div className="px-6 py-6 bg-white border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-amber-50">
              <p className="text-xs text-gray-600 mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">~5m</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50">
              <p className="text-xs text-gray-600 mb-1">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-600">87%</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50">
              <p className="text-xs text-gray-600 mb-1">P1 Incidents</p>
              <p className="text-2xl font-bold text-red-600">
                {incidents.filter((i) => i.severity === 'critical').length}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50">
              <p className="text-xs text-gray-600 mb-1">Uptime</p>
              <p className="text-2xl font-bold text-green-600">99.9%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
