import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, BrainCircuit, Sparkles, User, RefreshCw, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
  { icon: '📉', text: 'How will a recession affect my crypto-heavy portfolio?' },
  { icon: '📊', text: "What's my current Sharpe Ratio and how can I improve it?" },
  { icon: '⚖️', text: 'Should I rebalance to reduce tech concentration?' },
  { icon: '₿', text: 'Analyze the risk of adding more Bitcoin exposure' },
  { icon: '🛡️', text: 'What hedging strategies fit my portfolio?' },
  { icon: '📈', text: 'Compare my performance vs S&P 500 this year' },
  { icon: '🔮', text: 'Run a Monte Carlo simulation for 10 years' },
  { icon: '⚡', text: 'Which AI signals have highest confidence today?' },
];

const DEMO_RESPONSES: any = {
  default: `## Portfolio Overview Analysis

Based on your current holdings ($487,234.56), here's my assessment:

**Strengths:**
- Sharpe Ratio of **1.84** — significantly above market average of 1.0
- Strong YTD return of **14.3%** vs benchmark **12.4%**
- NVDA (+42.3%) and BTC (+61.5%) driving outsized gains

**Concerns:**
| Issue | Detail | Risk Level |
|-------|--------|-----------|
| Tech Concentration | 55% vs 40% max | 🔴 High |
| Crypto Exposure | 20% vs 10% recommended | 🔴 High |
| No Bond Allocation | 0% fixed income | 🟡 Medium |
| Zero International | <3% non-US exposure | 🟡 Medium |

**Top Recommendation:** Reduce NVDA from 22% → 12% and redirect $48K into TLT (bonds) + GLD (gold) to improve your Sortino ratio from 2.31 → 2.68 while reducing max drawdown exposure by ~6%.`,

  recession: `## Recession Impact Analysis

Your crypto-heavy, tech-concentrated portfolio faces **significant downside risk** in a recession scenario:

| Sector | Weight | Recession Impact | Dollar Loss |
|--------|--------|-----------------|-------------|
| Technology | 55% | -32% | -$83,433 |
| Crypto | 20% | -45% to -65% | -$43,851 to -$63,441 |
| Financials | 10% | -20% | -$9,745 |
| Healthcare | 7% | -8% | -$2,726 |
| Energy | 5% | -15% | -$3,654 |

**Projected Portfolio Impact: -24.5% to -34.2% (~$119,000 to $166,000 loss)**

**Crypto-Specific Risks:**
- BTC historically drops **50-70%** in macro downturns
- ETH shows **0.88 correlation** with BTC in bear markets  
- Liquidity crises can amplify losses through forced selling cascades

**Defensive Playbook:**
1. Reduce crypto to 8% max (sell ~$56K worth)
2. Add 15% Treasury bonds via TLT (recession hedge + rate-cut upside)
3. Add 5% GLD — gold historically appreciates in recessions
4. Increase healthcare allocation to 12% (beta ~0.7, defensive sector)
5. Consider put options on BTC as portfolio insurance (~0.8% premium)`,

  sharpe: `## Sharpe Ratio Deep Dive

**Current Sharpe Ratio: 1.84** (Above average — benchmark is ~1.0)

Your risk-adjusted returns are solid. Here's the math and path to 2.0+:

**Formula:** Sharpe = (Return - Risk-Free Rate) / Volatility
- Your return: **18.7%**  
- Risk-free rate: **5.3%** (current T-bill)
- Your volatility: **22.5%**
- Result: (18.7 - 5.3) / 22.5 = **0.595** → annualized to **1.84**

**What's Dragging It Down:**
- Crypto adds **~35% excess volatility** to portfolio std dev
- NVDA (solo position) has individual Sharpe of only **0.9** at current valuation
- Zero bonds means no volatility dampening

**Optimization Roadmap to Sharpe 2.2+:**

| Action | Sharpe Impact |
|--------|--------------|
| Reduce BTC to 6% | +0.12 |
| Add 12% TLT bonds | +0.18 |
| Trim NVDA to 12% | +0.09 |
| Add international (VEA 7%) | +0.06 |
| **Total Projected** | **2.29** |

**5-Year Monte Carlo Improvement:**
- At Sharpe 2.29, median outcome improves by **+$67,000**
- P10 (worst-case) improves by **+$41,000**`,

  montecarlo: `## Monte Carlo Simulation — 10 Year Horizon

Running 1,000 simulated market paths using historical parameters for your portfolio...

**Simulation Parameters:**
- Initial Value: **$487,234**
- Expected Annual Return: **14.3%** (current allocation)
- Annual Volatility: **22.5%**
- Drift: **0.8%/month**

**Results Summary:**

| Percentile | 10-Year Outcome | Annualized |
|-----------|----------------|-----------|
| P90 (Best case) | **$3,421,000** | 21.4% |
| P75 | **$2,187,000** | 16.2% |
| **P50 (Median)** | **$1,394,000** | 11.1% |
| P25 | $891,000 | 6.2% |
| P10 (Worst case) | **$412,000** | -1.7% |

**Key Insight:** With your current risk level, there's a **12.3% probability** your portfolio is worth less in 10 years than today. Reducing volatility to 16% (through rebalancing) drops that to **4.1%** while barely impacting median outcomes.

**Recommendation:** Run the AI Rebalancer to see optimized path distribution.`,

  bitcoin: `## Bitcoin Exposure Analysis

**Current BTC Position:** 0.8 BTC @ $67,842 = **$54,274 (12% of portfolio)**

**Risk Assessment:**

| Metric | Value | Interpretation |
|--------|-------|---------------|
| BTC Volatility (Annual) | ~65% | 3x more volatile than your portfolio |
| BTC Drawdown (2022 Bear) | -77% | Potential $41,791 loss |
| BTC-Portfolio Correlation | 0.21 | Low during bull markets |
| BTC-Portfolio Correlation (Crisis) | 0.64 | Spikes in risk-off events |

**Adding More BTC — Scenario Analysis:**
- **If BTC → $100K:** Portfolio gains +$25,726 (+5.3%)  
- **If BTC → $50K:** Portfolio loses -$14,219 (-2.9%)
- **If BTC → $20K (crypto winter):** Portfolio loses -$38,219 (-7.8%)

**AI Assessment:** The **asymmetric upside** is appealing, but at 12% allocation, you already have significant exposure. Adding more would push volatility above 25% — your current VaR of -4.2% would worsen to -5.8% at 95% confidence.

**Recommendation:** Hold current 12%, but do NOT increase further. Consider setting a stop-loss trigger at $50,000 (-26%).`,
};

function getResponse(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('recession') || lower.includes('crash') || lower.includes('bear')) return DEMO_RESPONSES.recession;
  if (lower.includes('sharpe') || lower.includes('ratio') || lower.includes('risk-adjusted')) return DEMO_RESPONSES.sharpe;
  if (lower.includes('monte carlo') || lower.includes('simulation') || lower.includes('10 year') || lower.includes('forecast')) return DEMO_RESPONSES.montecarlo;
  if (lower.includes('bitcoin') || lower.includes('btc') || lower.includes('crypto')) return DEMO_RESPONSES.bitcoin;
  return DEMO_RESPONSES.default;
}

export default function Copilot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isTyping) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: getResponse(msg) }]);
    }, 1400 + Math.random() * 600);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Financial Copilot</h1>
            <p className="text-xs text-muted-foreground font-mono">Ask anything about your portfolio, risk, or markets</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400">Copilot Online</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden min-h-0">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">QuantX AI Copilot</h2>
              <p className="text-sm text-muted-foreground mb-2 max-w-md">
                Your institutional-grade AI financial advisor. Powered by LSTM + Transformer ensemble models.
              </p>
              <p className="text-[11px] text-muted-foreground font-mono mb-6 max-w-sm">
                Try asking about portfolio risk, recession scenarios, Sharpe ratios, Monte Carlo simulations, or crypto analysis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => sendMessage(s.text)}
                    className="text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/60 transition-all group"
                  >
                    <span className="mr-2">{s.icon}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div className={cn(
                'max-w-[85%] rounded-xl p-3.5',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary border border-border'
              )}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none text-xs font-mono leading-relaxed
                    prose-headings:text-foreground prose-headings:font-mono prose-headings:text-sm prose-headings:mb-2 prose-headings:mt-3
                    prose-p:text-muted-foreground prose-p:my-1.5
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-table:border-collapse prose-td:border prose-td:border-border prose-td:px-2 prose-td:py-1 prose-td:text-[10px]
                    prose-th:border prose-th:border-border prose-th:px-2 prose-th:py-1 prose-th:text-[10px] prose-th:bg-muted
                    prose-li:text-muted-foreground prose-li:my-0.5
                    prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
                  ">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-secondary border border-border rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 text-primary animate-spin" />
                  <span className="text-[11px] font-mono text-muted-foreground">Analyzing portfolio data...</span>
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-border bg-card/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about recession risk, Sharpe ratio, crypto exposure, Monte Carlo..."
              className="flex-1 bg-secondary border-border font-mono text-sm"
            />
            <Button
              onClick={() => sendMessage()}
              size="icon"
              disabled={!input.trim() || isTyping}
              className="bg-primary hover:bg-primary/90 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[9px] text-muted-foreground font-mono shrink-0 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Quick:
            </span>
            {SUGGESTIONS.slice(0, 4).map(s => (
              <button
                key={s.text}
                onClick={() => sendMessage(s.text)}
                className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all font-mono whitespace-nowrap"
              >
                {s.icon} {s.text.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
