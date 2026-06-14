import React from 'react';
import { navLinks } from '@/lib/data';
import { Input } from '../ui/Input';

export function Header() {
  return (
    <header className="bg-background border-b border-outline-variant sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-margin py-4 max-w-container-max mx-auto">
        <div className="flex items-center gap-12">
          <span className="font-headline-md text-headline-md font-bold tracking-tighter text-on-background uppercase">
            SIGINT NETWORK
          </span>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-label-md text-label-md pb-unit hover:text-primary transition-colors duration-200 ${
                  index === 0
                    ? 'text-primary border-b border-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container border border-outline-variant px-4 py-1.5 gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              search
            </span>
            <Input
              placeholder="QUERY DATABASE..."
              type="text"
              className="w-48"
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
