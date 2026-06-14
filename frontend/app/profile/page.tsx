'use client';

import React, { useState } from 'react';
import { RoleInput } from '@/components/features/profile/RoleInput';
import { SkillTagsInput } from '@/components/features/profile/SkillTagsInput';
import { YearSelector } from '@/components/features/profile/YearSelector';
import { LocationInput } from '@/components/features/profile/LocationInput';
import { Button } from '@/components/ui/Button';
import { ProfileData } from '@/types/profile';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    role: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: 5,
    location: 'Remote',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === 'experience' ? Number(value) : value,
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setProfileData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit handler
    console.log('Submitting Profile Data:', profileData);
    alert('Profile data submitted! Check the console for the data.');
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display-lg text-display-lg text-on-surface mb-8">
        Configure Your Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RoleInput value={profileData.role} onChange={handleInputChange} />
        <SkillTagsInput value={profileData.skills} onChange={handleSkillsChange} />
        <YearSelector value={profileData.experience} onChange={handleInputChange} />
        <LocationInput value={profileData.location} onChange={handleInputChange} />
        <div>
          <Button type="submit" variant="primary" className="w-full">
            Save Configuration
          </Button>
        </div>
      </form>
    </main>
  );
}
