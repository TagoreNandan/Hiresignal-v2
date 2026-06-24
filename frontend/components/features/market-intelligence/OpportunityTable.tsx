'use client';

import React, { useState, useEffect } from 'react';
import { getOpportunities } from '@/lib/api';
import { Opportunity } from '@/types/opportunity';
import { OpportunityTableRow } from './OpportunityTableRow';

export function OpportunityTable() {
  const [mappedOpportunities, setMappedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOpportunities();
      
      // Map API response to the frontend UI type structure
      const mapped: Opportunity[] = data.map((opp) => ({
        id: `SIG-${opp.id.toString().padStart(4, '0')}`,
        company: opp.company,
        position: opp.title,
        location: opp.location || 'Remote',
        source: opp.source || 'Direct Source',
        score: opp.score,
        status: opp.status as 'ACTIVE' | 'PENDING',
      }));
      
      setMappedOpportunities(mapped);
    } catch (err: any) {
      setError(err.message || 'Connection to database timed out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return (
    <div className="bg-surface border border-outline-variant mb-gutter overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md">
          Emerging Job Anomalies
        </h3>
        <div className="flex gap-2">
          <button className="material-symbols-outlined p-2 border border-outline-variant hover:bg-surface-container transition-colors">
            filter_list
          </button>
          <button className="material-symbols-outlined p-2 border border-outline-variant hover:bg-surface-container transition-colors">
            download
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Signal ID</th>
              <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Position Entity</th>
              <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Source Origin</th>
              <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Match Score</th>
              <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
              <th className="text-right py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-8 font-data-mono text-on-surface-variant animate-pulse uppercase tracking-wider">
                  LOADING LIVE TERMINAL SIGNALS...
                </td>
              </tr>
            )}
            
            {error && (
              <tr>
                <td colSpan={6} className="text-center py-8 font-data-mono text-red-400 uppercase tracking-wider bg-red-950/10">
                  CRITICAL ERROR: {error}
                </td>
              </tr>
            )}

            {!loading && !error && mappedOpportunities.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 font-data-mono text-on-surface-variant uppercase tracking-wider">
                  NO RECOGNIZED SIGNALS DETECTED
                </td>
              </tr>
            )}

            {!loading && !error && mappedOpportunities.map((opportunity) => (
              <OpportunityTableRow key={opportunity.id} opportunity={opportunity} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
