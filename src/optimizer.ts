import { PopulationArea, Competitor, ProposedLocation } from './types';

// Simple Euclidean distance calculation
function distance(lat1: number, long1: number, lat2: number, long2: number): number {
  const dlat = lat2 - lat1;
  const dlong = long2 - long1;
  return Math.sqrt(dlat * dlat + dlong * dlong);
}

// Find distance to nearest competitor
function nearestCompetitor(lat: number, long: number, competitors: Competitor[]): number {
  let min = Infinity;
  for (const comp of competitors) {
    const d = distance(lat, long, comp.lat, comp.long);
    if (d < min) {
      min = d;
      if (d < 0.001) break; // Early exit for performance
    }
  }
  return min === Infinity ? 1.0 : min;
}

// Initialize K centers using population density + K-means++
export function initializeCenters(k: number, populations: PopulationArea[], competitors: Competitor[]): ProposedLocation[] {
  const sorted = populations.sort((a, b) => b.population - a.population);
  const centers: ProposedLocation[] = [];

  // First center: highest population area away from competitors
  let firstCenter = sorted.find(pop => nearestCompetitor(pop.lat, pop.long, competitors) > 0.008);
  if (!firstCenter) firstCenter = sorted[0];

  centers.push({
    lat: firstCenter.lat,
    long: firstCenter.long,
    score: 0,
    populationCaptured: 0,
    nearestCompetitorDistance: nearestCompetitor(firstCenter.lat, firstCenter.long, competitors)
  });

  // Remaining centers using K-means++ with population weighting
  for (let i = 1; i < k; i++) {
    const distances = sorted.map(pop => {
      const minDist = Math.min(...centers.map(c => distance(pop.lat, pop.long, c.lat, c.long)));
      return minDist * minDist * pop.population; // Weight by distance² and population
    });

    const total = distances.reduce((sum, d) => sum + d, 0);
    if (total === 0) break;

    // Weighted random selection
    const random = Math.random() * total;
    let cumulative = 0;

    for (let j = 0; j < sorted.length; j++) {
      cumulative += distances[j];
      if (cumulative >= random) {
        const selected = sorted[j];
        centers.push({
          lat: selected.lat,
          long: selected.long,
          score: 0,
          populationCaptured: 0,
          nearestCompetitorDistance: nearestCompetitor(selected.lat, selected.long, competitors)
        });
        break;
      }
    }
  }

  return centers;
}

// Main K-means optimization with competitor avoidance
export function optimize(centers: ProposedLocation[], populations: PopulationArea[], competitors: Competitor[]): ProposedLocation[] {
  for (let iter = 0; iter < 30; iter++) {
    // Assign each population to nearest center
    const assignments = populations.map(pop => {
      let nearest = 0;
      let minDist = Infinity;
      centers.forEach((center, idx) => {
        const d = distance(pop.lat, pop.long, center.lat, center.long);
        if (d < minDist) {
          minDist = d;
          nearest = idx;
        }
      });
      return nearest;
    });

    // Update center positions
    const newCenters = centers.map((center, i) => {
      const assigned = populations.filter((_, idx) => assignments[idx] === i);
      if (assigned.length === 0) return center;

      // Calculate population-weighted centroid
      const totalPop = assigned.reduce((sum, pop) => sum + pop.population, 0);
      let newLat = assigned.reduce((sum, pop) => sum + pop.lat * pop.population, 0) / totalPop;
      let newLong = assigned.reduce((sum, pop) => sum + pop.long * pop.population, 0) / totalPop;

      // Competitor avoidance: if too close, search for better position
      const compDist = nearestCompetitor(newLat, newLong, competitors);
      if (compDist < 0.01) {
        for (let angle = 0; angle < 360; angle += 60) {
          const rad = (angle * Math.PI) / 180;
          const altLat = newLat + 0.015 * Math.cos(rad);
          const altLong = newLong + 0.015 * Math.sin(rad);
          if (nearestCompetitor(altLat, altLong, competitors) > compDist) {
            newLat = altLat;
            newLong = altLong;
            break;
          }
        }
      }

      const popCaptured = assigned.reduce((sum, pop) => sum + pop.population, 0);
      const finalCompDist = nearestCompetitor(newLat, newLong, competitors);

      return {
        lat: newLat,
        long: newLong,
        score: popCaptured * (1 + finalCompDist * 5), // Score = population + competitor bonus
        populationCaptured: popCaptured,
        nearestCompetitorDistance: finalCompDist
      };
    });

    // Check for convergence
    const maxMovement = Math.max(...centers.map((c, i) =>
      distance(c.lat, c.long, newCenters[i].lat, newCenters[i].long)
    ));

    centers = newCenters;

    if (iter % 5 === 0 || maxMovement < 0.001) {
      console.log(`Iteration ${iter + 1}: Max movement = ${maxMovement.toFixed(6)}`);
    }

    if (maxMovement < 0.001) {
      console.log(`Converged after ${iter + 1} iterations`);
      break;
    }
  }

  return centers.sort((a, b) => b.score - a.score);
}
