import React from 'react';

export function MarketIntelHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-primary rounded-full status-pulse"></span>
          <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.2em]">
            Live Market Terminal
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg text-on-surface">
          Market Intelligence
        </h1>
      </div>
      <div className="flex gap-unit bg-surface-container p-unit border border-outline-variant">
        <button className="bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-2 uppercase tracking-wider">
          Predictive
        </button>
        <button className="text-on-surface-variant font-label-md text-label-md px-6 py-2 uppercase tracking-wider hover:bg-surface-container-high transition-colors">
          Historical
        </button>
      </div>
    </div>
  );
}
