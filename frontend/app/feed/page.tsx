'use client';

import React, { useState, useEffect } from 'react';
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
  getOpportunities,
  OpportunityResponse,
  JobApplicationResponse,
} from '@/lib/api';

export default function FeedPage() {
  const [userId, setUserId] = useState<number>(1);
  const [applications, setApplications] = useState<JobApplicationResponse[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // App creation modal/controls state
  const [selectedOppId, setSelectedOppId] = useState<number | null>(null);
  const [submittingApp, setSubmittingApp] = useState<boolean>(false);
  const [appNotes, setAppNotes] = useState<string>('');

  // Row selection and editing state
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [editingNotesText, setEditingNotesText] = useState<string>('');
  const [savingNotesId, setSavingNotesId] = useState<number | null>(null);

  const dbUserIds = [1, 2, 3, 4, 5, 6, 8, 13, 14, 15, 17, 18];

  const loadATSData = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const [appsData, oppsData] = await Promise.all([
        getApplications(id),
        getOpportunities(),
      ]);
      setApplications(appsData);
      setOpportunities(oppsData);
      if (oppsData.length > 0) {
        setSelectedOppId(oppsData[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tracking data.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadATSData(userId);
  }, [userId]);

  const handleStatusChange = async (appId: number, nextStatus: string) => {
    try {
      const updated = await updateApplicationStatus(appId, nextStatus);
      setApplications((prev) =>
        prev.map((item) => (item.id === appId ? updated : item))
      );
    } catch (err: any) {
      alert(`Error updating stage: ${err.message}`);
    }
  };

  const handleSaveNotes = async (appId: number, nextNotes: string) => {
    setSavingNotesId(appId);
    try {
      const updated = await updateApplicationNotes(appId, nextNotes);
      setApplications((prev) =>
        prev.map((item) => (item.id === appId ? updated : item))
      );
      alert('Notes saved successfully!');
    } catch (err: any) {
      alert(`Error saving notes: ${err.message}`);
    } finally {
      setSavingNotesId(null);
    }
  };

  const handleWithdraw = async (appId: number) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await deleteApplication(appId);
      setApplications((prev) => prev.filter((item) => item.id !== appId));
      if (selectedAppId === appId) {
        setSelectedAppId(null);
      }
    } catch (err: any) {
      alert(`Error withdrawing application: ${err.message}`);
    }
  };

  const handleSubmitNewApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppId) return;
    setSubmittingApp(true);
    try {
      const newApp = await createApplication(userId, selectedOppId, 'APPLIED', appNotes);
      setApplications((prev) => [newApp, ...prev]);
      setAppNotes('');
      alert('Application registered successfully!');
    } catch (err: any) {
      alert(`Error registering application: ${err.message}`);
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleRowClick = (app: JobApplicationResponse) => {
    if (selectedAppId === app.id) {
      setSelectedAppId(null);
    } else {
      setSelectedAppId(app.id);
      setEditingNotesText(app.notes || '');
    }
  };

  return (
    <main className="max-w-container-max mx-auto px-margin py-10 technical-grid min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary rounded-full status-pulse"></span>
            <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.2em]">Live Application Terminal</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Application Tracker</h1>
        </div>

        {/* User Terminal Selector */}
        <div className="flex flex-wrap items-center gap-3 bg-surface-container border border-outline-variant px-4 py-2">
          <label htmlFor="user-select" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
            Active Candidate:
          </label>
          <div className="flex items-center gap-2">
            <select
              id="user-select"
              value={dbUserIds.includes(userId) ? userId : "custom"}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "custom") {
                  setUserId(Number(val));
                }
              }}
              className="bg-transparent text-primary font-bold focus:outline-none border-b border-primary cursor-pointer p-0"
            >
              {dbUserIds.map((id) => (
                <option key={id} value={id} className="bg-surface text-on-surface">
                  CANDIDATE_ID_{id}
                </option>
              ))}
              {!dbUserIds.includes(userId) && (
                <option key={`dynamic-user-${userId}`} value={userId} className="bg-surface text-on-surface">
                  CANDIDATE_ID_{userId}
                </option>
              )}
              <option key="select-custom" value="custom" className="bg-surface text-on-surface">CUSTOM...</option>
            </select>
            <input
              type="number"
              min="1"
              value={userId}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 0) {
                  setUserId(val);
                }
              }}
              className="w-12 bg-transparent border-b border-outline-variant text-primary font-bold text-center focus:outline-none focus:border-primary p-0"
              title="Input custom User ID"
              placeholder="ID"
              aria-label="Custom User ID"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20 text-on-surface-variant animate-pulse font-label-md tracking-wider">
          LOADING APPLICATION DATA...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 text-red-400 border border-red-800 rounded-none text-sm mb-6 font-data-mono uppercase tracking-wide">
          TRACKER ERROR: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
          
          {/* Applications list */}
          <div className="lg:col-span-2 bg-surface border border-outline-variant mb-gutter overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline-md text-headline-md">Active Submissions</h3>
              <button 
                onClick={() => loadATSData(userId)}
                className="material-symbols-outlined p-2 border border-outline-variant hover:bg-surface-container transition-colors"
                title="Refresh applications list"
              >
                refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">App ID</th>
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Company & Title</th>
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Applied At</th>
                    <th className="text-left py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Stage</th>
                    <th className="text-right py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 font-data-mono text-on-surface-variant uppercase tracking-wider">
                        No active submissions logged. Submit a new application on the side panel.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => {
                      const isExpanded = selectedAppId === app.id;
                      const appId = `APP-${app.id.toString().padStart(4, '0')}`;
                      return (
                        <React.Fragment key={app.id}>
                          <tr
                            className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                            onClick={() => handleRowClick(app)}
                          >
                            <td className="py-4 px-6 font-data-mono text-data-mono text-on-tertiary-fixed-variant">
                              {appId}
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-body-md text-body-md font-bold text-on-surface">
                                {app.opportunity.company}
                              </div>
                              <div className="font-data-mono text-[11px] text-on-tertiary-fixed-variant mt-0.5">
                                {app.opportunity.title}
                              </div>
                            </td>
                            <td className="py-4 px-6 font-data-mono text-[11px] text-on-surface-variant">
                              {new Date(app.applied_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                className="bg-surface-container border border-outline-variant font-data-mono text-[11px] px-2 py-1 text-primary focus:outline-none cursor-pointer"
                                aria-label="Update Application Stage"
                              >
                                <option value="APPLIED" className="bg-surface text-on-surface">APPLIED</option>
                                <option value="INTERVIEWING" className="bg-surface text-on-surface">INTERVIEWING</option>
                                <option value="OFFER" className="bg-surface text-on-surface">OFFER</option>
                                <option value="REJECTED" className="bg-surface text-on-surface">REJECTED</option>
                              </select>
                            </td>
                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end items-center gap-3">
                                <button
                                  onClick={() => handleWithdraw(app.id)}
                                  className="font-label-md text-[11px] uppercase tracking-wider py-1.5 px-3 border border-outline-variant hover:bg-red-950/20 hover:text-red-400 transition-all bg-transparent"
                                >
                                  Withdraw
                                </button>
                                <span className={`material-symbols-outlined text-on-surface-variant hover:text-primary transition-transform duration-200 select-none ${isExpanded ? 'rotate-180' : ''}`}>
                                  expand_more
                                </span>
                              </div>
                            </td>
                          </tr>
                          
                          {isExpanded && (
                            <tr className="bg-surface-container-lowest border-b border-outline-variant/60">
                              <td colSpan={5} className="p-6">
                                <div className="space-y-4 border-l-2 border-primary pl-6 py-2">
                                  <div>
                                    <span className="font-data-mono text-data-mono text-primary uppercase tracking-widest text-[11px]">
                                      Job Specification
                                    </span>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed max-w-4xl whitespace-pre-wrap">
                                      {app.opportunity.description || 'No description provided.'}
                                    </p>
                                  </div>

                                  <div className="pt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
                                    <label htmlFor={`notes-${app.id}`} className="font-data-mono text-data-mono text-primary uppercase tracking-widest text-[11px] block">
                                      Applicant Diary / Log Notes
                                    </label>
                                    <textarea
                                      id={`notes-${app.id}`}
                                      value={editingNotesText}
                                      onChange={(e) => setEditingNotesText(e.target.value)}
                                      className="w-full h-24 bg-surface border border-outline-variant p-3 text-sm focus:outline-none focus:border-primary font-body-md resize-none"
                                      placeholder="Add interview scheduling details, callback logs, or notes here..."
                                    />
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => handleSaveNotes(app.id, editingNotesText)}
                                        disabled={savingNotesId === app.id}
                                        className="font-label-md text-[11px] uppercase tracking-widest py-1.5 px-4 bg-primary-container text-on-primary-container hover:bg-[#8b5cf6] transition-all disabled:opacity-50"
                                      >
                                        {savingNotesId === app.id ? 'SAVING...' : 'SAVE NOTES'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side panel to Submit New Application */}
          <div className="bg-surface border border-outline-variant p-6 flex flex-col gap-6">
            <div>
              <h3 className="font-headline-md text-headline-md">Submit New Application</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Select an open opportunity from the database to log a new active application.
              </p>
            </div>
            
            <form onSubmit={handleSubmitNewApplication} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="opportunity-select" className="font-label-md text-label-md text-on-surface uppercase block">
                  Select Opportunity
                </label>
                <select
                  id="opportunity-select"
                  value={selectedOppId || ''}
                  onChange={(e) => setSelectedOppId(Number(e.target.value))}
                  className="w-full bg-surface-container border border-outline-variant p-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-on-surface font-body-md"
                >
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.company} — {opp.title} ({opp.location || 'Remote'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="new-app-notes" className="font-label-md text-label-md text-on-surface uppercase block">
                  Initial Notes / Cover Details
                </label>
                <textarea
                  id="new-app-notes"
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  className="w-full h-24 bg-surface border border-outline-variant p-3 text-sm focus:outline-none focus:border-primary font-body-md resize-none"
                  placeholder="Referral names, cover logs, or application links..."
                />
              </div>

              <button
                type="submit"
                disabled={submittingApp || !selectedOppId}
                className="w-full py-3 bg-primary-container text-on-primary-container font-label-md hover:bg-[#8b5cf6] transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {submittingApp ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
