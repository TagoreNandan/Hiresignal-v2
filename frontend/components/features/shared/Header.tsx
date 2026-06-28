'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { navLinks } from '@/lib/data';
import { createProfile } from '@/lib/api';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get('q') || '' : '';

  useEffect(() => {
    const initProfile = async () => {
      if (typeof window !== 'undefined') {
        const storedId = localStorage.getItem('hiresignal_user_id');
        if (!storedId) {
          try {
            const rand = Math.random().toString(36).substring(2, 10);
            const email = `user_${rand}_${Date.now()}@hiresignal.com`;
            const profile = await createProfile({
              email,
              name: 'John Doe',
              skills: ['React', 'TypeScript', 'Node.js', 'Python'],
              target_roles: ['Senior Software Engineer', 'Frontend Architect'],
              location_pref: 'Remote',
              year_of_study: '5 years'
            });
            localStorage.setItem('hiresignal_user_id', String(profile.id));
            localStorage.setItem('hiresignal_user_email', email);
            window.location.reload();
          } catch (err) {
            console.error("Failed to auto-initialize default profile:", err);
          }
        }
      }
    };
    initProfile();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window !== 'undefined') {
      const q = e.target.value;
      const params = new URLSearchParams(window.location.search);
      if (q) {
        params.set('q', q);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <header className="bg-background dark:bg-background border-b border-outline-variant dark:border-outline-variant sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-margin py-4 max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <div className="flex flex-col select-none">
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary uppercase leading-tight">
              HireSignal
            </span>
            <span className="font-data-mono text-[9px] text-on-surface-variant uppercase tracking-widest leading-none">
              Command Center
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`font-label-md text-label-md pb-unit hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-container dark:text-primary border-b border-primary-container dark:border-primary'
                      : 'text-on-surface-variant dark:text-on-surface-variant'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container border border-outline-variant px-4 py-1.5 gap-3 rounded-full">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-data-mono font-data-mono text-on-surface placeholder:text-on-tertiary-fixed-variant p-0 w-48 focus:outline-none"
              placeholder="QUERY DATABASE..."
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Query Database"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              dark_mode
            </button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              account_circle
            </button>
            <div className="md:hidden">
              <button className="material-symbols-outlined text-on-surface">
                menu
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
