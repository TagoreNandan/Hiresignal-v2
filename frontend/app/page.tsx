'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getApplications, 
  getOpportunities,
  createApplication, 
  updateApplicationStatus, 
  updateApplicationNotes, 
  deleteApplication,
  getApplicationSources,
  getProfile,
  JobApplicationResponse,
  OpportunityResponse,
  UserProfileResponse 
} from '@/lib/api';

export default function ApplicationsDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [applications, setApplications] = useState<JobApplicationResponse[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityResponse[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [sourceCounts, setSourceCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  
  // Form/Edit States
  const [company, setCompany] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [source, setSource] = useState<string>('LinkedIn');
  const [newAppStatus, setNewAppStatus] = useState<string>('APPLIED');
  const [appliedDate, setAppliedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newAppNotes, setNewAppNotes] = useState<string>('');
  const [editingApplication, setEditingApplication] = useState<JobApplicationResponse | null>(null);
  const [editAppStatus, setEditAppStatus] = useState<string>('');
  const [editAppNotes, setEditAppNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Dropdown UI Open States
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState<boolean>(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<boolean>(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedId = localStorage.getItem('hiresignal_user_id');
    if (storedId) {
      const parsedId = Number(storedId);
      if (!isNaN(parsedId) && parsedId > 0) {
        setUserId(parsedId);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const [appsData, oppsData, profileData, sourcesData] = await Promise.all([
        getApplications(id),
        getOpportunities(),
        getProfile(id),
        getApplicationSources(id)
      ]);
      setApplications(appsData);
      setOpportunities(oppsData);
      setUserProfile(profileData);
      setSourceCounts(sourcesData);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve job application logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData(userId);
    }
  }, [userId]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !company.trim() || !role.trim()) return;
    setSubmitting(true);
    try {
      const dateObj = new Date(appliedDate);
      const isoDate = isNaN(dateObj.getTime()) ? undefined : dateObj.toISOString();

      await createApplication(
        userId,
        null,
        newAppStatus,
        newAppNotes,
        company.trim(),
        role.trim(),
        source,
        isoDate
      );
      // Reload feed
      await loadData(userId);
      setShowAddModal(false);
      // Reset fields
      setCompany('');
      setRole('');
      setSource('LinkedIn');
      setNewAppStatus('APPLIED');
      setAppliedDate(new Date().toISOString().split('T')[0]);
      setNewAppNotes('');
    } catch (err: any) {
      alert(`Failed to add application: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication) return;
    setSubmitting(true);
    try {
      // Run updates in parallel
      await Promise.all([
        updateApplicationStatus(editingApplication.id, editAppStatus),
        updateApplicationNotes(editingApplication.id, editAppNotes)
      ]);
      await loadData(userId!);
      setShowEditModal(false);
      setEditingApplication(null);
    } catch (err: any) {
      alert(`Failed to update application: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (appId: number) => {
    if (!confirm('Are you sure you want to remove this application record?')) return;
    try {
      await deleteApplication(appId);
      setApplications((prev) => prev.filter((app) => app.id !== appId));
    } catch (err: any) {
      alert(`Failed to delete application: ${err.message}`);
    }
  };

  const openEditModal = (app: JobApplicationResponse) => {
    setEditingApplication(app);
    setEditAppStatus(app.status);
    setEditAppNotes(app.notes || '');
    setShowEditModal(true);
  };

  // Status Classes Mapper
  const getStatusClasses = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'APPLIED') return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    if (s === 'INTERVIEWING') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    if (s === 'OFFER') return 'bg-green-500/20 text-green-400 border border-green-500/30';
    if (s === 'REJECTED') return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (s === 'NEGOTIATING') return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'; // CLOSED
  };

  // Unique list of sources for filter dropdown
  const uniqueSources = ['All', ...Array.from(new Set(applications.map(app => app.opportunity.source).filter(Boolean)))];

  // Filtering Logic
  const filteredApplications = applications.filter((app) => {
    // Source filter
    if (selectedSource !== 'All' && app.opportunity.source !== selectedSource) {
      return false;
    }
    // Status filter
    if (selectedStatus !== 'All' && app.status.toUpperCase() !== selectedStatus.toUpperCase()) {
      return false;
    }
    // Date filter
    if (selectedDateFilter === 'This Month') {
      const appDate = new Date(app.applied_at);
      const now = new Date();
      if (appDate.getMonth() !== now.getMonth() || appDate.getFullYear() !== now.getFullYear()) {
        return false;
      }
    } else if (selectedDateFilter === 'Older') {
      const appDate = new Date(app.applied_at);
      const now = new Date();
      if (appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear()) {
        return false;
      }
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <main className="max-w-container-max mx-auto px-margin py-10 technical-grid min-h-screen relative">
      
      {/* Header and Views Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-outline-variant/30 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary rounded-full status-pulse"></span>
            <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.2em]">Applicant Tracking Log</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Job Applications</h1>
          {!loading && !error && userId && (
            <p className="font-body-md text-on-surface-variant mt-1.5">
              Track your professional growth across {applications.length} active listings.
            </p>
          )}
        </div>

        {userId && (
          <div className="flex items-center gap-4">
            {/* View Modes */}
            <div className="flex bg-surface-container border border-outline-variant/30 p-1 rounded-full">
              <button className="px-4 py-1.5 rounded-full text-primary font-label-md bg-surface-container-high shadow-sm transition-all text-xs uppercase tracking-wider">
                Table View
              </button>
              <button 
                onClick={() => router.push('/feed')}
                className="px-4 py-1.5 rounded-full text-on-surface-variant font-label-md hover:text-on-surface transition-all text-xs uppercase tracking-wider"
              >
                Match Feed
              </button>
            </div>

            {/* Add Application Header button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-primary-container text-on-primary-container hover:bg-[#8b5cf6] rounded-full transition-all font-label-md text-label-md uppercase tracking-wider flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Application
            </button>
          </div>
        )}
      </div>

      {/* Loading animation state */}
      {loading && (
        <div className="text-center py-20 text-on-surface-variant animate-pulse font-label-md tracking-wider">
          RETRIEVING ATS TELEMETRY LOGS...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-950/40 text-red-400 border border-red-800 rounded-lg text-sm mb-6 font-data-mono uppercase tracking-wide">
          ATS SYSTEM FAILURE: {error}
        </div>
      )}

      {/* Profile check redirection warning */}
      {!loading && !error && !userId && (
        <div className="bg-surface border border-outline-variant/30 rounded-lg p-10 text-center space-y-6">
          <span className="material-symbols-outlined text-red-400 text-[48px] animate-pulse">
            account_circle
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">Candidate Profile Required</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            Please configure a profile first to manage tracking logs and matches.
          </p>
          <a
            href="/profile"
            className="inline-block bg-primary-container text-on-primary-container px-8 py-3.5 font-label-md text-label-md hover:bg-[#8b5cf6] rounded-full transition-colors tracking-widest uppercase"
          >
            Create Profile Configuration
          </a>
        </div>
      )}

      {/* Main Table view and Right Sidebar */}
      {!loading && !error && userId && (() => {
        // Calculate Response Rate, Active items, and Offers count from applications data
        const totalAppsCount = applications.length;
        const responseRate = totalAppsCount > 0 
          ? ((applications.filter(a => a.status.toUpperCase() !== 'APPLIED').length / totalAppsCount) * 100).toFixed(0) 
          : '0';
        const totalActive = applications.filter(a => !['CLOSED', 'REJECTED'].includes(a.status.toUpperCase())).length;
        const offerCount = applications.filter(a => ['OFFER', 'NEGOTIATING'].includes(a.status.toUpperCase())).length;

        // Source Effectiveness Chart distribution
        const sourceTotal = Object.values(sourceCounts).reduce((sum, val) => sum + val, 0);
        const sourceDistribution = Object.entries(sourceCounts).map(([name, count]) => {
          const percent = sourceTotal > 0 ? (count / sourceTotal) * 100 : 0;
          return { name, count, percent };
        }).sort((a, b) => b.count - a.count);

        // User Initials Helper
        const getInitials = (name?: string) => {
          if (!name) return 'JD';
          const parts = name.trim().split(/\s+/);
          if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
          return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        };

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Column (Table) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Custom Filter Bar Dropdowns */}
              <div className="flex flex-wrap gap-3 mb-8 items-center">
                
                {/* Source Filter */}
                <div className="relative">
                  <button 
                    onClick={() => { setSourceDropdownOpen(!sourceDropdownOpen); setStatusDropdownOpen(false); setDateDropdownOpen(false); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-outline-variant/30 rounded-full font-label-md text-on-surface-variant hover:border-primary/40 hover:text-on-surface transition-all text-xs uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">filter_list</span>
                    Source: {selectedSource}
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                  {sourceDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-surface-container border border-outline-variant/30 rounded-lg shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {uniqueSources.map((source) => (
                        <button
                          key={source}
                          onClick={() => { setSelectedSource(source); setSourceDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors ${
                            selectedSource === source ? 'text-primary font-bold' : 'text-on-surface-variant'
                          }`}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <button 
                    onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setSourceDropdownOpen(false); setDateDropdownOpen(false); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-outline-variant/30 rounded-full font-label-md text-on-surface-variant hover:border-primary/40 hover:text-on-surface transition-all text-xs uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                    Status: {selectedStatus}
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                  {statusDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-surface-container border border-outline-variant/30 rounded-lg shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {['All', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Negotiating', 'Closed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => { setSelectedStatus(status); setStatusDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors ${
                            selectedStatus === status ? 'text-primary font-bold' : 'text-on-surface-variant'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <button 
                    onClick={() => { setDateDropdownOpen(!dateDropdownOpen); setSourceDropdownOpen(false); setStatusDropdownOpen(false); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-outline-variant/30 rounded-full font-label-md text-on-surface-variant hover:border-primary/40 hover:text-on-surface transition-all text-xs uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                    Applied: {selectedDateFilter === 'All' ? 'All Time' : selectedDateFilter}
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                  {dateDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-surface-container border border-outline-variant/30 rounded-lg shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      {['All', 'This Month', 'Older'].map((filterVal) => (
                        <button
                          key={filterVal}
                          onClick={() => { setSelectedDateFilter(filterVal); setDateDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors ${
                            selectedDateFilter === filterVal ? 'text-primary font-bold' : 'text-on-surface-variant'
                          }`}
                        >
                          {filterVal === 'All' ? 'All Time' : filterVal}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear Button */}
                {(selectedSource !== 'All' || selectedStatus !== 'All' || selectedDateFilter !== 'All') && (
                  <button
                    onClick={() => { setSelectedSource('All'); setSelectedStatus('All'); setSelectedDateFilter('All'); }}
                    className="ml-auto text-on-surface-variant font-label-md hover:text-primary transition-colors flex items-center gap-1 text-xs uppercase tracking-wider"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Table Container */}
              <div className="bg-surface border border-outline-variant/30 rounded-lg overflow-hidden shadow-2xl mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface-container-low/50">
                        <th className="px-8 py-5 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">Company</th>
                        <th className="px-6 py-5 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">Role</th>
                        <th className="px-6 py-5 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">Source</th>
                        <th className="px-6 py-5 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">Status</th>
                        <th className="px-6 py-5 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">Applied Date</th>
                        <th className="px-6 py-5 font-label-md text-on-surface-variant uppercase text-xs tracking-wider">Notes</th>
                        <th className="px-8 py-5 text-right w-24"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-8 py-12 text-center text-on-surface-variant font-body-md italic">
                            No application records matching current filter configurations.
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map((app) => (
                          <tr 
                            key={app.id} 
                            className="group hover:bg-surface-container-low/30 transition-colors"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                {/* Modern geometric visual shape for logo placeholder */}
                                <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center font-display-lg text-primary text-sm font-bold">
                                  {app.opportunity.company.charAt(0)}
                                </div>
                                <span className="font-label-md text-on-surface font-bold text-sm">
                                  {app.opportunity.company}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-on-surface text-sm font-medium">{app.opportunity.title}</td>
                            <td className="px-6 py-5">
                              <span className="bg-surface-container-high/40 text-on-surface-variant border border-outline-variant/30 px-3 py-1 rounded-full text-xs font-data-mono uppercase tracking-wider">
                                {app.opportunity.source || 'Direct'}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <button 
                                onClick={() => openEditModal(app)}
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity cursor-pointer hover:opacity-85 ${getStatusClasses(app.status)}`}
                              >
                                {app.status}
                              </button>
                            </td>
                            <td className="px-6 py-5 text-on-surface-variant font-data-mono text-xs">
                              {formatDate(app.applied_at)}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 max-w-[200px]">
                                <p className="text-xs text-on-surface-variant line-clamp-1 italic">
                                  {app.notes || 'No notes logged.'}
                                </p>
                                <button 
                                  onClick={() => openEditModal(app)}
                                  className="material-symbols-outlined text-[16px] text-on-surface-variant/40 hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                                  title="Edit Notes"
                                >
                                  edit
                                </button>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => openEditModal(app)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface"
                                >
                                  <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                                <button 
                                  onClick={() => handleDelete(app.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-surface-container rounded-full text-red-400 hover:text-red-300"
                                >
                                  <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer counts */}
                <div className="px-8 py-5 border-t border-outline-variant/30 bg-surface-container-low/30 flex items-center justify-between text-xs text-on-surface-variant font-data-mono">
                  <span>Showing {filteredApplications.length} of {applications.length} applications</span>
                  <span className="uppercase tracking-wider">SECURED STORAGE</span>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* User Info Stats Card */}
              <div className="bg-surface border border-outline-variant/30 rounded-lg p-6 bg-gradient-to-br from-surface to-surface-container-low flex flex-col justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shadow">
                    {getInitials(userProfile?.name)}
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface font-bold text-sm leading-tight">
                      {userProfile?.name || 'John Doe'}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-secondary font-bold mt-0.5">
                      PRO PLAN
                    </p>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 my-6"></div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-surface-container-low/50 border border-outline-variant/20 rounded p-3 text-center">
                    <div className="font-data-mono text-sm text-primary font-bold">
                      {responseRate}%
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-on-surface-variant mt-1">
                      Response
                    </div>
                  </div>

                  <div className="bg-surface-container-low/50 border border-outline-variant/20 rounded p-3 text-center">
                    <div className="font-data-mono text-sm text-primary font-bold">
                      {totalActive}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-on-surface-variant mt-1">
                      Active
                    </div>
                  </div>

                  <div className="bg-surface-container-low/50 border border-outline-variant/20 rounded p-3 text-center">
                    <div className="font-data-mono text-sm text-primary font-bold">
                      {offerCount}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-on-surface-variant mt-1">
                      Offers
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Effectiveness Chart */}
              <div className="bg-surface border border-outline-variant/30 rounded-lg p-6 bg-gradient-to-br from-surface to-surface-container-low shadow-lg">
                <span className="font-data-mono text-[9px] text-primary uppercase tracking-widest block mb-4">
                  Telemetry Log
                </span>
                <h3 className="font-label-md text-on-surface font-bold uppercase tracking-wider text-xs mb-6">
                  Source Effectiveness
                </h3>
                
                {sourceDistribution.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic font-body-md py-4 text-center">
                    No source distribution logs found.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {sourceDistribution.slice(0, 5).map((sourceItem) => (
                      <div key={sourceItem.name}>
                        <div className="flex justify-between mb-1.5 text-xs font-medium">
                          <span className="text-on-surface">{sourceItem.name || 'Other'}</span>
                          <span className="font-data-mono text-primary font-bold">
                            {sourceItem.percent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(74,101,78,0.2)]" 
                            style={{ width: `${sourceItem.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Alerts */}
              {(() => {
                const linkedinCount = applications.filter(a => (a.opportunity.source || '').toLowerCase().includes('linkedin')).length;
                const interviewingCount = applications.filter(a => a.status.toUpperCase() === 'INTERVIEWING').length;

                return (
                  <div className="bg-surface border border-outline-variant/30 rounded-lg p-6 bg-gradient-to-br from-surface to-surface-container-low shadow-lg">
                    <span className="font-data-mono text-[9px] text-primary uppercase tracking-widest block mb-4">
                      System Diagnostics
                    </span>
                    <h3 className="font-label-md text-on-surface font-bold uppercase tracking-wider text-xs mb-4">
                      Active Alerts
                    </h3>
                    <div className="space-y-3">
                      {linkedinCount > 3 ? (
                        <div className="flex gap-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-lg p-3 animate-in fade-in duration-200">
                          <span className="material-symbols-outlined text-yellow-400 text-[20px] shrink-0">trending_up</span>
                          <div>
                            <h4 className="font-label-md text-[11px] text-on-surface font-bold">Traffic Spike</h4>
                            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                              LinkedIn applications increased to {linkedinCount} active listings.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-lg p-3">
                          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">trending_flat</span>
                          <div>
                            <h4 className="font-label-md text-[11px] text-on-surface font-bold">Traffic Nominal</h4>
                            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                              Application submission volume remains stable across sources.
                            </p>
                          </div>
                        </div>
                      )}

                      {interviewingCount >= 5 ? (
                        <div className="flex gap-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-lg p-3 animate-in fade-in duration-200">
                          <span className="material-symbols-outlined text-red-400 text-[20px] shrink-0">warning</span>
                          <div>
                            <h4 className="font-label-md text-[11px] text-on-surface font-bold">Bottleneck Detected</h4>
                            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                              Wait times in "Interviewing" stage exceed 14 days ({interviewingCount} active).
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-lg p-3">
                          <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0">check_circle</span>
                          <div>
                            <h4 className="font-label-md text-[11px] text-on-surface font-bold">Pipeline Healthy</h4>
                            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                              No delay bottlenecks detected ({interviewingCount} active interviews).
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        );
      })()}

      {/* Floating Add Application Button for mobile/tablet */}
      {userId && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center md:hidden z-30 hover:scale-105 active:scale-95 transition-all"
          title="Add application"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
        </button>
      )}

      {/* ==================== ADD APPLICATION MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg max-w-md w-full p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-6 top-6 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase tracking-wide text-lg">Add Application</h2>
            <p className="text-xs text-on-surface-variant mb-6 uppercase tracking-wider font-data-mono">Calibrating Records</p>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              {/* Company Input */}
              <div className="space-y-1">
                <label htmlFor="companyInput" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                  Company
                </label>
                <input
                  id="companyInput"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-full px-5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="e.g. Lumina Labs"
                  required
                />
              </div>

              {/* Role Input */}
              <div className="space-y-1">
                <label htmlFor="roleInput" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                  Role
                </label>
                <input
                  id="roleInput"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-full px-5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="e.g. Frontend Architect"
                  required
                />
              </div>

              {/* Grid for Source & Status */}
              <div className="grid grid-cols-2 gap-4">
                {/* Source Select */}
                <div className="space-y-1">
                  <label htmlFor="sourceSelect" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                    Source
                  </label>
                  <select
                    id="sourceSelect"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-full px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {['LinkedIn', 'Unstop', 'Direct', 'Indeed', 'Company Career Page', 'Other'].map((src) => (
                      <option key={src} value={src} className="bg-surface text-on-surface">{src}</option>
                    ))}
                  </select>
                </div>

                {/* Status Select */}
                <div className="space-y-1">
                  <label htmlFor="newStatus" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                    Status
                  </label>
                  <select
                    id="newStatus"
                    value={newAppStatus}
                    onChange={(e) => setNewAppStatus(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-full px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'NEGOTIATING', 'CLOSED'].map((st) => (
                      <option key={st} value={st} className="bg-surface text-on-surface">{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Applied Date Picker */}
              <div className="space-y-1">
                <label htmlFor="dateInput" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                  Applied Date
                </label>
                <input
                  id="dateInput"
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-full px-5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Notes Textarea */}
              <div className="space-y-1">
                <label htmlFor="newNotes" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                  Notes
                </label>
                <textarea
                  id="newNotes"
                  value={newAppNotes}
                  onChange={(e) => setNewAppNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-2xl px-5 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                  placeholder="Referral links, recruiter feedback, technical notes..."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-outline-variant text-on-surface py-2.5 rounded-full text-xs font-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !company.trim() || !role.trim()}
                  className="flex-1 bg-primary-container text-on-primary-container hover:bg-[#8b5cf6] py-2.5 rounded-full text-xs font-label-md uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Register'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT APPLICATION MODAL ==================== */}
      {showEditModal && editingApplication && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container border border-outline-variant/30 rounded-lg max-w-md w-full p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setShowEditModal(false); setEditingApplication(null); }}
              className="absolute right-6 top-6 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2 uppercase tracking-wide text-lg">Update Log</h2>
            <p className="text-xs text-on-surface-variant mb-6 uppercase tracking-wider font-data-mono">
              {editingApplication.opportunity.company} — {editingApplication.opportunity.title}
            </p>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              
              {/* Status Selector */}
              <div className="space-y-1">
                <label htmlFor="editStatus" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                  Status Stage
                </label>
                <select
                  id="editStatus"
                  value={editAppStatus}
                  onChange={(e) => setEditAppStatus(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-full px-5 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  {['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'NEGOTIATING', 'CLOSED'].map((st) => (
                    <option key={st} value={st} className="bg-surface text-on-surface">{st}</option>
                  ))}
                </select>
              </div>

              {/* Notes field */}
              <div className="space-y-1">
                <label htmlFor="editNotes" className="font-label-md text-[10px] text-on-surface uppercase tracking-wider block">
                  Notes
                </label>
                <textarea
                  id="editNotes"
                  value={editAppNotes}
                  onChange={(e) => setEditAppNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-2xl px-5 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                  placeholder="Recruiter comments..."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingApplication(null); }}
                  className="flex-1 border border-outline-variant text-on-surface py-2.5 rounded-full text-xs font-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-container text-on-primary-container hover:bg-[#8b5cf6] py-2.5 rounded-full text-xs font-label-md uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  );
}
