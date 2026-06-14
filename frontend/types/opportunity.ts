export interface Opportunity {
    id: string;
    company: string;
    position: string;
    location: string;
    source: string;
    score: number;
    status: 'ACTIVE' | 'PENDING';
  }
  