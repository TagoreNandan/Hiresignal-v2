'use client';

import React, { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { createProfile, getProfile, updateProfile } from '@/lib/api';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    role: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: 5,
    location: 'Remote',
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // For initial rehydration loading
  const [submitting, setSubmitting] = useState<boolean>(false); // For form submission
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAddingSkill, setIsAddingSkill] = useState<boolean>(false);
  const [newSkillText, setNewSkillText] = useState<string>('');

  // 1. Rehydrate profile state from localStorage/API on page load
  useEffect(() => {
    const fetchStoredProfile = async () => {
      const storedId = localStorage.getItem('hiresignal_user_id');
      if (storedId) {
        const parsedId = Number(storedId);
        if (!isNaN(parsedId) && parsedId > 0) {
          setUserId(parsedId);
          try {
            const profile = await getProfile(parsedId);
            setProfileData({
              role: profile.target_roles?.[0] || 'Senior Software Engineer',
              skills: profile.skills || [],
              experience: parseExperience(profile.year_of_study),
              location: profile.location_pref || 'Remote',
            });
          } catch (err: any) {
            console.error('Failed to load profile:', err);
            // If the user profile is deleted or not found on the backend, clear local storage
            if (err.message.includes('not found') || err.message.includes('404')) {
              localStorage.removeItem('hiresignal_user_id');
              setUserId(null);
            }
          }
        }
      }
      setLoading(false);
    };

    fetchStoredProfile();
  }, []);

  const parseExperience = (yearOfStudy: string | null): number => {
    if (!yearOfStudy) return 1;
    const match = yearOfStudy.match(/^\d+/);
    return match ? Number(match[0]) : 1;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === 'experience' ? Number(value) : value,
    }));
  };

  const handleAddSkill = () => {
    const trimmed = newSkillText.trim();
    if (trimmed && !profileData.skills.includes(trimmed)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setNewSkillText('');
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    // Form validation checks
    if (!profileData.role.trim()) {
      setError('Target role is required.');
      setSubmitting(false);
      return;
    }
    if (!profileData.location.trim()) {
      setError('Location is required.');
      setSubmitting(false);
      return;
    }
    if (profileData.skills.length === 0) {
      setError('At least one core competency/skill is required.');
      setSubmitting(false);
      return;
    }

    try {
      const timestamp = userId ? userId : Date.now();
      const payload = {
        name: `User ${timestamp}`,
        email: `user_${timestamp}@hiresignal.com`,
        skills: profileData.skills,
        target_roles: [profileData.role],
        year_of_study: `${profileData.experience} Years`,
        location_pref: profileData.location,
      };

      let response;
      if (userId) {
        response = await updateProfile(userId, payload);
      } else {
        response = await createProfile(payload);
        localStorage.setItem('hiresignal_user_id', String(response.id));
        setUserId(response.id);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface-variant font-label-md tracking-wider animate-pulse">
        CALIBRATING ONBOARDING FLOW...
      </div>
    );
  }

  return (
    <>
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center py-20 px-4">
        {/* Onboarding Card */}
        <div className="w-full max-w-[640px] bg-surface-container-lowest border border-surface-container-highest p-12 md:p-16 relative overflow-hidden">
          {/* Signal Intelligence Accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
          <section className="space-y-12">
            <header className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-data-mono text-data-mono text-primary-container uppercase tracking-widest">
                  {userId ? 'Profile Configuration (Active)' : 'Profile Configuration'}
                </span>
                <span className="font-label-md text-label-md text-secondary">
                  {userId ? `ACTIVE ID: ${userId}` : 'STEP 01/03'}
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-background">
                Tell us what you're looking for.
              </h1>
              <p className="font-body-md text-body-md text-secondary max-w-md">
                Our intelligence engine requires high-fidelity data to calibrate your career signals.
              </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Target Roles */}
              <div className="space-y-4">
                <label htmlFor="role" className="font-label-md text-label-md text-on-surface uppercase block">
                  Target Roles
                </label>
                <div className="relative">
                  <input
                    id="role"
                    name="role"
                    value={profileData.role}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b border-surface-container-highest focus:ring-0 focus:border-primary-container py-3 text-body-lg font-body-lg placeholder:text-surface-variant transition-all bg-transparent text-on-surface"
                    placeholder="e.g. Quantitative Analyst, Product Engineer"
                    type="text"
                    required
                  />
                  <span className="material-symbols-outlined absolute right-0 top-3 text-secondary">
                    search
                  </span>
                </div>
              </div>
              {/* Grid for Year and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="space-y-4">
                  <label htmlFor="experience" className="font-label-md text-label-md text-on-surface uppercase block">
                    Year of Study
                  </label>
                  <div className="relative border-b border-surface-container-highest">
                    <select
                      id="experience"
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      className="w-full border-0 focus:ring-0 py-3 text-body-lg font-body-lg appearance-none cursor-pointer bg-transparent text-on-surface"
                    >
                      <option value={1} className="bg-surface text-on-surface">Freshman / Year 1</option>
                      <option value={2} className="bg-surface text-on-surface">Sophomore / Year 2</option>
                      <option value={3} className="bg-surface text-on-surface">Junior / Year 3</option>
                      <option value={4} className="bg-surface text-on-surface">Senior / Year 4</option>
                      <option value={5} className="bg-surface text-on-surface">Master's / Graduate</option>
                      <option value={6} className="bg-surface text-on-surface">PhD / Research</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-3 pointer-events-none text-secondary">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label htmlFor="location" className="font-label-md text-label-md text-on-surface uppercase block">
                    Location
                  </label>
                  <div className="relative border-b border-surface-container-highest">
                    <input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full border-0 focus:ring-0 py-3 text-body-lg font-body-lg placeholder:text-surface-variant bg-transparent text-on-surface"
                      placeholder="Remote, New York, London"
                      type="text"
                      required
                    />
                    <span className="material-symbols-outlined absolute right-0 top-3 text-secondary">
                      location_on
                    </span>
                  </div>
                </div>
              </div>
              {/* Skills Chips */}
              <div className="space-y-4">
                <label className="font-label-md text-label-md text-on-surface uppercase block">
                  Core Competencies
                </label>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <div
                      key={skill}
                      className={`px-3 py-1 border font-data-mono text-data-mono flex items-center gap-2 uppercase tracking-wide bg-transparent ${
                        index === 0
                          ? 'border-primary-container bg-primary-container/10 text-primary-container'
                          : 'border-surface-container-highest text-secondary hover:border-on-surface transition-colors bg-transparent'
                      }`}
                    >
                      {skill}
                      <span
                        onClick={() => handleRemoveSkill(skill)}
                        className="material-symbols-outlined text-[14px] cursor-pointer hover:text-red-400 transition-colors"
                      >
                        close
                      </span>
                    </div>
                  ))}
                  {isAddingSkill ? (
                    <input
                      type="text"
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        } else if (e.key === 'Escape') {
                          setIsAddingSkill(false);
                        }
                      }}
                      onBlur={handleAddSkill}
                      autoFocus
                      aria-label="Add new competency skill"
                      className="px-3 py-1 border border-primary-container bg-transparent text-on-surface font-data-mono text-data-mono w-28 focus:outline-none focus:ring-0"
                      placeholder="skill name..."
                    />
                  ) : (
                    <div
                      onClick={() => setIsAddingSkill(true)}
                      className="px-3 py-1 border border-surface-container-highest border-dashed text-surface-variant font-data-mono text-data-mono cursor-pointer hover:text-secondary hover:border-secondary transition-all uppercase tracking-wider"
                    >
                      + ADD SKILL
                    </div>
                  )}
                </div>
              </div>

              {/* Status Alerts */}
              {success && (
                <div className="p-4 bg-emerald-950/40 text-emerald-400 border border-emerald-800 rounded-none text-sm font-data-mono uppercase tracking-wide">
                  SIGNAL CALIBRATED: PROFILE INITIALIZED AND SECURED
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-950/40 text-red-400 border border-red-800 rounded-none text-sm font-data-mono uppercase tracking-wide">
                  CALIBRATION ERROR: {error}
                </div>
              )}

              {/* Action Footer */}
              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-gutter">
                <button
                  className="font-label-md text-label-md text-secondary hover:text-on-background transition-colors order-2 md:order-1"
                  type="button"
                  onClick={() => {
                    setProfileData({
                      role: 'Senior Software Engineer',
                      skills: ['React', 'TypeScript', 'Node.js'],
                      experience: 5,
                      location: 'Remote',
                    });
                    localStorage.removeItem('hiresignal_user_id');
                    setUserId(null);
                    setError(null);
                    setSuccess(false);
                  }}
                >
                  RESET CONFIG
                </button>
                <button
                  className="w-full md:w-auto bg-primary-container text-on-primary-container px-10 py-4 font-label-md text-label-md hover:bg-[#8b5cf6] transition-all order-1 md:order-2 tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'CALIBRATING...' : userId ? 'UPDATE CONFIG' : 'INITIALIZE SIGNAL'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      {/* Footer Content */}
      <footer className="w-full px-margin py-16 flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto gap-gutter border-t border-surface-container-highest">
        <div className="font-label-md text-label-md text-secondary uppercase tracking-widest">© 2024 HIRESIGNAL INTELLIGENCE. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-8">
          <a className="font-label-md text-label-md text-secondary hover:text-on-background transition-colors" href="#">Terms</a>
          <a className="font-label-md text-label-md text-secondary hover:text-on-background transition-colors" href="#">Privacy</a>
          <a className="font-label-md text-label-md text-secondary hover:text-on-background transition-colors" href="#">Ethics</a>
        </div>
      </footer>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-5">
        <div className="absolute top-1/4 right-0 w-96 h-96 border border-surface-container-highest rotate-45 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-surface-container-highest -translate-x-1/2 translate-y-1/2 rounded-full"></div>
      </div>
    </>
  );
}
