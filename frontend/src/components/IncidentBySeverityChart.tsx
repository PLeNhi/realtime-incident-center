import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SeverityData {
  severity: string
  count: number
  percentage: number
}

interface IncidentBySeverityChartProps {
  data: SeverityData[]
  isLoading?: boolean
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'Critical':
      return '#ef4444'
    case 'High':
      return '#f97316'
    case 'Medium':
      return '#eab308'
    case 'Low':
      return '#84cc16'
    default:
      return '#6b7280'
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs">
        <p className="font-semibold">{data.severity}</p>
        <p>Count: {data.count}</p>
        <p>{data.percentage}% of total</p>
      </div>
    )
  }
  return null
}

export function IncidentBySeverityChart({ data, isLoading = false }: IncidentBySeverityChartProps) {
  if (isLoading) {
    return (
      <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading chart...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Incidents by Severity</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="severity" 
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
          <Bar 
            dataKey="count" 
            radius={[6, 6, 0, 0]}
            fill="#fb923c"
          >
            {data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="count" fill={getSeverityColor(entry.severity)} radius={[6, 6, 0, 0]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-3 text-xs">
        {data.map((item) => (
          <div key={item.severity} className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getSeverityColor(item.severity) }}
            />
            <span className="text-gray-600">{item.severity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
