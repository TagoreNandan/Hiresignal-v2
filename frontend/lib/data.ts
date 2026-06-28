import { NavLink } from "@/types/api";
import { Metric, Sector } from "@/types/market";
import { Opportunity } from "@/types/opportunity";

export const navLinks: NavLink[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Opportunities', href: '/feed' },
  { name: 'Configure Profile', href: '/profile' },
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


export const footerLinks: NavLink[] = [
    { name: 'Security Protocol', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Data Access', href: '#' },
    { name: 'Terminal Support', href: '#' },
];
