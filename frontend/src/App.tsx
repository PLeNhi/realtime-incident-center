import { useEffect, useState } from 'react';
import { useIncidentStore } from '@/store';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { fetchIncidents } from '@/api';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/ToastContainer';
import { DashboardPage } from '@/pages/DashboardPage';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { CriticalBadge } from './components/CriticalBadge';

export function App() {
  const { setIncidents, setLoading } = useIncidentStore();

  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'incidents'>(
    'dashboard',
  );

  // Initialize socket connection
  useSocketConnection();

  // Load initial incidents
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const incidents = await fetchIncidents();
        setIncidents(incidents);
      } catch (err) {
        setError('Failed to load incidents');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, [setIncidents, setLoading]);

  // Force re-render every 30 seconds to update relative times
  const [, setTimeUpdate] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate((t) => t + 1);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-amber-50">
      <Header />

      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${
              currentPage === 'dashboard'
                ? 'text-orange-600 border-orange-500'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            📊 Dashboard
          </button>
          <div className='related '>
            <button
              onClick={() => setCurrentPage('incidents')}
              className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                currentPage === 'incidents'
                  ? 'text-orange-600 border-orange-500'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              🚨 Incidents
            </button>
            <CriticalBadge/>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'dashboard' ? <DashboardPage /> : <IncidentsPage />}
      </div>

      <ToastContainer />
    </div>
  );
}
