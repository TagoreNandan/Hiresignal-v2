import React from 'react';
import { heroMetrics } from '@/lib/data';
import { MarketStatsCard } from './MarketStatsCard';

export function HeroMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-gutter">
      {heroMetrics.map((metric) => (
        <MarketStatsCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}
