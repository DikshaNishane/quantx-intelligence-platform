import React, { useState, useMemo } from 'react';
import { generateMonteCarloSimulation, getStressTestScenarios, getPerformanceData } from '@/lib/marketData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';
import { BrainCircuit, Play, AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#EC4899', '#6366F1', '#84CC16', '#F97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-2 shadow-xl">
      <p className="text-xs font-mono text-muted-foreground">Month {label}</p>
      <p className="text-sm font-bold font-mono text-foreground">${payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

export default function Forecasting() {
  const [years, setYears] = useState(5);
  const [simCount, setSimCount] = useState(40);
  const [running, setRunning] = useState(false);
  const [activeScenario, setActiveScenario] = useState<any>(null);
  const perf = getPerformanceData();
  const scenarios = getStressTestScenarios();

  const [paths, setPaths] = useState(() => generateMonteCarloSimulation(perf.totalValue, years, simCount));

  const runSimulation = () => {
    setRunning(true);
    setTimeout(() => {
      setPaths(generateMonteCarloSimulation(perf.totalValue, years, simCount));
      setRunning(false);
    }, 600);
  };

  const stats = useMemo(() => {
    const finals = paths.map(p => p[p.length - 1].value).sort((a, b) => a - b);
    return {
      median: finals[Math.floor(finals.length / 2)],
      p10: finals[Math.floor(finals.length * 0.1)],
      p25: finals[Math.floor(finals.length * 0.25)],
      p75: finals[Math.floor(finals.length * 0.75)],
      p90: finals[Math.floor(finals.length * 0.9)],
      best: finals[finals.length - 1],
      worst: finals[0],
      positive: finals.filter(f => f > perf.totalValue).length,
      total: finals.length,
    };
  }, [paths, perf.totalValue]);

  const chartData = useMemo(() => {
    const len = paths[0]?.length || 0;
    return Array.from({ length: len }, (_, i) => {
      const row: any = { month: i };
      paths.forEach((p, j) => { row[`sim${j}`] = p[i].value; });
      return row;
    });
  }, [paths]);

  const positivePct = Math.round((stats.positive / stats.total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-foreground">AI Forecasting Studio</h1>
          <p className="text-xs text-muted-foreground font-mono">Monte Carlo simulation · Stress testing · Scenario analysis</p>
        </div>
      </div>

      <Tabs defaultValue="monte-carlo" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="monte-carlo" className="font-mono text-xs">Monte Carlo</TabsTrigger>
          <TabsTrigger value="stress-test" className="font-mono text-xs">Stress Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="monte-carlo" className="space-y-4">
          {/* Controls */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-muted-foreground">Projection Horizon</label>
                  <span className="text-xs font-mono font-bold text-foreground">{years} Years</span>
                </div>
                <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={15} step={1} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-muted-foreground">Simulation Paths</label>
                  <span className="text-xs font-mono font-bold text-foreground">{simCount}</span>
                </div>
                <Slider value={[simCount]} onValueChange={([v]) => setSimCount(v)} min={10} max={100} step={10} />
              </div>
              <Button onClick={runSimulation} disabled={running} className="bg-primary hover:bg-primary/90">
                <Play className="w-4 h-4 mr-2" />
                {running ? 'Simulating...' : 'Run Monte Carlo'}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Median (P50)', value: stats.median, color: 'text-primary', note: 'Most likely' },
              { label: 'Bull Case (P75)', value: stats.p75, color: 'text-emerald-400', note: 'Above avg' },
              { label: 'Strong Bull (P90)', value: stats.p90, color: 'text-emerald-400', note: 'Best 10%' },
              { label: 'Bear Case (P25)', value: stats.p25, color: 'text-amber-400', note: 'Below avg' },
              { label: 'Worst Case (P10)', value: stats.p10, color: 'text-red-400', note: 'Worst 10%' },
              { label: 'Max Upside', value: stats.best, color: 'text-emerald-400', note: 'Best path' },
              { label: 'Max Downside', value: stats.worst, color: 'text-red-400', note: 'Worst path' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-3">
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className={cn('text-base font-bold font-mono mt-1', s.color)}>
                  ${(s.value / 1000).toFixed(0)}k
                </p>
                <p className="text-[9px] text-muted-foreground font-mono">{s.note}</p>
              </div>
            ))}
          </div>

          {/* Probability Banner */}
          <div className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border', positivePct >= 70 ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-amber-400/5 border-amber-400/20')}>
            <Info className={cn('w-4 h-4 shrink-0', positivePct >= 70 ? 'text-emerald-400' : 'text-amber-400')} />
            <p className={cn('text-xs font-mono', positivePct >= 70 ? 'text-emerald-400' : 'text-amber-400')}>
              <span className="font-bold">{positivePct}% of {simCount} simulations</span> show positive returns over {years} years.
              Median projected portfolio value: <span className="font-bold">${stats.median.toLocaleString()}</span> ({((stats.median / perf.totalValue - 1) * 100).toFixed(1)}% total return)
            </p>
          </div>

          {/* Chart */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{simCount} Simulated Portfolio Paths</h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{years}-Year horizon · Initial: ${perf.totalValue.toLocaleString()} · Drift-diffusion model</p>
              </div>
              {running && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => `M${v}`} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={perf.totalValue} stroke="hsl(215 20% 35%)" strokeDasharray="4 4" />
                  {paths.map((_, i) => (
                    <Line key={i} type="monotone" dataKey={`sim${i}`} stroke={COLORS[i % COLORS.length]}
                      strokeWidth={1} strokeOpacity={0.35} dot={false} activeDot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stress-test" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">Scenario Impact on Portfolio</h3>
              <p className="text-[10px] text-muted-foreground font-mono mb-4">Projected % change under each macro scenario</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarios} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} width={110} />
                    <Tooltip content={({ active, payload }: any) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
                          <p className="text-xs font-bold font-mono text-foreground mb-1">{d.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">Portfolio: <span className={d.impact >= 0 ? 'text-emerald-400' : 'text-red-400'}>{d.impact}%</span></p>
                          <p className="text-xs font-mono text-muted-foreground">Probability: {d.probability}%</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">{d.description}</p>
                        </div>
                      );
                    }} />
                    <ReferenceLine x={0} stroke="hsl(222 20% 20%)" />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]} onClick={(d: any) => setActiveScenario(activeScenario?.name === d.name ? null : d)}>
                      {scenarios.map((s, i) => (
                        <Cell key={i} fill={s.impact >= 0 ? '#10B981' : '#EF4444'} fillOpacity={activeScenario?.name === s.name ? 1 : 0.65} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Scenario Detail */}
            <div className="bg-card border border-border rounded-xl p-4">
              {activeScenario ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {activeScenario.impact < 0 ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <TrendingUp className="w-4 h-4 text-emerald-400" />}
                      <h3 className="text-sm font-semibold text-foreground">{activeScenario.name}</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">{activeScenario.description}</p>
                  </div>
                  <div className={cn('p-3 rounded-lg border', activeScenario.impact >= 0 ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-red-400/5 border-red-400/20')}>
                    <p className="text-[10px] text-muted-foreground font-mono mb-1">Portfolio Impact</p>
                    <p className={cn('text-3xl font-bold font-mono', activeScenario.impact >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {activeScenario.impact >= 0 ? '+' : ''}{activeScenario.impact}%
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      ≈ {activeScenario.impact >= 0 ? '+' : ''}${Math.abs((perf.totalValue * activeScenario.impact / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })} to portfolio
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Technology (55%)', value: activeScenario.techImpact },
                      { label: 'Crypto (20%)', value: activeScenario.cryptoImpact },
                      { label: 'Financials (10%)', value: activeScenario.finImpact },
                      { label: 'Healthcare (7%)', value: activeScenario.healthImpact },
                      { label: 'Energy (5%)', value: activeScenario.energyImpact },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground font-mono">{s.label}</span>
                        <span className={cn('text-xs font-bold font-mono', s.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                          {s.value >= 0 ? '+' : ''}{s.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border pt-3">
                    <span>Scenario probability</span>
                    <span className="font-bold text-foreground">{activeScenario.probability}%</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <BrainCircuit className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-mono">Click a scenario bar</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">to see detailed sector breakdown</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scenario Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Full Scenario Matrix</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5">Scenario</th>
                    <th className="text-right px-4 py-2.5">Portfolio</th>
                    <th className="text-right px-4 py-2.5">Tech</th>
                    <th className="text-right px-4 py-2.5">Crypto</th>
                    <th className="text-right px-4 py-2.5">Finance</th>
                    <th className="text-right px-4 py-2.5">Health</th>
                    <th className="text-right px-4 py-2.5">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map(s => (
                    <tr
                      key={s.name}
                      className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => setActiveScenario(activeScenario?.name === s.name ? null : s)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {s.impact < 0 ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                          <span className="text-sm font-medium text-foreground">{s.name}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground ml-5">{s.description}</p>
                      </td>
                      {[s.impact, s.techImpact, s.cryptoImpact, s.finImpact, s.healthImpact].map((val, i) => (
                        <td key={i} className={cn('text-right px-4 py-3 font-mono text-sm', val >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                          {val >= 0 ? '+' : ''}{val}%
                        </td>
                      ))}
                      <td className="text-right px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${s.probability * 3}%` }} />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">{s.probability}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
