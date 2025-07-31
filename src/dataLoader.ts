import { promises as fs } from 'fs';
import { PopulationArea, Competitor } from './types';

export async function loadCompetitors(): Promise<Competitor[]> {
  const data = await fs.readFile('week1.csv', 'utf-8');
  return data.trim().split('\n').slice(1).map(line => {
    const [, lat, long] = line.split(',');
    return { lat: parseFloat(lat), long: parseFloat(long) };
  });
}

export async function loadPopulation(): Promise<PopulationArea[]> {
  const data = await fs.readFile('population.csv', 'utf-8');
  const lines = data.trim().split('\n').slice(1);

  console.log(`Processing ${lines.length} population areas...`);

  const highPop: PopulationArea[] = [];
  const regular: PopulationArea[] = [];

  // Process in chunks to avoid memory issues
  for (let i = 0; i < lines.length; i += 10000) {
    const chunk = lines.slice(i, i + 10000);

    chunk.forEach(line => {
      const [oa_id, population, lat, long] = line.split(',');
      const area = {
        oa_id,
        population: parseInt(population),
        lat: parseFloat(lat),
        long: parseFloat(long)
      };

      // Intelligent sampling: all high-pop areas + 5% of regular areas
      if (area.population >= 400) {
        highPop.push(area);
      } else if (Math.random() < 0.05) {
        regular.push(area);
      }
    });

    if (i % 50000 === 0) console.log(`Processed ${i} areas...`);
  }

  // Combine samples, limit to 20k total
  const regularSample = regular.sort(() => 0.5 - Math.random()).slice(0, 20000 - highPop.length);
  console.log(`Sample: ${highPop.length} high-pop + ${regularSample.length} regular = ${highPop.length + regularSample.length} total`);

  return [...highPop, ...regularSample];
}
