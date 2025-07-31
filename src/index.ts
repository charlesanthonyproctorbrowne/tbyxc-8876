import { promises as fs } from 'fs';
import { loadCompetitors, loadPopulation } from './dataLoader';
import { initializeCenters, optimize } from './optimizer';

async function main() {
  try {
    console.log('=== LOCATION OPTIMIZATION ===');

    // Load data efficiently
    const [competitors, populations] = await Promise.all([
      loadCompetitors(),
      loadPopulation()
    ]);

    console.log(`Loaded ${competitors.length} competitors, ${populations.length} population areas`);

    // Run optimization
    const initialCenters = initializeCenters(10, populations, competitors);
    const locations = optimize(initialCenters, populations, competitors);

    // Display results
    console.log('\n=== OPTIMIZED LOCATIONS ===');
    locations.forEach((loc, i) => {
      console.log(`\nLocation ${i + 1}:`);
      console.log(`  Coordinates: ${loc.lat.toFixed(6)}, ${loc.long.toFixed(6)}`);
      console.log(`  Population: ${loc.populationCaptured.toLocaleString()}`);
      console.log(`  Competitor Distance: ${loc.nearestCompetitorDistance.toFixed(4)}`);
      console.log(`  Score: ${loc.score.toFixed(0)}`);
    });

    // Calculate summary metrics
    const totalCaptured = locations.reduce((sum, loc) => sum + loc.populationCaptured, 0);
    const avgCompetitorDistance = locations.reduce((sum, loc) => sum + loc.nearestCompetitorDistance, 0) / locations.length;
    const totalScore = locations.reduce((sum, loc) => sum + loc.score, 0);

    // Create comprehensive JSON output
    const results = {
      metadata: {
        timestamp: new Date().toISOString(),
        algorithm: "K-means with competitor avoidance",
        totalCompetitors: competitors.length,
        totalPopulationAreas: populations.length,
        optimizedLocations: locations.length
      },
      summary: {
        totalPopulationCaptured: totalCaptured,
        averageCompetitorDistance: parseFloat(avgCompetitorDistance.toFixed(6)),
        totalOptimizationScore: parseFloat(totalScore.toFixed(0)),
        estimatedAnnualRevenue: totalCaptured * 50 // £50 per person estimate
      },
      locations: locations.map((loc, i) => ({
        rank: i + 1,
        coordinates: {
          latitude: parseFloat(loc.lat.toFixed(6)),
          longitude: parseFloat(loc.long.toFixed(6))
        },
        metrics: {
          populationCaptured: loc.populationCaptured,
          competitorDistance: parseFloat(loc.nearestCompetitorDistance.toFixed(6)),
          optimizationScore: parseFloat(loc.score.toFixed(0)),
          estimatedAnnualRevenue: loc.populationCaptured * 50
        },
        businessInsights: {
          marketPotential: loc.populationCaptured > 1000000 ? "High" : loc.populationCaptured > 500000 ? "Medium" : "Low",
          competitiveAdvantage: loc.nearestCompetitorDistance > 0.05 ? "Strong" : loc.nearestCompetitorDistance > 0.02 ? "Moderate" : "Weak",
          priority: i < 3 ? "High" : i < 7 ? "Medium" : "Low"
        }
      })),
      algorithm: {
        samplingStrategy: "All high-population (400+) areas + 5% random sample of regular areas",
        optimizationMethod: "Population-weighted K-means with competitor avoidance",
        scoringFormula: "Population × (1 + CompetitorDistance × 5)",
        convergenceThreshold: 0.001
      }
    };

    // Save JSON output
    await fs.writeFile('./my-react-router-app/public/optimization_results.json', JSON.stringify(results, null, 2));
    console.log('\nResults saved to optimization_results.json');

    console.log('\n=== SUMMARY ===');
    console.log(`Total Population: ${totalCaptured.toLocaleString()}`);
    console.log(`Average Competitor Distance: ${avgCompetitorDistance.toFixed(4)}`);
    console.log(`Total Score: ${totalScore.toFixed(0)}`);
    console.log(`Estimated Annual Revenue: £${(totalCaptured * 50).toLocaleString()}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  main();
}
