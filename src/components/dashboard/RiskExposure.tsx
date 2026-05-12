import React from 'react';
import { getRiskMetrics } from '@/lib/marketData';
import { Shield, AlertTriangle } from 'lucide-react';

const RiskBar = ({ label, value, maxValue, color }: any) => {
  const pct = Math.min(Math.abs(value / maxValue) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-mono" style={{ color: 'hsl(215 20% 55%)' }}>{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222 30% 14%)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

export default function RiskExposure() {
  const risk = getRiskMetrics();
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4" style={{ color: 'hsl(217 91% 60%)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>Risk Exposure</h3>
      </div>
      <div className="space-y-3">
        <RiskBar label="VaR (95%)" value={risk.var95} maxValue={10} color="#FBBF24" />
        <RiskBar label="VaR (99%)" value={risk.var99} maxValue={10} color="#F87171" />
        <RiskBar label="CVaR (95%)" value={risk.cvar95} maxValue={10} color="#FB923C" />
        <RiskBar label="Max Drawdown" value={risk.maxDrawdown} maxValue={30} color="#F87171" />
        <RiskBar label="Volatility" value={risk.volatility} maxValue={40} color="#FBBF24" />
        <RiskBar label="Beta" value={(risk.beta * 10).toFixed(1)} maxValue={20} color="hsl(217 91% 60%)" />
      </div>
      <div className="mt-4 p-2.5 rounded-lg flex items-start gap-2" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#FBBF24' }} />
        <p className="text-[10px] font-mono leading-relaxed" style={{ color: 'rgba(251,191,36,0.8)' }}>High crypto exposure (20%) increases portfolio volatility. Consider rebalancing.</p>
      </div>
    </div>
  );
}
