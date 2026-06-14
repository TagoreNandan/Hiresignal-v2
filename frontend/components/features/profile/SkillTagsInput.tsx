'use client';
import React, { useState } from 'react';

interface SkillTagsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export function SkillTagsInput({ value, onChange }: SkillTagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = inputValue.trim();
      if (newSkill && !value.includes(newSkill)) {
        onChange([...value, newSkill]);
      }
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div>
      <label htmlFor="skills" className="block text-sm font-medium text-on-surface-variant">
        Skills
      </label>
      <div className="mt-1 flex flex-wrap items-center gap-2 p-2 bg-surface-container border border-outline-variant">
        {value.map((skill) => (
          <span key={skill} className="flex items-center gap-1 bg-primary-container text-on-primary-container text-sm px-2 py-1">
            {skill}
            <button onClick={() => removeSkill(skill)} className="text-on-primary-container hover:text-white">
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          id="skills"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill and press Enter"
          className="bg-transparent border-none focus:ring-0 p-0 flex-grow"
        />
      </div>
    </div>
  );
}
