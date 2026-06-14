'use client';
import React from 'react';

interface RoleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RoleInput({ value, onChange }: RoleInputProps) {
  return (
    <div>
      <label htmlFor="role" className="block text-sm font-medium text-on-surface-variant">
        Target Role
      </label>
      <input
        type="text"
        id="role"
        name="role"
        value={value}
        onChange={onChange}
        placeholder="e.g., Senior Software Engineer"
        className="mt-1 block w-full bg-surface-container border border-outline-variant p-2 focus:ring-primary focus:border-primary"
      />
    </div>
  );
}
