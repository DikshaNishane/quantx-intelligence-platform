import React from 'react';
import { getPortfolioHoldings } from '@/lib/marketData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function HoldingsTable() {
  const holdings = getPortfolioHoldings();
  return (
    <div className="rounded-xl border overflow-hidden h-full" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'hsl(222 20% 16%)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>Holdings</h3>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>{holdings.length} positions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs font-mono uppercase tracking-wider" style={{ borderColor: 'hsl(222 20% 16%)', color: 'hsl(215 20% 55%)' }}>
              <th className="text-left px-4 py-2.5">Asset</th>
              <th className="text-right px-4 py-2.5">Price</th>
              <th className="text-right px-4 py-2.5">Shares</th>
              <th className="text-right px-4 py-2.5">Value</th>
              <th className="text-right px-4 py-2.5">P&L</th>
              <th className="text-right px-4 py-2.5">Weight</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const value = h.shares * h.currentPrice;
              const pl = (h.currentPrice - h.avgCost) * h.shares;
              const plPct = ((h.currentPrice - h.avgCost) / h.avgCost) * 100;
              return (
                <tr key={h.symbol} className="border-b transition-colors" style={{ borderColor: 'hsl(222 20% 16% / 0.5)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(217 91% 60% / 0.1)' }}>
                        <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(217 91% 60%)' }}>{h.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>{h.symbol}</p>
                        <p className="text-[10px]" style={{ color: 'hsl(215 20% 55%)' }}>{h.sector}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3 font-mono text-sm" style={{ color: 'hsl(210 40% 96%)' }}>${h.currentPrice.toLocaleString()}</td>
                  <td className="text-right px-4 py-3 font-mono text-sm" style={{ color: 'hsl(215 20% 55%)' }}>{h.shares}</td>
                  <td className="text-right px-4 py-3 font-mono text-sm font-medium" style={{ color: 'hsl(210 40% 96%)' }}>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className="text-right px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {pl >= 0 ? <TrendingUp className="w-3 h-3" style={{ color: '#34D399' }} /> : <TrendingDown className="w-3 h-3" style={{ color: '#F87171' }} />}
                      <span className="font-mono text-sm" style={{ color: pl >= 0 ? '#34D399' : '#F87171' }}>{pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(222 30% 14%)' }}>
                        <div className="h-full rounded-full" style={{ width: `${h.allocation}%`, background: 'hsl(217 91% 60%)' }} />
                      </div>
                      <span className="font-mono text-xs" style={{ color: 'hsl(215 20% 55%)' }}>{h.allocation}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
