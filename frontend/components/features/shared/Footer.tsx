import React from 'react';
import { footerLinks } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-background border-t border-outline-variant mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin py-8 max-w-container-max mx-auto">
        <span className="font-data-mono text-data-mono font-bold text-on-surface uppercase mb-4 md:mb-0">
          SIGNAL INTELLIGENCE
        </span>
        <div className="flex flex-wrap justify-center gap-8 mb-4 md:mb-0">
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-label-md text-label-md text-tertiary hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
        <span className="font-label-md text-label-md text-on-tertiary-fixed-variant uppercase">
          © 2024 HIRESIGNAL. ALL RIGHTS RESERVED.
        </span>
      </div>
    </footer>
  );
}
