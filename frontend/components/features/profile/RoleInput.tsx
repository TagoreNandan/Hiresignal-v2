'use client';
import React from 'react';

interface RoleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RoleInput({ value, onChange }: RoleInputProps) {
  return (
    <div className="space-y-4">
      <label htmlFor="role" className="font-label-md text-label-md text-on-surface uppercase block tracking-wider">
        Target Role
      </label>
      <div className="relative border-b border-surface-container-highest focus-within:border-primary-container transition-all">
        <input
          type="text"
          id="role"
          name="role"
          value={value}
          onChange={onChange}
          placeholder="e.g., Quantitative Analyst, Product Engineer"
          className="w-full border-0 focus:ring-0 py-3 text-body-lg font-body-lg placeholder:text-surface-variant bg-transparent text-on-surface"
        />
        <span className="material-symbols-outlined absolute right-0 top-3 text-secondary">
          search
        </span>
      </div>
    </div>
  );
}
