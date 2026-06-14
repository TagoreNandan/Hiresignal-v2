import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../../ui/Card';
import { sectors } from '@/lib/data';

export function SectorsHeatmap() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h3 className="font-headline-md text-headline-md">Sectors Heatmap</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-grow overflow-y-auto custom-scrollbar">
        {sectors.map((sector) => (
          <div key={sector.name} className="group cursor-pointer">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-md text-label-md uppercase">
                {sector.name}
              </span>
              <span className="font-data-mono text-data-mono text-primary">
                +{sector.growth}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container border border-outline-variant overflow-hidden">
              <div
                className="h-full bg-primary-container transition-all group-hover:bg-primary"
                style={{ width: `${sector.growth}%` }}
              ></div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <button className="w-full text-center font-label-md text-label-md text-primary uppercase tracking-widest hover:underline">
          Full Sector Audit
        </button>
      </CardFooter>
    </Card>
  );
}
