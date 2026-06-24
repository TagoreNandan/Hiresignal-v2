'use client';
import React, { useState } from 'react';

interface SkillTagsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export function SkillTagsInput({ value, onChange }: SkillTagsInputProps) {
  const [isAddingSkill, setIsAddingSkill] = useState<boolean>(false);
  const [newSkillText, setNewSkillText] = useState<string>('');

  const handleAddSkill = () => {
    const trimmed = newSkillText.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setNewSkillText('');
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(value.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-4">
      <label className="font-label-md text-label-md text-on-surface uppercase block tracking-wider">
        Core Competencies
      </label>
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <div
            key={skill}
            className="px-3 py-1 border border-primary-container bg-primary-container/10 text-primary font-data-mono text-data-mono flex items-center gap-2 uppercase tracking-wide"
          >
            {skill}
            <span
              onClick={() => handleRemoveSkill(skill)}
              className="material-symbols-outlined text-[14px] cursor-pointer hover:text-red-400 transition-colors"
            >
              close
            </span>
          </div>
        ))}

        {isAddingSkill ? (
          <input
            type="text"
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              } else if (e.key === 'Escape') {
                setIsAddingSkill(false);
              }
            }}
            onBlur={handleAddSkill}
            autoFocus
            className="px-3 py-1 border border-primary-container bg-transparent text-on-surface font-data-mono text-data-mono w-28 focus:outline-none focus:ring-0"
            placeholder="skill name..."
          />
        ) : (
          <div
            onClick={() => setIsAddingSkill(true)}
            className="px-3 py-1 border border-surface-container-highest border-dashed text-surface-variant font-data-mono text-data-mono cursor-pointer hover:text-secondary hover:border-secondary transition-all uppercase tracking-wider"
          >
            + ADD SKILL
          </div>
        )}
      </div>
    </div>
  );
}
