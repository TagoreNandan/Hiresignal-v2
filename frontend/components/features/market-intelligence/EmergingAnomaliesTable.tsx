import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../ui/Table';
import { Card, CardHeader } from '../../ui/Card';
import { anomalies } from '@/lib/data';

export function EmergingAnomaliesTable() {
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
          {anomalies.map((anomaly) => (
            <TableRow key={anomaly.id}>
              <TableCell className="font-data-mono text-data-mono text-on-tertiary-fixed-variant">
                {anomaly.id}
              </TableCell>
              <TableCell>
                <div className="font-body-md text-body-md font-bold text-on-surface">
                  {anomaly.company}
                </div>
                <div className="font-data-mono text-[11px] text-on-tertiary-fixed-variant">
                  {anomaly.position} • {anomaly.location}
                </div>
              </TableCell>
              <TableCell>
                <span className="bg-surface-container border border-outline-variant px-2 py-1 font-data-mono text-[11px] text-on-surface uppercase">
                  {anomaly.source}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-data-mono text-data-mono text-primary">
                    {anomaly.score.toFixed(1)}
                  </span>
                  <div className="w-16 h-1 bg-surface-container">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${anomaly.score}%` }}
                    ></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`flex items-center gap-2 font-data-mono text-data-mono ${
                    anomaly.status === 'ACTIVE'
                      ? 'text-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      anomaly.status === 'ACTIVE'
                        ? 'bg-primary'
                        : 'bg-on-tertiary-fixed-variant'
                    }`}
                  ></span>
                  {anomaly.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
                  open_in_new
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
