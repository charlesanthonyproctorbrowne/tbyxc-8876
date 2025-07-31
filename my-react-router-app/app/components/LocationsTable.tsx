import { MapPin, Users, Shield, Trophy, TrendingUp } from "lucide-react";
import { OptimizationLocation } from "~/types/optimization";
import { formatCurrency, formatNumber, formatDistance } from "~/utils/dataUtils";

interface LocationsTableProps {
  locations: OptimizationLocation[];
}

export function LocationsTable({ locations }: LocationsTableProps) {
  const getRankBadge = (rank: number) => {
    const colors = {
      1: "bg-yellow-100 text-yellow-800 border-yellow-300",
      2: "bg-slate-100 text-slate-800 border-slate-300",
      3: "bg-amber-100 text-amber-800 border-amber-300"
    };

    const defaultColor = "bg-blue-100 text-blue-800 border-blue-300";
    const colorClass = colors[rank as keyof typeof colors] || defaultColor;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${colorClass}`}>
        {rank <= 3 && <Trophy className="w-4 h-4 mr-1" />}
        #{rank}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      High: "bg-red-100 text-red-800 border-red-300",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Low: "bg-green-100 text-green-800 border-green-300"
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[priority as keyof typeof colors]}`}>
        {priority}
      </span>
    );
  };

  const getCompetitorBadge = (advantage: string) => {
    const colors = {
      Strong: "bg-green-100 text-green-800",
      Moderate: "bg-yellow-100 text-yellow-800",
      Weak: "bg-red-100 text-red-800"
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[advantage as keyof typeof colors]}`}>
        <Shield className="w-3 h-3 mr-1" />
        {advantage}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Optimized Branch Locations
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Strategic locations ranked by population capture and competitive positioning
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Population Served
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Annual Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Competitive Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {locations.map((location) => (
              <tr key={location.rank} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRankBadge(location.rank)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900 font-medium">
                    {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Lat: {location.coordinates.latitude.toFixed(6)} | Lng: {location.coordinates.longitude.toFixed(6)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {formatNumber(location.metrics.populationCaptured)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {location.metrics.populationCaptured.toLocaleString()} people
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrency(location.metrics.estimatedAnnualRevenue)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Annual estimate
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {getCompetitorBadge(location.businessInsights.competitiveAdvantage)}
                    <div className="text-xs text-slate-500">
                      {formatDistance(location.metrics.competitorDistance)} away
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge(location.businessInsights.priority)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {formatNumber(location.metrics.optimizationScore)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Optimization score
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
