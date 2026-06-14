import { NavLink } from "@/types/api";
import { Metric, Sector } from "@/types/market";
import { Opportunity } from "@/types/opportunity";

export const navLinks: NavLink[] = [
  { name: 'Intelligence', href: '#' },
  { name: 'Network', href: '#' },
  { name: 'Archive', href: '#' },
  { name: 'Briefings', href: '#' },
];

export const heroMetrics: Metric[] = [
  {
    label: 'Pipeline Value',
    value: '$2.4M',
    change: 'Target Reached',
    icon: 'payments',
  },
];

export const sectors: Sector[] = [
  { name: 'Generative AI', growth: 84 },
  { name: 'Fintech / DeFi', growth: 42 },
  { name: 'Cybersecurity', growth: 38 },
  { name: 'Energy / Grid', growth: 21 },
  { name: 'HealthTech', growth: 12 },
];

export const opportunities: Opportunity[] = [
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

export const footerLinks: NavLink[] = [
    { name: 'Security Protocol', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Data Access', href: '#' },
    { name: 'Terminal Support', href: '#' },
];
