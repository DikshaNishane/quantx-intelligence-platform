import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, BrainCircuit, MessageSquare, TrendingUp, Activity, Zap, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard },
  { path: '/quant-lab', label: 'Quant Lab', icon: FlaskConical },
  { path: '/forecasting', label: 'AI Forecasting', icon: BrainCircuit },
  { path: '/signals', label: 'Trading Signals', icon: TrendingUp },
  { path: '/market-pulse', label: 'Market Pulse', icon: Activity },
  { path: '/rebalancer', label: 'AI Rebalancer', icon: RefreshCw },
  { path: '/copilot', label: 'AI Copilot', icon: MessageSquare },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  return (
    <aside className={cn('fixed left-0 top-0 h-screen z-50 flex flex-col border-r transition-all duration-300', collapsed ? 'w-16' : 'w-60')} style={{ background: 'hsl(222 40% 6%)', borderColor: 'hsl(222 20% 16%)' }}>
      <div className="flex items-center gap-2 px-4 h-14 border-b shrink-0" style={{ borderColor: 'hsl(222 20% 16%)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsl(217 91% 60% / 0.2)' }}>
          <Zap className="w-4 h-4" style={{ color: 'hsl(217 91% 60%)' }} />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-mono font-bold text-sm tracking-wider" style={{ color: 'hsl(210 40% 96%)' }}>QUANTX</span>
            <span className="text-[10px] font-mono tracking-widest" style={{ color: 'hsl(217 91% 60%)' }}>AI PLATFORM</span>
          </div>
        )}
      </div>
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
              style={{
                background: isActive ? 'hsl(217 91% 60% / 0.1)' : 'transparent',
                color: isActive ? 'hsl(217 91% 60%)' : 'hsl(215 20% 55%)',
                border: isActive ? '1px solid hsl(217 91% 60% / 0.2)' : '1px solid transparent',
              }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="font-medium truncate">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(217 91% 60%)' }} />}
            </Link>
          );
        })}
      </nav>
      <button onClick={onToggle} className="flex items-center justify-center h-10 border-t transition-colors w-full" style={{ borderColor: 'hsl(222 20% 16%)', color: 'hsl(215 20% 55%)' }}>
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
