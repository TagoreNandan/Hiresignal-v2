import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from '@/components/ui/Table';
import { Card, CardHeader } from '@/components/ui/Card';
import { opportunities } from '@/lib/data';
import { OpportunityTableRow } from './OpportunityTableRow';

export function OpportunityTable() {
  return (
    <Card className="mb-gutter overflow-hidden">
      <CardHeader className="flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md">
          Emerging Job Anomalies
        </h3>
        <div className="flex gap-2">
          <button className="material-symbols-outlined p-2 border border-outline-variant hover:bg-surface-container transition-colors">
            filter_list
          </button>
          <button className="material-symbols-outlined p-2 border border-outline-variant hover:bg-surface-container transition-colors">
            download
          </button>
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low border-b border-outline-variant">
            <TableHead>Signal ID</TableHead>
            <TableHead>Position Entity</TableHead>
            <TableHead>Source Origin</TableHead>
            <TableHead>Match Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opportunity) => (
            <OpportunityTableRow key={opportunity.id} opportunity={opportunity} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
