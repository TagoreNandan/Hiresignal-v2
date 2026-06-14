export type Metric = {
    label: string;
    value: string;
    change?: string;
    icon: string;
  };
  
  export type Sector = {
    name: string;
    growth: number;
  };
  
  export type Anomaly = {
    id: string;
    position: string;
    location: string;
    company: string;
    source: string;
    score: number;
    status: 'ACTIVE' | 'PENDING';
  };
  
  export type NavLink = {
    name: string;
    href: string;
  };
  