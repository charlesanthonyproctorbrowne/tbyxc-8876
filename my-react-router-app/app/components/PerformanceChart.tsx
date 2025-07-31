import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { OptimizationLocation } from "~/types/optimization";
import { formatNumber, formatCurrency } from "~/utils/dataUtils";

interface PerformanceChartProps {
  locations: OptimizationLocation[];
}

export function PerformanceChart({ locations }: PerformanceChartProps) {
  // Prepare data for population chart
  const populationData = locations.map(location => ({
    rank: `#${location.rank}`,
    population: location.metrics.populationCaptured,
    revenue: location.metrics.estimatedAnnualRevenue,
    coordinates: `${location.coordinates.latitude.toFixed(2)}, ${location.coordinates.longitude.toFixed(2)}`
  }));

  // Prepare data for competitor distance vs population scatter plot
  const scatterData = locations.map(location => ({
    competitorDistance: location.metrics.competitorDistance * 100, // Convert to km
    population: location.metrics.populationCaptured / 1000, // Convert to thousands
    rank: location.rank,
    score: location.metrics.optimizationScore
  }));

  // Color scheme for bars
  const getBarColor = (rank: number) => {
    if (rank === 1) return '#F59E0B'; // Amber
    if (rank === 2) return '#6B7280'; // Gray
    if (rank === 3) return '#D97706'; // Orange
    return '#3B82F6'; // Blue
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{`Location ${label}`}</p>
          <p className="text-blue-600">
            Population: {formatNumber(data.population)}
          </p>
          <p className="text-green-600">
            Est. Revenue: {formatCurrency(data.revenue)}
          </p>
          <p className="text-slate-600 text-sm">
            Coordinates: {data.coordinates}
          </p>
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{`Location #${data.rank}`}</p>
          <p className="text-blue-600">
            Population: {formatNumber(data.population * 1000)}
          </p>
          <p className="text-amber-600">
            Competitor Distance: {data.competitorDistance.toFixed(1)}km
          </p>
          <p className="text-purple-600">
            Score: {formatNumber(data.score)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Population Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Population Capture by Location
          </h3>
          <p className="text-sm text-slate-600">
            Total population served by each optimized branch location
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={populationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="rank"
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#94a3b8"
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#94a3b8"
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="population" radius={[4, 4, 0, 0]}>
              {populationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index + 1)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Competitor Distance vs Population Scatter Plot */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Competitive Positioning Analysis
          </h3>
          <p className="text-sm text-slate-600">
            Population served vs distance from nearest competitor
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="competitorDistance"
              name="Competitor Distance"
              unit="km"
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#94a3b8"
              label={{ value: 'Distance from Competitor (km)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="population"
              name="Population"
              unit="k"
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#94a3b8"
              tickFormatter={(value) => `${value}k`}
              label={{ value: 'Population (thousands)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter data={scatterData} fill="#3B82F6">
              {scatterData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.rank <= 3 ? getBarColor(entry.rank) : '#3B82F6'}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
