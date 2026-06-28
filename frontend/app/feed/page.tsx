'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getFeed, 
  generateMatches,
  saveMatch, 
  markMatchSeen, 
  getProfile,
  MatchResponse, 
  UserProfileResponse 
} from '@/lib/api';

function FeedContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get('q') || '' : '';

  const [userId, setUserId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Feed filters
  const [hideSeen, setHideSeen] = useState<boolean>(true);
  const [filterSavedOnly, setFilterSavedOnly] = useState<boolean>(false);

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

  const loadFeedData = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      // Load user profile to check matching skills
      const profile = await getProfile(id);
      setUserProfile(profile);

      // Generate/Refresh matches and fetch feed
      let feedData;
      try {
        feedData = await generateMatches(id);
      } catch (err) {
        console.warn("Failed to generate matches, pulling feed:", err);
        feedData = await getFeed(id);
      }
      setMatches(feedData);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve match feed logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadFeedData(userId);
    }
  }, [userId]);

  const handleSave = async (matchId: number) => {
    try {
      const updated = await saveMatch(matchId);
      setMatches((prev) =>
        prev.map((item) => (item.id === matchId ? { ...item, saved: updated.saved } : item))
      );
    } catch (err: any) {
      alert(`Error saving match: ${err.message}`);
    }
  };

  const handleSeen = async (matchId: number) => {
    try {
      const updated = await markMatchSeen(matchId);
      setMatches((prev) =>
        prev.map((item) => (item.id === matchId ? { ...item, seen: updated.seen } : item))
      );
    } catch (err: any) {
      alert(`Error marking match as seen: ${err.message}`);
    }
  };

  // Filter logic: incorporating both the toggles and the query database search string
  const filteredMatches = matches.filter((item) => {
    if (hideSeen && item.seen) return false;
    if (filterSavedOnly && !item.saved) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const opp = item.opportunity;
      const matchCompany = opp.company.toLowerCase().includes(q);
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchLocation = (opp.location || '').toLowerCase().includes(q);
      const matchDesc = (opp.description || '').toLowerCase().includes(q);
      const matchSkills = (opp.required_skills || []).some(skill => skill.toLowerCase().includes(q));
      
      if (!matchCompany && !matchTitle && !matchLocation && !matchDesc && !matchSkills) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <main className="max-w-container-max mx-auto px-margin py-10 technical-grid min-h-screen">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-outline-variant/30 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary rounded-full status-pulse"></span>
            <span className="font-data-mono text-data-mono text-primary uppercase tracking-[0.2em]">Live Match Feed Terminal</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Opportunities Feed</h1>
        </div>

        {/* Dashboard Filters */}
        {userId && !loading && !error && (
          <div className="flex flex-wrap gap-3 items-center bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-3">
            {searchQuery && (
              <span className="font-data-mono text-[10px] text-primary uppercase tracking-wider mr-2 bg-primary/10 border border-primary/20 rounded px-2.5 py-1">
                Query: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => setHideSeen(!hideSeen)}
              className={`px-4 py-2 font-data-mono text-xs uppercase tracking-wider border rounded-full transition-all ${
                hideSeen 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'bg-transparent border-outline-variant text-on-surface-variant hover:border-on-surface'
              }`}
            >
              {hideSeen ? 'Hide Seen: ON' : 'Hide Seen: OFF'}
            </button>
            <button
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`px-4 py-2 font-data-mono text-xs uppercase tracking-wider border rounded-full transition-all ${
                filterSavedOnly 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'bg-transparent border-outline-variant text-on-surface-variant hover:border-on-surface'
              }`}
            >
              {filterSavedOnly ? 'Saved Only: ON' : 'Saved Only: OFF'}
            </button>
            <button
              onClick={() => loadFeedData(userId)}
              className="material-symbols-outlined p-2 border border-outline-variant text-on-surface-variant rounded-full hover:bg-surface-container hover:text-on-surface transition-colors"
              title="Refresh match records"
            >
              refresh
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {[1, 2, 4, 5].map((idx) => (
            <div key={idx} className="bg-surface border border-outline-variant/30 rounded-lg p-6 space-y-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2.5 w-2/3">
                  <div className="h-4 bg-surface-container-highest rounded w-3/4"></div>
                  <div className="h-6 bg-surface-container-highest rounded w-full"></div>
                </div>
                <div className="h-10 w-16 bg-surface-container-highest rounded-full"></div>
              </div>
              <div className="h-3 bg-surface-container-highest rounded w-1/3"></div>
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="h-6 w-16 bg-surface-container-highest rounded-full"></div>
                <div className="h-6 w-20 bg-surface-container-highest rounded-full"></div>
                <div className="h-6 w-24 bg-surface-container-highest rounded-full"></div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
                <div className="h-10 bg-surface-container-highest rounded-full w-1/2"></div>
                <div className="h-10 bg-surface-container-highest rounded-full w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-950/40 text-red-400 border border-red-800 rounded-none text-sm mb-6 font-data-mono uppercase tracking-wide">
          FEED LOAD CONFLICT: {error}
        </div>
      )}

      {/* Profile Check / Missing User ID state */}
      {!loading && !error && !userId && (
        <div className="bg-surface border border-outline-variant/30 rounded-lg p-10 text-center space-y-6">
          <span className="material-symbols-outlined text-red-400 text-[48px] animate-pulse">
            account_circle
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">Candidate Profile Required</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            You must initialize a candidate profile configuration before the matching engine can filter opportunities.
          </p>
          <a
            href="/profile"
            className="inline-block bg-primary-container text-on-primary-container px-8 py-3.5 font-label-md text-label-md hover:bg-[#8b5cf6] rounded-full transition-colors tracking-widest uppercase"
          >
            Create Profile Configuration
          </a>
        </div>
      )}

      {/* Empty State when matches list is empty */}
      {!loading && !error && userId && filteredMatches.length === 0 && (
        <div className="bg-surface border border-outline-variant/30 rounded-lg p-10 text-center space-y-6">
          <span className="material-symbols-outlined text-primary text-[48px]">
            query_stats
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">No Alignment Logs Found</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            No matching opportunities met your current profile specifications. Try expanding your competencies or target roles.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a
              href="/profile"
              className="bg-primary-container text-on-primary-container px-6 py-3 font-label-md text-label-md hover:bg-[#8b5cf6] rounded-full transition-colors tracking-wider uppercase"
            >
              Update Profile
            </a>
            {(hideSeen || filterSavedOnly || searchQuery) && (
              <button
                onClick={() => {
                  setHideSeen(false);
                  setFilterSavedOnly(false);
                  if (typeof window !== 'undefined') {
                    const params = new URLSearchParams(window.location.search);
                    params.delete('q');
                    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                  }
                }}
                className="border border-outline-variant text-on-surface-variant px-6 py-3 font-label-md text-label-md hover:bg-surface-container hover:text-on-surface rounded-full transition-colors tracking-wider uppercase"
              >
                Clear Filters & Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Matches Cards Feed Grid */}
      {!loading && !error && userId && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredMatches.map((item) => {
            const opp = item.opportunity;
            const matchScorePercent = (item.score * 100).toFixed(0);
            
            // Skill lists logic
            const userSkillsLower = userProfile?.skills?.map(s => s.toLowerCase()) || [];
            
            const matchedSkills = opp.required_skills?.filter(skill => 
              userSkillsLower.includes(skill.toLowerCase())
            ) || [];
            
            const unmatchedSkills = opp.required_skills?.filter(skill => 
              !userSkillsLower.includes(skill.toLowerCase())
            ) || [];

            return (
              <div 
                key={item.id} 
                className={`bg-surface border border-outline-variant/30 rounded-lg p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 shadow-xl ${
                  item.seen ? 'opacity-40 hover:opacity-70' : ''
                }`}
              >
                <div>
                  {/* Top Header Card */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-data-mono text-data-mono text-on-tertiary-fixed-variant uppercase tracking-widest text-[10px]">
                        {opp.company}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface mt-1 leading-snug">
                        {opp.title}
                      </h3>
                    </div>
                    {/* Score Badge */}
                    <div className="flex flex-col items-end">
                      <span className="bg-primary/10 border border-primary/30 text-primary font-data-mono text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {matchScorePercent}% Match
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 items-center mt-3 text-xs text-on-surface-variant font-data-mono uppercase">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {opp.location || 'Remote'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">rss_feed</span>
                      {opp.source || 'Scraper'}
                    </span>
                  </div>

                  {/* Description Preview */}
                  {opp.description && (
                    <p className="mt-4 font-body-md text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>
                  )}

                  {/* Skills Alignment Tags */}
                  {opp.required_skills && opp.required_skills.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h4 className="font-label-md text-[10px] text-on-surface uppercase tracking-wider">Skill Alignment:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.map((skill) => (
                          <span 
                            key={skill} 
                            className="bg-emerald-950/30 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-data-mono text-[10px] uppercase tracking-wide"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                        {unmatchedSkills.map((skill) => (
                          <span 
                            key={skill} 
                            className="bg-surface-container-highest/20 text-on-surface-variant border border-outline-variant/30 px-2 py-0.5 rounded font-data-mono text-[10px] uppercase tracking-wide"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="flex gap-4 pt-6 mt-6 border-t border-outline-variant/30">
                  {/* Save button */}
                  <button
                    onClick={() => handleSave(item.id)}
                    className={`flex-1 font-label-md text-label-md py-3 text-center tracking-wider transition-colors border rounded-full uppercase ${
                      item.saved 
                        ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400 hover:bg-emerald-950/30' 
                        : 'bg-transparent border-outline-variant text-on-surface hover:bg-surface-container hover:border-on-surface'
                    }`}
                  >
                    {item.saved ? '✓ Saved' : 'Save opportunity'}
                  </button>
                  {/* Seen button */}
                  <button
                    onClick={() => handleSeen(item.id)}
                    disabled={item.seen}
                    className={`flex-1 font-label-md text-label-md py-3 text-center tracking-wider transition-colors border rounded-full uppercase ${
                      item.seen 
                        ? 'bg-surface-container-low border-outline-variant/30 text-on-tertiary-fixed-variant' 
                        : 'bg-transparent border-outline-variant text-on-surface hover:bg-surface-container hover:border-on-surface'
                    }`}
                  >
                    {item.seen ? '✓ Seen' : 'Mark Seen'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={
      <div className="max-w-container-max mx-auto px-margin py-20 text-center text-on-surface-variant font-label-md tracking-wider">
        RETRIEVING ALIGNMENT TELEMETRY...
      </div>
    }>
      <FeedContent />
    </Suspense>
  );
}
