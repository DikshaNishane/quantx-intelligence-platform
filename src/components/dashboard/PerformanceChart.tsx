import React, { useState } from 'react';
import { generatePriceHistory } from '@/lib/marketData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TIME_RANGES = [{ label: '1W', days: 7 }, { label: '1M', days: 30 }, { label: '3M', days: 90 }, { label: '6M', days: 180 }, { label: '1Y', days: 365 }];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 shadow-xl border" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <p className="text-xs font-mono" style={{ color: 'hsl(215 20% 55%)' }}>{label}</p>
      <p className="text-sm font-bold font-mono" style={{ color: 'hsl(210 40% 96%)' }}>${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function PerformanceChart() {
  const [range, setRange] = useState(90);
  const data = generatePriceHistory(range);
  const isPositive = data[data.length - 1]?.value >= data[0]?.value;
  const color = isPositive ? '#10B981' : '#EF4444';
  return (
    <div className="rounded-xl p-4 border h-full" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>Portfolio Performance</h3>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>NAV over time</p>
        </div>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'hsl(222 30% 14%)' }}>
          {TIME_RANGES.map(r => (
            <button key={r.label} onClick={() => setRange(r.days)}
              className="px-2.5 py-1 text-xs font-mono rounded-md transition-all"
              style={{ background: range === r.days ? 'hsl(217 91% 60%)' : 'transparent', color: range === r.days ? 'white' : 'hsl(215 20% 55%)' }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => v.slice(5)} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} tickFormatter={v => `$${v}`} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#perfGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
