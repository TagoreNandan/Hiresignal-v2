import { HeroMetrics } from "@/components/features/market-intelligence/HeroMetrics";
import { MarketIntelHeader } from "@/components/features/market-intelligence/MarketIntelHeader";
import { OpportunityTable } from "@/components/features/market-intelligence/OpportunityTable";
import { SectorHeatmap } from "@/components/features/market-intelligence/SectorHeatmap";

export default function Home() {
  return (
    <main className="max-w-container-max mx-auto px-margin py-10 technical-grid min-h-screen">
      <MarketIntelHeader />
      <HeroMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2">
            <OpportunityTable />
        </div>
        <div className="lg:col-span-1">
            <SectorHeatmap />
        </div>
      </div>
    </main>
  );
}
