'use client';
import React from 'react';

interface YearSelectorProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function YearSelector({ value, onChange }: YearSelectorProps) {
  return (
    <div className="space-y-4">
      <label htmlFor="experience" className="font-label-md text-label-md text-on-surface uppercase block tracking-wider">
        Years of Experience
      </label>
      <div className="relative border-b border-surface-container-highest focus-within:border-primary-container transition-all">
        <select
          id="experience"
          name="experience"
          value={value}
          onChange={onChange}
          className="w-full border-0 focus:ring-0 py-3 text-body-lg font-body-lg appearance-none cursor-pointer bg-transparent text-on-surface"
        >
          {Array.from({ length: 31 }, (_, i) => i).map((year) => (
            <option key={year} value={year} className="bg-surface text-on-surface">
              {year} {year === 1 ? 'Year' : 'Years'}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-0 top-3 pointer-events-none text-secondary">
          expand_more
        </span>
      </div>
    </div>
  );
}
