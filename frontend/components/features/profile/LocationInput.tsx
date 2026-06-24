'use client';
import React from 'react';

interface LocationInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  return (
    <div className="space-y-4">
      <label htmlFor="location" className="font-label-md text-label-md text-on-surface uppercase block tracking-wider">
        Location
      </label>
      <div className="relative border-b border-surface-container-highest focus-within:border-primary-container transition-all">
        <input
          type="text"
          id="location"
          name="location"
          value={value}
          onChange={onChange}
          placeholder="Remote, New York, London"
          className="w-full border-0 focus:ring-0 py-3 text-body-lg font-body-lg placeholder:text-surface-variant bg-transparent text-on-surface"
        />
        <span className="material-symbols-outlined absolute right-0 top-3 text-secondary">
          location_on
        </span>
      </div>
    </div>
  );
}
