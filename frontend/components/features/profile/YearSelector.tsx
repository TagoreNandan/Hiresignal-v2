'use client';
import React from 'react';

interface YearSelectorProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function YearSelector({ value, onChange }: YearSelectorProps) {
  const years = Array.from({ length: 31 }, (_, i) => i); // 0-30 years

  return (
    <div>
      <label htmlFor="experience" className="block text-sm font-medium text-on-surface-variant">
        Years of Experience
      </label>
      <select
        id="experience"
        name="experience"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full bg-surface-container border border-outline-variant p-2 focus:ring-primary focus:border-primary"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year} {year === 1 ? 'Year' : 'Years'}
          </option>
        ))}
      </select>
    </div>
  );
}
