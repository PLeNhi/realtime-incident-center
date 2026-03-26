import { useIncidentStore, type SocketStatus } from '@/store';

export function Header() {
  const { socketStatus } = useIncidentStore();

  const getStatusConfig = (status: SocketStatus) => {
    const configs = {
      connected: {
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        label: 'Connected',
        sublabel: 'Receiving live updates',
      },
      reconnecting: {
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        label: 'Reconnecting',
        sublabel: 'Attempting to restore connection',
      },
      disconnected: {
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        label: 'Disconnected',
        sublabel: 'Waiting for connection',
      },
    };
    return configs[status];
  };

  const config = getStatusConfig(socketStatus);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              className="w-6 h-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(32, 32)">
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="1"
                  opacity="0.25"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="1.2"
                  opacity="0.4"
                />
                <circle cx="0" cy="0" r="6" fill="#fb923c" />
                <circle cx="0" cy="0" r="2.5" fill="white" />
              </g>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Realtime Incident Center
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Live monitoring for system incidents
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${config.color} ${socketStatus === 'connected' ? 'animate-pulse' : socketStatus === 'reconnecting' ? 'animate-bounce' : ''}`}
          />
          <div className="flex flex-col">
            <span className={`text-xs font-semibold ${config.textColor}`}>
              {config.label}
            </span>
            <span className={`text-xs ${config.textColor} opacity-75`}>
              {config.sublabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
