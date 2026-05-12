import React from 'react';
import { getTickers } from '@/lib/marketData';
import { TrendingUp, TrendingDown, Bell } from 'lucide-react';

export default function TopBar() {
  const tickers = getTickers().slice(0, 10);
  return (
    <div className="h-14 border-b flex items-center px-4 gap-4 shrink-0" style={{ background: 'hsl(222 40% 8% / 0.5)', borderColor: 'hsl(222 20% 16%)', backdropFilter: 'blur(8px)' }}>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-6 animate-ticker whitespace-nowrap">
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-xs">
              <span className="font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>{t.symbol}</span>
              <span style={{ color: 'hsl(215 20% 55%)' }}>${t.price.toLocaleString()}</span>
              <span style={{ color: t.change >= 0 ? '#34D399' : '#F87171' }}>{t.change >= 0 ? '+' : ''}{t.changePct.toFixed(2)}%</span>
              {t.change >= 0 ? <TrendingUp className="w-3 h-3" style={{ color: '#34D399' }} /> : <TrendingDown className="w-3 h-3" style={{ color: '#F87171' }} />}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[10px] px-2 py-1 rounded border" style={{ color: '#34D399', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.05)' }}>LIVE</span>
        <div className="relative">
          <Bell className="w-4 h-4 cursor-pointer" style={{ color: 'hsl(215 20% 55%)' }} />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(217 91% 60%)' }} />
        </div>
      </div>
    </div>
  );
}
