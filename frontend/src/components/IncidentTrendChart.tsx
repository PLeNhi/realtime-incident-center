import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataPoint {
  time: string;
  incidents: number;
  acknowledged: number;
  resolved: number;
}

interface IncidentTrendChartProps {
  data: TrendDataPoint[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs">
        <p className="font-semibold">{data.time}</p>
        <p className="text-orange-400">New: {data.incidents}</p>
        <p className="text-blue-400">Acked: {data.acknowledged}</p>
        <p className="text-green-400">Resolved: {data.resolved}</p>
      </div>
    );
  }
  return null;
};

export function IncidentTrendChart({
  data,
  isLoading = false,
}: IncidentTrendChartProps) {
  if (isLoading) {
    return (
      <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Incident Trend
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="incidents"
            stroke="#fb923c"
            dot={false}
            strokeWidth={2}
            name="New"
          />
          <Line
            type="monotone"
            dataKey="acknowledged"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name="Acknowledged"
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#10b981"
            dot={false}
            strokeWidth={2}
            name="Resolved"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
