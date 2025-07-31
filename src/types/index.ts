// Core data types for location optimization

export interface PopulationArea {
  oa_id: string;
  population: number;
  lat: number;
  long: number;
}

export interface Competitor {
  lat: number;
  long: number;
}

export interface ProposedLocation {
  lat: number;
  long: number;
  score: number;
  populationCaptured: number;
  nearestCompetitorDistance: number;
}
