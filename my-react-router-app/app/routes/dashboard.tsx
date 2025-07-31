import { useLoaderData } from "react-router";
import { useState } from "react";

interface OptimizationLocation {
  rank: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  metrics: {
    populationCaptured: number;
    competitorDistance: number;
    optimizationScore: number;
    estimatedAnnualRevenue: number;
  };
  businessInsights: {
    marketPotential: "High" | "Medium" | "Low";
    competitiveAdvantage: "Strong" | "Moderate" | "Weak";
    priority: "High" | "Medium" | "Low";
  };
}

interface OptimizationResults {
  metadata: {
    timestamp: string;
    algorithm: string;
    totalCompetitors: number;
    totalPopulationAreas: number;
    optimizedLocations: number;
  };
  summary: {
    totalPopulationCaptured: number;
    averageCompetitorDistance: number;
    totalOptimizationScore: number;
    estimatedAnnualRevenue: number;
  };
  locations: OptimizationLocation[];
  algorithm: {
    samplingStrategy: string;
    optimizationMethod: string;
    scoringFormula: string;
    convergenceThreshold: number;
  };
}

export async function loader() {
  try {
    // Read the file directly from the filesystem
    const fs = await import('fs/promises');
    const path = await import('path');

    // Get the file path relative to the project root
    const filePath = path.join(process.cwd(), '..', 'optimization_results.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return { data, error: null };
  } catch (error) {
    console.error('Error loading optimization results:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to load data'
    };
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function formatDistance(distance: number): string {
  return `${(distance * 100).toFixed(1)}km`;
}

// Donut Chart Component
function DonutChart({ data, centerText, centerSubtext }: {
  data: Array<{ label: string; value: number; color: string }>;
  centerText: string;
  centerSubtext: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="8"
        />
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage * 2.51} ${251.2 - percentage * 2.51}`;
          const strokeDashoffset = -cumulativePercentage * 2.51;
          cumulativePercentage += percentage;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={item.color}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">{centerText}</div>
        <div className="text-sm text-gray-600">{centerSubtext}</div>
      </div>
    </div>
  );
}

// Performance Chart Component (simplified area chart)
function PerformanceChart() {
  const data = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 25 },
    { month: 'Apr', value: 45 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 40 },
  ];

  return (
    <div className="h-64 flex items-end space-x-2 px-4">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg transition-all duration-300 hover:from-green-500 hover:to-green-400"
            style={{ height: `${item.value}%` }}
          />
          <span className="text-xs text-gray-600 mt-2">{item.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data, error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Optimization Results</h2>
          <p className="text-gray-600">Processing location data and generating insights...</p>
        </div>
      </div>
    );
  }

  const results = data as OptimizationResults;
  const lastUpdated = new Date(results.metadata.timestamp);

  // Prepare chart data
  const stateData = [
    { label: 'London', value: 18.6, color: '#ef4444' },
    { label: 'Manchester', value: 3.9, color: '#f97316' },
    { label: 'Birmingham', value: 3.2, color: '#22c55e' },
    { label: 'Others', value: 0, color: '#94a3b8' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {lastUpdated.toLocaleDateString('en-GB', {
                  month: 'short',
                  day: 'numeric'
                })} - {lastUpdated.toLocaleDateString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {formatNumber(results.summary.totalPopulationCaptured)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-green-600 font-medium">£{(results.summary.estimatedAnnualRevenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="text-sm text-gray-500">Population Served</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{results.metadata.optimizedLocations}</div>
                <div className="text-sm text-gray-600">
                  <span className="text-green-600 font-medium">£{(results.summary.estimatedAnnualRevenue / results.metadata.optimizedLocations / 1000000).toFixed(1)}M</span>
                </div>
                <div className="text-sm text-gray-500">New Locations</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Locations by State Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Locations by Region</h3>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">⋯</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <DonutChart
                  data={stateData}
                  centerText="£25.5M"
                  centerSubtext="Total Amount"
                />

                <div className="space-y-4">
                  {stateData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between min-w-[200px]">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        £{item.value}M
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Location Preview</h3>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">⋯</button>
                </div>
              </div>

              <div className="relative h-64 bg-gradient-to-br from-green-100 via-yellow-100 to-orange-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-black text-white px-4 py-2 rounded-lg">
                    <div className="text-lg font-bold text-green-400">£3.2M</div>
                    <div className="text-sm">Top Location</div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>&lt;60%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>&lt;40%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>&lt;20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                <button className="p-2 hover:bg-gray-100 rounded">⋯</button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(results.metadata.totalPopulationAreas)}
                  </div>
                  <div className="text-sm text-gray-600">Areas Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">67%</div>
                  <div className="text-sm text-gray-600">Coverage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24%</div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                </div>
              </div>

              <div className="relative h-32 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-8 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 opacity-60"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-medium">
                  <span>8%</span>
                  <span>32%</span>
                  <span>60%</span>
                </div>
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
                  <span>4%</span>
                  <span>21%</span>
                  <span>12%</span>
                </div>
              </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Development
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Investment
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Build and Hold
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="bg-black text-white px-3 py-1 rounded-lg text-sm font-medium">
                    37 +1.2%
                  </div>
                </div>
                <PerformanceChart />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Optimized Locations</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export Data
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Population
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.locations.slice(0, 8).map((location) => (
                    <tr key={location.rank} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          location.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                          location.rank === 2 ? "bg-gray-100 text-gray-800" :
                          location.rank === 3 ? "bg-orange-100 text-orange-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          #{location.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatNumber(location.metrics.populationCaptured)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(location.metrics.estimatedAnnualRevenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          location.businessInsights.priority === "High" ? "bg-red-100 text-red-800" :
                          location.businessInsights.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {location.businessInsights.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Optimized
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
