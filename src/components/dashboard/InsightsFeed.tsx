import React from 'react';
import { getPortfolioInsights } from '@/lib/marketData';
import { AlertTriangle, CheckCircle, Info, ArrowRight } from 'lucide-react';

const typeConfig: any = {
  warning: { icon: AlertTriangle, color: '#FBBF24', bg: 'rgba(251,191,36,0.05)', border: 'rgba(251,191,36,0.2)' },
  success: { icon: CheckCircle, color: '#34D399', bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.2)' },
  info: { icon: Info, color: 'hsl(217 91% 60%)', bg: 'hsl(217 91% 60% / 0.05)', border: 'hsl(217 91% 60% / 0.2)' },
};

export default function InsightsFeed() {
  const insights = getPortfolioInsights();
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'hsl(222 40% 8%)', borderColor: 'hsl(222 20% 16%)' }}>
      <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'hsl(222 20% 16%)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(217 91% 60%)' }} />
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: 'hsl(210 40% 96%)' }}>AI Insights</h3>
      </div>
      <div>
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type];
          return (
            <div key={i} className="p-3 cursor-pointer transition-colors hover:bg-secondary/20" style={{ background: config.bg, borderBottom: i < insights.length - 1 ? '1px solid hsl(222 20% 16% / 0.4)' : 'none' }}>
              <div className="flex items-start gap-2.5">
                <config.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: config.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[11px] font-mono font-semibold" style={{ color: config.color }}>{insight.title}</p>
                    <span className="text-[9px] font-mono shrink-0" style={{ color: 'hsl(215 20% 55%)' }}>{insight.metric}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'hsl(215 20% 55%)' }}>{insight.description}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <ArrowRight className="w-2.5 h-2.5" style={{ color: config.color }} />
                    <span className="text-[10px] font-mono" style={{ color: config.color }}>{insight.action}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
