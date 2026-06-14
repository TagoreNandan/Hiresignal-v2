'use client';
import React from 'react';

interface LocationInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  return (
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-on-surface-variant">
        Preferred Location
      </label>
      <input
        type="text"
        id="location"
        name="location"
        value={value}
        onChange={onChange}
        placeholder="e.g., San Francisco, CA or Remote"
        className="mt-1 block w-full bg-surface-container border border-outline-variant p-2 focus:ring-primary focus:border-primary"
      />
    </div>
  );
}
