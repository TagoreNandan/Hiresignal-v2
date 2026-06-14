import { Opportunity } from '@/types/opportunity';

export const mockOpportunities: Opportunity[] = [
  {
    id: 'SIG-9921',
    company: 'Stealth Startup #04',
    position: 'VP Engineering',
    location: 'Palo Alto',
    source: 'Private Network',
    score: 98.2,
    status: 'ACTIVE',
  },
  {
    id: 'SIG-8842',
    company: 'Neural Systems Inc.',
    position: 'Lead AI Scientist',
    location: 'London',
    source: 'Scraped Alert',
    score: 91.5,
    status: 'PENDING',
  },
  {
    id: 'SIG-7719',
    company: 'Quantum Logistics',
    position: 'Head of Product',
    location: 'Berlin',
    source: 'Dark Social',
    score: 87.0,
    status: 'ACTIVE',
  },
];
