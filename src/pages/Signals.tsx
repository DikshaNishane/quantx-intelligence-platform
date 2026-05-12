import React, { useState } from 'react';
import { getTradingSignals } from '@/lib/marketData';
import { TrendingUp, TrendingDown, Minus, Target, Clock, Zap, BrainCircuit, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const signalConfig: any = {
  'STRONG BUY': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: TrendingUp, barColor: 'bg-emerald-400' },
  'BUY': { color: 'text-emerald-400', bg: 'bg-emerald-400/8', border: 'border-emerald-400/20', icon: TrendingUp, barColor: 'bg-emerald-400' },
  'HOLD': { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Minus, barColor: 'bg-amber-400' },
  'SELL': { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: TrendingDown, barColor: 'bg-red-400' },
};

const modelColors: any = {
  'LSTM': 'text-violet-400 bg-violet-400/10',
  'Transformer': 'text-cyan-400 bg-cyan-400/10',
  'Ensemble': 'text-primary bg-primary/10',
  'RL Agent': 'text-amber-400 bg-amber-400/10',
};

export default function Signals() {
  const signals = getTradingSignals();
  const [filter, setFilter] = useState('ALL');

  const filters = ['ALL', 'STRONG BUY', 'BUY', 'HOLD', 'SELL'];
  const filtered = filter === 'ALL' ? signals : signals.filter(s => s.signal === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Trading Signals</h1>
            <p className="text-xs text-muted-foreground font-mono">LSTM + Transformer + RL ensemble predictions</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary rounded-lg p-1">
          <Filter className="w-3 h-3 text-muted-foreground ml-1" />
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2.5 py-1 text-[10px] font-mono rounded-md transition-all',
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['STRONG BUY', 'BUY', 'HOLD', 'SELL'].map(type => {
          const count = signals.filter(s => s.signal === type).length;
          const config = signalConfig[type];
          const avgConf = Math.round(signals.filter(s => s.signal === type).reduce((a, s) => a + s.confidence, 0) / (count || 1));
          return (
            <div key={type} className={cn('bg-card border rounded-xl p-4', config.border)}>
              <div className="flex items-center gap-2 mb-2">
                <config.icon className={cn('w-4 h-4', config.color)} />
                <span className={cn('text-[10px] font-mono font-bold', config.color)}>{type}</span>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{count}</p>
              <p className="text-[10px] text-muted-foreground font-mono">avg conf: {avgConf}%</p>
            </div>
          );
        })}
      </div>

      {/* Model Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5"><BrainCircuit className="w-3 h-3" /> AI Models:</span>
        {Object.entries(modelColors).map(([model, cls]: any) => (
          <span key={model} className={cn('text-[10px] font-mono px-2 py-0.5 rounded', cls)}>{model}</span>
        ))}
      </div>

      {/* Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(signal => {
          const config = signalConfig[signal.signal];
          const isUp = signal.upside >= 0;
          return (
            <div key={signal.symbol} className={cn('bg-card border rounded-xl p-4 hover:border-primary/30 transition-all group', config.border)}>
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', config.bg)}>
                    <span className={cn('text-xs font-mono font-bold', config.color)}>{signal.symbol.slice(0, 3)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{signal.symbol}</p>
                    <p className="text-[10px] text-muted-foreground">{signal.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={cn('text-[10px] font-mono border-0', config.bg, config.color)}>
                        {signal.signal}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {signal.timeframe}
                      </span>
                      <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded', modelColors[signal.model] || 'text-muted-foreground bg-secondary')}>
                        {signal.model}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <Target className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-mono">Target</span>
                  </div>
                  <p className="text-sm font-bold font-mono text-foreground">${signal.targetPrice.toLocaleString()}</p>
                  <p className={cn('text-[10px] font-mono font-semibold', isUp ? 'text-emerald-400' : 'text-red-400')}>
                    {isUp ? '▲' : '▼'} {Math.abs(signal.upside)}% upside
                  </p>
                </div>
              </div>

              {/* Confidence */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-primary" /> AI Confidence
                  </span>
                  <span className={cn('text-xs font-mono font-bold',
                    signal.confidence >= 80 ? 'text-emerald-400' : signal.confidence >= 60 ? 'text-amber-400' : 'text-red-400'
                  )}>
                    {signal.confidence}%
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', config.barColor)}
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50 pt-2.5">
                <p className="text-[11px] text-muted-foreground leading-relaxed">{signal.reason}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
          No signals match the selected filter.
        </div>
      )}
    </div>
  );
}
