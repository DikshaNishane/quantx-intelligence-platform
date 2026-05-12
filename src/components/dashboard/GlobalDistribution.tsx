import React from 'react';
import { getGlobalDistribution } from '@/lib/marketData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Globe } from 'lucide-react';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg p-3 shadow-xl border" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <p className="text-sm font-bold font-mono" style={{ color: 'hsl(210 40% 96%)' }}>{d.region}</p>
      <p className="text-xs font-mono" style={{ color: 'hsl(215 20% 55%)' }}>{d.allocation}% · ${d.value.toLocaleString()}</p>
    </div>
  );
};

export default function GlobalDistribution() {
  const regions = getGlobalDistribution();
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4" style={{ color: 'hsl(217 91% 60%)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>Global Distribution</h3>
      </div>
      <div className="flex items-center gap-4">
        <div style={{ height: 160, width: 160, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={regions} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="allocation" stroke="hsl(222 40% 8%)" strokeWidth={2}>
                {regions.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {regions.map((r, i) => (
            <div key={r.region} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-xs" style={{ color: 'hsl(215 20% 55%)' }}>{r.region}</span>
              </div>
              <span className="text-xs font-mono font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>{r.allocation}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
