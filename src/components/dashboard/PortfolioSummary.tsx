import React from 'react';
import { getPerformanceData } from '@/lib/marketData';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Percent } from 'lucide-react';

const MetricCard = ({ label, value, change, icon: Icon, iconStyle }: any) => (
  <div className="rounded-xl p-4 border transition-all duration-300 hover:border-blue-500/30" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'hsl(215 20% 55%)' }}>{label}</span>
      <div className="p-1.5 rounded-lg" style={iconStyle}><Icon className="w-3.5 h-3.5" /></div>
    </div>
    <p className="text-xl font-bold font-mono" style={{ color: 'hsl(210 40% 96%)' }}>{value}</p>
    {change !== undefined && (
      <div className="flex items-center gap-1 mt-2">
        {change >= 0 ? <TrendingUp className="w-3 h-3" style={{ color: '#34D399' }} /> : <TrendingDown className="w-3 h-3" style={{ color: '#F87171' }} />}
        <span className="text-xs font-mono font-medium" style={{ color: change >= 0 ? '#34D399' : '#F87171' }}>{change >= 0 ? '+' : ''}{change}%</span>
      </div>
    )}
  </div>
);

export default function PortfolioSummary() {
  const perf = getPerformanceData();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard label="Portfolio Value" value={`$${perf.totalValue.toLocaleString()}`} change={perf.dayChangePct} icon={DollarSign} iconStyle={{ background: 'hsl(217 91% 60% / 0.1)', color: 'hsl(217 91% 60%)' }} />
      <MetricCard label="Total P&L" value={`$${perf.totalGain.toLocaleString()}`} change={perf.totalGainPct} icon={TrendingUp} iconStyle={{ background: 'rgba(52,211,153,0.1)', color: '#34D399' }} />
      <MetricCard label="Annualized Return" value={`${perf.annualizedReturn}%`} change={perf.yearChangePct} icon={BarChart3} iconStyle={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA' }} />
      <MetricCard label="YTD Return" value={`${perf.ytdReturn}%`} change={perf.monthChangePct} icon={Percent} iconStyle={{ background: 'rgba(251,191,36,0.1)', color: '#FBBF24' }} />
    </div>
  );
}
