import React from 'react';
import { Opportunity } from '@/types/opportunity';
import {
  TableRow,
  TableCell,
} from '@/components/ui/Table';

interface OpportunityTableRowProps {
  opportunity: Opportunity;
}

export function OpportunityTableRow({ opportunity }: OpportunityTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-data-mono text-data-mono text-on-tertiary-fixed-variant">
        {opportunity.id}
      </TableCell>
      <TableCell>
        <div className="font-body-md text-body-md font-bold text-on-surface">
          {opportunity.company}
        </div>
        <div className="font-data-mono text-[11px] text-on-tertiary-fixed-variant">
          {opportunity.position} • {opportunity.location}
        </div>
      </TableCell>
      <TableCell>
        <span className="bg-surface-container border border-outline-variant px-2 py-1 font-data-mono text-[11px] text-on-surface uppercase">
          {opportunity.source}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-data-mono text-data-mono text-primary">
            {opportunity.score.toFixed(1)}
          </span>
          <div className="w-16 h-1 bg-surface-container">
            <div
              className="h-full bg-primary"
              style={{ width: `${opportunity.score}%` }}
            ></div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`flex items-center gap-2 font-data-mono text-data-mono ${
            opportunity.status === 'ACTIVE'
              ? 'text-primary'
              : 'text-on-surface-variant'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              opportunity.status === 'ACTIVE'
                ? 'bg-primary'
                : 'bg-on-tertiary-fixed-variant'
            }`}
          ></span>
          {opportunity.status}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
          open_in_new
        </button>
      </TableCell>
    </TableRow>
  );
}
