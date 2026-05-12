import React from 'react';
import PortfolioSummary from '@/components/dashboard/PortfolioSummary';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import SectorTreemap from '@/components/dashboard/SectorTreemap';
import HoldingsTable from '@/components/dashboard/HoldingsTable';
import RiskExposure from '@/components/dashboard/RiskExposure';
import GlobalDistribution from '@/components/dashboard/GlobalDistribution';
import InsightsFeed from '@/components/dashboard/InsightsFeed';

export default function CommandCenter() {
  const now = new Date('2026-05-12');
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'hsl(210 40% 96%)' }}>Portfolio Command Center</h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>Real-time portfolio intelligence · {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ background: 'hsl(222 30% 14%)', borderColor: 'hsl(222 20% 16%)' }}>
            <span className="text-[10px] font-mono" style={{ color: 'hsl(215 20% 55%)' }}>NYSE</span>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34D399' }} />
            <span className="text-xs font-mono font-semibold" style={{ color: '#34D399' }}>OPEN</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg border" style={{ background: 'hsl(217 91% 60% / 0.1)', borderColor: 'hsl(217 91% 60% / 0.2)' }}>
            <span className="text-xs font-mono" style={{ color: 'hsl(217 91% 60%)' }}>Live Data</span>
          </div>
        </div>
      </div>
      <PortfolioSummary />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><PerformanceChart /></div>
        <SectorTreemap />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><HoldingsTable /></div>
        <div className="space-y-4">
          <InsightsFeed />
          <RiskExposure />
          <GlobalDistribution />
        </div>
      </div>
    </div>
  );
}
