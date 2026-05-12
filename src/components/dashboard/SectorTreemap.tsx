import React from 'react';
import { getSectorAllocation } from '@/lib/marketData';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#6366F1'];

const CustomContent = ({ x, y, width, height, name, value, index }: any) => {
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} stroke="hsl(222 40% 8%)" strokeWidth={2} rx={4} />
      {width > 60 && height > 40 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold" fontFamily="'JetBrains Mono', monospace">{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={11} fontFamily="'JetBrains Mono', monospace">{value}%</text>
        </>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg p-3 shadow-xl border" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <p className="text-sm font-bold font-mono" style={{ color: 'hsl(210 40% 96%)' }}>{d.name}</p>
      <p className="text-xs font-mono" style={{ color: 'hsl(215 20% 55%)' }}>{d.value}% allocation</p>
    </div>
  );
};

export default function SectorTreemap() {
  const sectors = getSectorAllocation();
  const treeData = sectors.map((s, i) => ({ name: s.name, value: s.value, fill: COLORS[i % COLORS.length] }));
  return (
    <div className="rounded-xl p-4 border h-full" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'hsl(210 40% 96%)' }}>Sector Concentration</h3>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>Portfolio allocation treemap</p>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap data={treeData} dataKey="value" stroke="hsl(222 40% 8%)" content={<CustomContent />}>
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
