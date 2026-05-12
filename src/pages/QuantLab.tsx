import React, { useState } from 'react';
import { getRiskMetrics, generateCorrelationMatrix, generatePriceHistory } from '@/lib/marketData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, Cell } from 'recharts';
import { FlaskConical, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const METRIC_DEFS = {
  'Sharpe Ratio': 'Measures excess return per unit of risk. Formula: (Return − Risk-Free Rate) / Std Dev. Higher = better.',
  'Sortino Ratio': 'Like Sharpe but only penalizes downside volatility. A fairer measure for asymmetric return profiles.',
  'Max Drawdown': 'Largest peak-to-trough decline. Measures worst-case loss from the highest point.',
  'Beta': 'Sensitivity to market moves. Beta > 1 means more volatile than market. Beta < 1 means more stable.',
  'Alpha': 'Excess return above the market benchmark. Positive alpha = outperformance.',
  'Volatility': 'Annualized standard deviation of returns. Higher = more price swings.',
  'Calmar Ratio': 'Annualized return divided by max drawdown. Higher = more efficient return for drawdown taken.',
  'Omega Ratio': 'Probability-weighted ratio of gains to losses. Values above 1 are profitable on average.',
};

const MetricBox = ({ label, value, sublabel, color, tooltip }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all relative group">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider leading-tight">{label}</p>
        <button
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Info className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      <p className={cn('text-xl font-bold font-mono mt-1', color)}>{value}</p>
      {sublabel && <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{sublabel}</p>}
      {show && tooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-popover border border-border rounded-lg p-2.5 shadow-xl z-50">
          <p className="text-[10px] text-muted-foreground leading-relaxed">{tooltip}</p>
        </div>
      )}
    </div>
  );
};

const CorrelationHeatmap = () => {
  const { assets, matrix } = generateCorrelationMatrix();
  const size = 38;

  const getColor = (val: number) => {
    if (val >= 0.7) return '#10B981';
    if (val >= 0.4) return '#3B82F6';
    if (val >= 0.1) return '#6366F1';
    if (val >= -0.1) return '#94A3B8';
    if (val >= -0.4) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">Asset Correlation Matrix</h3>
        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Pairwise correlation coefficients — darker = stronger relationship</p>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex">
            <div style={{ width: size + 10 }} />
            {assets.map(a => (
              <div key={a} style={{ width: size }} className="text-center text-[9px] font-mono text-muted-foreground pb-1">{a}</div>
            ))}
          </div>
          {assets.map((row) => (
            <div key={row} className="flex items-center">
              <div style={{ width: size + 10 }} className="text-[9px] font-mono text-muted-foreground pr-2 text-right">{row}</div>
              {assets.map((col) => {
                const entry = matrix.find(m => m.x === row && m.y === col);
                const val = entry?.value || 0;
                return (
                  <div
                    key={`${row}-${col}`}
                    style={{ width: size, height: size, background: getColor(val), opacity: 0.1 + Math.abs(val) * 0.9 }}
                    className="flex items-center justify-center border border-background/20 rounded-sm cursor-pointer"
                    title={`${row} / ${col}: ${val}`}
                  >
                    <span className="text-[8px] font-mono font-bold text-white drop-shadow">{val.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {[
          { label: 'High Positive (≥0.7)', color: '#10B981' },
          { label: 'Moderate (0.4-0.7)', color: '#3B82F6' },
          { label: 'Low (0-0.4)', color: '#6366F1' },
          { label: 'Negative', color: '#EF4444' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
            <span className="text-[9px] font-mono text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartTooltip = ({ active, payload, label, prefix = '' }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-2.5 shadow-xl">
      <p className="text-[10px] font-mono text-muted-foreground">{label}</p>
      <p className="text-sm font-bold font-mono text-foreground">{prefix}{payload[0].value}</p>
    </div>
  );
};

export default function QuantLab() {
  const risk = getRiskMetrics();

  const drawdownData = generatePriceHistory(180).map((d, i, arr) => {
    const peak = Math.max(...arr.slice(0, i + 1).map(x => x.value));
    return { date: d.date, drawdown: +(-((peak - d.value) / peak) * 100).toFixed(2) };
  });

  const radarData = [
    { metric: 'Sharpe', value: risk.sharpeRatio, fullMark: 3 },
    { metric: 'Sortino', value: risk.sortinoRatio, fullMark: 3 },
    { metric: 'Calmar', value: risk.calmarRatio, fullMark: 3 },
    { metric: 'Treynor', value: risk.treynorRatio * 10, fullMark: 3 },
    { metric: 'Info Ratio', value: risk.informationRatio, fullMark: 3 },
    { metric: 'Alpha', value: risk.alpha, fullMark: 5 },
  ];

  const varData = [
    { label: 'VaR 95%', value: Math.abs(risk.var95), color: '#F59E0B' },
    { label: 'VaR 99%', value: Math.abs(risk.var99), color: '#EF4444' },
    { label: 'CVaR 95%', value: Math.abs(risk.cvar95), color: '#EF4444' },
    { label: 'CVaR 99%', value: Math.abs(risk.cvar99), color: '#DC2626' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-foreground">Quant Lab</h1>
          <p className="text-xs text-muted-foreground font-mono">Advanced quantitative risk & performance analytics · Hover metrics for definitions</p>
        </div>
      </div>

      {/* Key Metrics Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricBox label="Sharpe Ratio" value={risk.sharpeRatio} sublabel="Target: >1.5 · Yours: excellent" color="text-emerald-400" tooltip={METRIC_DEFS['Sharpe Ratio']} />
        <MetricBox label="Sortino Ratio" value={risk.sortinoRatio} sublabel="Downside-adjusted return" color="text-emerald-400" tooltip={METRIC_DEFS['Sortino Ratio']} />
        <MetricBox label="Max Drawdown" value={`${risk.maxDrawdown}%`} sublabel="Peak to trough loss" color="text-red-400" tooltip={METRIC_DEFS['Max Drawdown']} />
        <MetricBox label="Beta" value={risk.beta} sublabel="1.0 = market neutral" color="text-amber-400" tooltip={METRIC_DEFS['Beta']} />
      </div>

      {/* Key Metrics Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricBox label="Alpha" value={`${risk.alpha}%`} sublabel="Excess over benchmark" color="text-emerald-400" tooltip={METRIC_DEFS['Alpha']} />
        <MetricBox label="Volatility" value={`${risk.volatility}%`} sublabel="Annualized std dev" color="text-amber-400" tooltip={METRIC_DEFS['Volatility']} />
        <MetricBox label="Calmar Ratio" value={risk.calmarRatio} sublabel="Return / max drawdown" color="text-primary" tooltip={METRIC_DEFS['Calmar Ratio']} />
        <MetricBox label="Omega Ratio" value={risk.omegaRatio} sublabel=">1 = net profitable" color="text-emerald-400" tooltip={METRIC_DEFS['Omega Ratio']} />
      </div>

      <Tabs defaultValue="risk" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="risk" className="font-mono text-xs">VaR / CVaR</TabsTrigger>
          <TabsTrigger value="radar" className="font-mono text-xs">Performance Radar</TabsTrigger>
          <TabsTrigger value="correlation" className="font-mono text-xs">Correlation</TabsTrigger>
          <TabsTrigger value="drawdown" className="font-mono text-xs">Drawdown</TabsTrigger>
        </TabsList>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">Value at Risk (VaR) Analysis</h3>
              <p className="text-[10px] text-muted-foreground font-mono mb-4">Maximum expected portfolio loss at given confidence levels</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={varData} barSize={36}>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<ChartTooltip prefix="-" />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {varData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.8} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-3">Risk Interpretation</h3>
              {[
                { label: 'VaR 95%', value: risk.var95, description: 'On 95% of trading days, you will NOT lose more than 4.2% of portfolio value (~$20,464)' },
                { label: 'VaR 99%', value: risk.var99, description: 'In extreme conditions (1-in-100 days), maximum expected loss is 6.8% (~$33,132)' },
                { label: 'CVaR 95%', value: risk.cvar95, description: 'Expected loss when VaR threshold is breached — the average of worst 5% of outcomes' },
                { label: 'CVaR 99%', value: risk.cvar99, description: 'Expected loss in most extreme 1% of scenarios — used by banks for stress capital requirements' },
              ].map(item => (
                <div key={item.label} className="border border-border/60 rounded-lg p-3 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-foreground">{item.label}</span>
                    <span className="text-sm font-bold font-mono text-red-400">{item.value}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="radar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">Risk-Adjusted Performance Radar</h3>
              <p className="text-[10px] text-muted-foreground font-mono mb-4">Multi-dimensional view of portfolio efficiency metrics</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(222 20% 16%)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <Radar name="Portfolio" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-3">Full Risk Profile</h3>
              {[
                { label: 'Tracking Error', value: `${risk.trackingError}%`, note: 'Deviation from benchmark', color: 'text-amber-400' },
                { label: 'Treynor Ratio', value: risk.treynorRatio, note: 'Return per unit of market risk', color: 'text-primary' },
                { label: 'Information Ratio', value: risk.informationRatio, note: 'Active return / tracking error', color: 'text-primary' },
                { label: 'Calmar Ratio', value: risk.calmarRatio, note: 'Annual return / max drawdown', color: 'text-emerald-400' },
                { label: 'Ulcer Index', value: risk.ulcerIndex, note: 'Depth & duration of drawdowns', color: 'text-red-400' },
                { label: 'Omega Ratio', value: risk.omegaRatio, note: 'Gains vs losses probability', color: 'text-emerald-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <div>
                    <p className="text-xs font-mono text-foreground">{item.label}</p>
                    <p className="text-[9px] text-muted-foreground">{item.note}</p>
                  </div>
                  <span className={cn('text-sm font-bold font-mono', item.color)}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="correlation">
          <CorrelationHeatmap />
        </TabsContent>

        <TabsContent value="drawdown">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">Drawdown Analysis — 180 Days</h3>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Percentage decline from rolling peak value. Max drawdown: {risk.maxDrawdown}%</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdownData}>
                  <defs>
                    <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0.35} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => v.slice(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<ChartTooltip prefix="" />} />
                  <Area type="monotone" dataKey="drawdown" stroke="#EF4444" fill="url(#drawdownGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
