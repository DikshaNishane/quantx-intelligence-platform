import React, { useState } from 'react';
import { getTickers, generatePriceHistory } from '@/lib/marketData';
import { Activity, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

const SparkLine = ({ positive }: { positive: boolean }) => {
  const data = generatePriceHistory(20);
  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={positive ? 'sparkGreen' : 'sparkRed'} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
              <stop offset="100%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={positive ? '#10B981' : '#EF4444'}
            fill={`url(#${positive ? 'sparkGreen' : 'sparkRed'})`}
            strokeWidth={1.5}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const MarketIndexCard = ({ name, value, change, changePct }: any) => (
  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
    <p className="text-xs font-mono text-muted-foreground">{name}</p>
    <p className="text-lg font-bold font-mono text-foreground mt-1">{value.toLocaleString()}</p>
    <div className="flex items-center gap-1 mt-1">
      {change >= 0 ? (
        <TrendingUp className="w-3 h-3 text-emerald-400" />
      ) : (
        <TrendingDown className="w-3 h-3 text-red-400" />
      )}
      <span className={cn('text-xs font-mono', change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
        {change >= 0 ? '+' : ''}{changePct.toFixed(2)}%
      </span>
    </div>
  </div>
);

export default function MarketPulse() {
  const [search, setSearch] = useState('');
  const tickers = getTickers();
  const filtered = tickers.filter(t =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const indices = [
    { name: 'S&P 500', value: 5234.18, change: 42.56, changePct: 0.82 },
    { name: 'NASDAQ', value: 16742.39, change: -23.12, changePct: -0.14 },
    { name: 'DOW 30', value: 39872.11, change: 156.78, changePct: 0.39 },
    { name: 'RUSSELL 2K', value: 2087.44, change: -12.34, changePct: -0.59 },
    { name: 'VIX', value: 13.42, change: -0.89, changePct: -6.22 },
    { name: 'BTC/USD', value: 67842.50, change: 1234.00, changePct: 1.85 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-foreground">Market Pulse</h1>
          <p className="text-xs text-muted-foreground font-mono">Live market overview</p>
        </div>
      </div>

      {/* Indices */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {indices.map(idx => (
          <MarketIndexCard key={idx.name} {...idx} />
        ))}
      </div>

      {/* Market Heatmap */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Market Heatmap</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {[
                { label: 'Strong Buy', color: 'bg-emerald-500' },
                { label: 'Neutral', color: 'bg-amber-500' },
                { label: 'Strong Sell', color: 'bg-red-500' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className={cn('w-2 h-2 rounded-full', l.color)} />
                  <span className="text-[9px] font-mono text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {tickers.map(t => {
            const intensity = Math.min(Math.abs(t.changePct) / 5, 1);
            const bgColor = t.changePct >= 0
              ? `rgba(16, 185, 129, ${0.1 + intensity * 0.5})`
              : `rgba(239, 68, 68, ${0.1 + intensity * 0.5})`;
            return (
              <div
                key={t.symbol}
                className="rounded-lg p-2.5 text-center border border-transparent hover:border-primary/30 transition-all cursor-pointer"
                style={{ background: bgColor }}
              >
                <p className="text-xs font-mono font-bold text-foreground">{t.symbol}</p>
                <p className={cn('text-[10px] font-mono font-semibold', t.changePct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {t.changePct >= 0 ? '+' : ''}{t.changePct.toFixed(2)}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticker list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">All Securities</h3>
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs font-mono bg-secondary border-border"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-4 py-2.5">Symbol</th>
                <th className="text-left px-4 py-2.5">Name</th>
                <th className="text-left px-4 py-2.5">Sector</th>
                <th className="text-right px-4 py-2.5">Price</th>
                <th className="text-right px-4 py-2.5">Change</th>
                <th className="text-right px-4 py-2.5">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.symbol} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-sm text-foreground">{t.symbol}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{t.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] font-mono">{t.sector}</Badge>
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-sm text-foreground">
                    ${t.price.toLocaleString()}
                  </td>
                  <td className="text-right px-4 py-3">
                    <span className={cn('font-mono text-sm', t.changePct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {t.changePct >= 0 ? '+' : ''}{t.changePct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-right px-4 py-3">
                    <SparkLine positive={t.changePct >= 0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
