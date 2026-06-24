import React from 'react';
import { Metric } from '@/types/market';

interface MarketStatsCardProps {
  metric: Metric;
}

export function MarketStatsCard({ metric }: MarketStatsCardProps) {
  return (
    <div className="bg-surface border border-outline-variant p-6 bg-gradient-to-br from-surface to-surface-container-low">
      <div className="flex justify-between items-start mb-4">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase">
          {metric.label}
        </span>
        <span className="material-symbols-outlined text-primary text-[20px]">
          {metric.icon}
        </span>
      </div>
      <div className="font-display-lg text-display-lg text-on-surface">
        {metric.value}
      </div>
      {metric.change && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary font-data-mono text-data-mono">
            {metric.change}
          </span>
        </div>
      )}
    </div>
  );
}
