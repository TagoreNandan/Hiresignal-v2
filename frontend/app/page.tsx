'use client';

import React, { useState, useEffect } from 'react';
import { getApplications, JobApplicationResponse } from '@/lib/api';

export default function Home() {
  const [userId, setUserId] = useState<number>(1);
  const [applications, setApplications] = useState<JobApplicationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('hiresignal_user_id');
    if (storedId) {
      const parsedId = Number(storedId);
      if (!isNaN(parsedId) && parsedId > 0) {
        setUserId(parsedId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getApplications(userId);
        setApplications(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch application analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userId]);

  // Compute metrics
  const total = applications.length;
  const interviewing = applications.filter((a) => a.status === 'INTERVIEWING').length;
  const offers = applications.filter((a) => a.status === 'OFFER').length;
  const rejected = applications.filter((a) => a.status === 'REJECTED').length;

  return (
    <main className="max-w-container-max mx-auto px-margin py-10 technical-grid min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary rounded-full status-pulse"></span>
            <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.2em]">Application Tracking Terminal</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface">ATS Dashboard</h1>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20 text-on-surface-variant animate-pulse font-label-md tracking-wider">
          LOADING APPLICATION METRICS...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 text-red-400 border border-red-800 rounded-none text-sm mb-6 font-data-mono uppercase tracking-wide">
          ANALYTICS ERROR: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-gutter">
            {/* Total */}
            <div className="bg-surface border border-outline-variant p-6 bg-gradient-to-br from-surface to-surface-container-low">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Total Applications</span>
                <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
              </div>
              <div className="font-display-lg text-display-lg text-on-surface">{total}</div>
              <div className="mt-2 text-on-tertiary-fixed-variant font-data-mono text-xs">ACTIVE PIPELINE</div>
            </div>
            
            {/* Interviewing */}
            <div className="bg-surface border border-outline-variant p-6 bg-gradient-to-br from-surface to-surface-container-low">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Interviewing</span>
                <span className="material-symbols-outlined text-yellow-500 text-[20px]">forum</span>
              </div>
              <div className="font-display-lg text-display-lg text-on-surface">{interviewing}</div>
              <div className="mt-2 text-on-tertiary-fixed-variant font-data-mono text-xs">IN CONVERSATION</div>
            </div>

            {/* Offers */}
            <div className="bg-surface border border-outline-variant p-6 bg-gradient-to-br from-surface to-surface-container-low">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Offers Received</span>
                <span className="material-symbols-outlined text-emerald-500 text-[20px]">celebration</span>
              </div>
              <div className="font-display-lg text-display-lg text-on-surface">{offers}</div>
              <div className="mt-2 text-on-tertiary-fixed-variant font-data-mono text-xs">SUCCESS STAGE</div>
            </div>

            {/* Rejected */}
            <div className="bg-surface border border-outline-variant p-6 bg-gradient-to-br from-surface to-surface-container-low">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Rejected</span>
                <span className="material-symbols-outlined text-red-500 text-[20px]">cancel</span>
              </div>
              <div className="font-display-lg text-display-lg text-on-surface">{rejected}</div>
              <div className="mt-2 text-on-tertiary-fixed-variant font-data-mono text-xs">ARCHIVED</div>
            </div>
          </div>

          {/* Applications list */}
          <div className="bg-surface border border-outline-variant mb-gutter overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md">Active Candidate Applications</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">App ID</th>
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Company & Job Title</th>
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Location</th>
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Applied Date</th>
                    <th className="text-right py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 font-data-mono text-on-surface-variant uppercase tracking-wider">
                        NO ACTIVE APPLICATIONS DETECTED. ONBOARD IN PROFILE OR SUBMIT IN APP TRACKER.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => {
                      const appId = `APP-${app.id.toString().padStart(4, '0')}`;
                      const statusColors: any = {
                        APPLIED: 'text-primary border-primary/30 bg-primary/5',
                        INTERVIEWING: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
                        OFFER: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
                        REJECTED: 'text-red-400 border-red-400/30 bg-red-400/5',
                      };
                      return (
                        <tr key={app.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="py-4 px-6 font-data-mono text-data-mono text-on-tertiary-fixed-variant">
                            {appId}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-body-md text-body-md font-bold text-on-surface">
                              {app.opportunity.company}
                            </div>
                            <div className="font-data-mono text-[11px] text-on-tertiary-fixed-variant">
                              {app.opportunity.title}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-data-mono text-[11px] text-on-surface uppercase">
                            {app.opportunity.location || 'Remote'}
                          </td>
                          <td className="py-4 px-6 font-data-mono text-[11px] text-on-surface-variant">
                            {new Date(app.applied_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`inline-block border px-3 py-1 font-data-mono text-[11px] font-bold tracking-wider uppercase ${statusColors[app.status] || 'text-on-surface-variant border-outline-variant bg-transparent'}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
