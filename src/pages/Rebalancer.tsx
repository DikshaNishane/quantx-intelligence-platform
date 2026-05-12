import React, { useState } from 'react';
import { getRebalancingSuggestions } from '@/lib/marketData';
import { RefreshCw, ArrowUp, ArrowDown, AlertTriangle, Info, ShieldAlert, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const severityConfig: any = {
  high: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: AlertTriangle },
  medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: AlertTriangle },
  low: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Info },
};

const urgencyConfig: any = {
  High: 'text-red-400 bg-red-400/10',
  Medium: 'text-amber-400 bg-amber-400/10',
  Low: 'text-blue-400 bg-blue-400/10',
};

export default function Rebalancer() {
  const data = getRebalancingSuggestions();
  const [applied, setApplied] = useState(new Set());

  const toggleApply = (symbol: string) => {
    setApplied(prev => {
      const next = new Set(prev);
      next.has(symbol) ? next.delete(symbol) : next.add(symbol);
      return next;
    });
  };

  const radarData = [
    { metric: 'Sharpe', current: data.currentMetrics.sharpe, optimized: data.optimizedMetrics.sharpe, fullMark: 3 },
    { metric: 'Max DD', current: Math.abs(data.currentMetrics.maxDrawdown) / 10, optimized: Math.abs(data.optimizedMetrics.maxDrawdown) / 10, fullMark: 3 },
    { metric: 'VaR', current: Math.abs(data.currentMetrics.var95), optimized: Math.abs(data.optimizedMetrics.var95), fullMark: 6 },
    { metric: 'Volatility', current: data.currentMetrics.volatility / 10, optimized: data.optimizedMetrics.volatility / 10, fullMark: 3 },
    { metric: 'Return', current: data.currentMetrics.expectedReturn / 7, optimized: data.optimizedMetrics.expectedReturn / 7, fullMark: 3 },
  ];

  const riskColor = data.riskScore >= 75 ? 'text-red-400' : data.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Portfolio Rebalancer</h1>
            <p className="text-xs text-muted-foreground font-mono">AI-powered allocation optimization engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono text-primary">RL Optimizer Active</span>
        </div>
      </div>

      {/* Risk Score + Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Score */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Portfolio Risk Score</p>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(222 20% 16%)" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={data.riskScore >= 75 ? '#EF4444' : data.riskScore >= 50 ? '#F59E0B' : '#10B981'}
                strokeWidth="10"
                strokeDasharray={`${data.riskScore * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-3xl font-bold font-mono', riskColor)}>{data.riskScore}</span>
              <span className={cn('text-xs font-mono font-bold', riskColor)}>{data.riskLabel}</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono mt-3 text-center">Composite risk across concentration, volatility & correlation</p>
        </div>

        {/* Issues */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Portfolio Risk Issues
          </h3>
          {data.issues.map((issue, i) => {
            const config = severityConfig[issue.severity];
            return (
              <div key={i} className={cn('flex items-start gap-3 p-2.5 rounded-lg border', config.bg, config.border)}>
                <config.icon className={cn('w-3.5 h-3.5 mt-0.5 shrink-0', config.color)} />
                <p className={cn('text-xs font-mono leading-relaxed', config.color)}>{issue.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Comparison */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">Before vs After Optimization</h3>
          <p className="text-[10px] text-muted-foreground font-mono mb-3">Risk-return profile comparison</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(222 20% 16%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Current" dataKey="current" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Optimized" dataKey="optimized" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-red-400" /><span className="text-[10px] font-mono text-muted-foreground">Current</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-emerald-400" /><span className="text-[10px] font-mono text-muted-foreground">Optimized</span></div>
          </div>
        </div>

        {/* Metrics Comparison */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Projected Metric Improvements</h3>
          <div className="space-y-3">
            {[
              { label: 'Sharpe Ratio', current: data.currentMetrics.sharpe, optimized: data.optimizedMetrics.sharpe, unit: '', higher: true },
              { label: 'Max Drawdown', current: data.currentMetrics.maxDrawdown, optimized: data.optimizedMetrics.maxDrawdown, unit: '%', higher: false },
              { label: 'VaR (95%)', current: data.currentMetrics.var95, optimized: data.optimizedMetrics.var95, unit: '%', higher: false },
              { label: 'Volatility', current: data.currentMetrics.volatility, optimized: data.optimizedMetrics.volatility, unit: '%', higher: false },
              { label: 'Expected Return', current: data.currentMetrics.expectedReturn, optimized: data.optimizedMetrics.expectedReturn, unit: '%', higher: true },
            ].map(m => {
              const delta = (m.optimized - m.current).toFixed(2);
              const isGood = m.higher ? m.optimized > m.current : m.optimized < m.current;
              return (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-36 shrink-0">{m.label}</span>
                  <span className="text-xs font-mono text-foreground w-16">{m.current}{m.unit}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className={cn('text-xs font-bold font-mono w-16', isGood ? 'text-emerald-400' : 'text-red-400')}>{m.optimized}{m.unit}</span>
                  <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded', isGood ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10')}>
                    {Number(delta) > 0 ? '+' : ''}{delta}{m.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rebalancing Suggestions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            AI Rebalancing Actions
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">{applied.size} of {data.suggestions.length} applied</span>
        </div>
        <div className="divide-y divide-border/50">
          {data.suggestions.map((s) => {
            const isApplied = applied.has(s.symbol);
            const isReduce = s.action === 'REDUCE';
            return (
              <div key={s.symbol} className={cn('p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors', isApplied && 'opacity-60')}>
                {/* Action Badge */}
                <div className={cn('w-16 text-center px-2 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0',
                  isReduce ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'
                )}>
                  {s.action}
                </div>

                {/* Symbol + Rationale */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold font-mono text-foreground">{s.symbol}</span>
                    <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded', urgencyConfig[s.urgency])}>
                      {s.urgency} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{s.rationale}</p>
                </div>

                {/* Allocation Change */}
                <div className="text-center shrink-0 hidden md:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-muted-foreground">{s.currentWeight}%</span>
                    <div className="flex items-center">
                      {isReduce ? <ArrowDown className="w-3 h-3 text-red-400" /> : <ArrowUp className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <span className={cn('text-xs font-bold font-mono', isReduce ? 'text-red-400' : 'text-emerald-400')}>{s.targetWeight}%</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground font-mono mt-0.5">allocation</p>
                </div>

                {/* Impact */}
                <div className="text-right shrink-0 hidden lg:block">
                  <p className="text-[10px] text-muted-foreground font-mono">Impact</p>
                  <p className="text-xs font-mono font-bold text-primary">{s.impact}</p>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => toggleApply(s.symbol)}
                  className={cn(
                    'shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all border',
                    isApplied
                      ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                      : 'bg-secondary text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                  )}
                >
                  {isApplied ? '✓ Applied' : 'Apply'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
