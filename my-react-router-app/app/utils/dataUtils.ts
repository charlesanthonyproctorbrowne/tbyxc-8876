import { OptimizationResults } from "~/types/optimization";

export async function loadOptimizationResults(): Promise<OptimizationResults> {
  const response = await fetch('/optimization_results.json');
  if (!response.ok) {
    throw new Error('Failed to load optimization results');
  }
  return response.json();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function formatDistance(distance: number): string {
  return `${(distance * 100).toFixed(1)}km`;
}

export function formatPercentage(value: number, total: number): string {
  return `${((value / total) * 100).toFixed(1)}%`;
}
