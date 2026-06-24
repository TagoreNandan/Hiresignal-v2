'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/data';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background dark:bg-background border-b border-outline-variant dark:border-outline-variant sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-margin py-4 max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <span className="font-headline-md text-headline-md font-bold tracking-tighter text-on-background dark:text-on-background uppercase">
            SIGINT NETWORK
          </span>
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
          <div className="hidden lg:flex items-center bg-surface-container border border-outline-variant px-4 py-1.5 gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-data-mono font-data-mono text-on-surface placeholder:text-on-tertiary-fixed-variant p-0 w-48"
              placeholder="QUERY DATABASE..."
              type="text"
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
