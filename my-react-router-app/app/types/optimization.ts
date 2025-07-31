export interface OptimizationLocation {
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

export interface OptimizationResults {
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
