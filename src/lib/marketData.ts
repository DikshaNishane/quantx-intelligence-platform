// QuantX AI — Simulated Market Data Engine
export const TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 189.84, change: 2.34, changePct: 1.25, marketCap: '2.94T', pe: 31.2, volume: '54.2M' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 417.52, change: -1.87, changePct: -0.45, marketCap: '3.10T', pe: 36.8, volume: '22.1M' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 176.28, change: 3.12, changePct: 1.80, marketCap: '2.18T', pe: 25.4, volume: '31.5M' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', price: 201.45, change: 4.56, changePct: 2.32, marketCap: '2.10T', pe: 64.1, volume: '42.3M' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 924.79, change: 18.42, changePct: 2.03, marketCap: '2.28T', pe: 72.3, volume: '41.8M' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology', price: 512.33, change: -3.21, changePct: -0.62, marketCap: '1.31T', pe: 28.9, volume: '18.6M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', price: 177.67, change: -5.89, changePct: -3.21, marketCap: '565B', pe: 49.2, volume: '89.4M' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', price: 414.22, change: 1.05, changePct: 0.25, marketCap: '894B', pe: 21.5, volume: '4.2M' },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', price: 198.76, change: 2.11, changePct: 1.07, marketCap: '574B', pe: 12.1, volume: '12.4M' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financials', price: 281.34, change: 0.89, changePct: 0.32, marketCap: '572B', pe: 31.8, volume: '7.8M' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 156.42, change: -0.78, changePct: -0.50, marketCap: '376B', pe: 15.6, volume: '6.9M' },
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', price: 527.88, change: 5.44, changePct: 1.04, marketCap: '486B', pe: 20.3, volume: '3.1M' },
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', price: 104.56, change: -1.23, changePct: -1.16, marketCap: '418B', pe: 13.4, volume: '18.2M' },
  { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Defensive', price: 162.89, change: 0.34, changePct: 0.21, marketCap: '381B', pe: 26.1, volume: '5.4M' },
  { symbol: 'BTC', name: 'Bitcoin', sector: 'Crypto', price: 67842.50, change: 1234.00, changePct: 1.85, marketCap: '1.33T', pe: 'N/A', volume: '28.4B' },
  { symbol: 'ETH', name: 'Ethereum', sector: 'Crypto', price: 3521.80, change: -89.20, changePct: -2.47, marketCap: '423B', pe: 'N/A', volume: '14.2B' },
  { symbol: 'SOL', name: 'Solana', sector: 'Crypto', price: 172.45, change: 8.90, changePct: 5.44, marketCap: '78B', pe: 'N/A', volume: '3.8B' },
];

export function getTickers() {
  return TICKERS.map(t => ({
    ...t,
    price: +(t.price * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2),
    change: +(t.change + (Math.random() - 0.5) * 0.5).toFixed(2),
  }));
}

export function getPortfolioHoldings() {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 150, avgCost: 165.20, currentPrice: 189.84, sector: 'Technology', weight: 0.18, allocation: 18, assetClass: 'Stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 45, avgCost: 650.00, currentPrice: 924.79, sector: 'Technology', weight: 0.22, allocation: 22, assetClass: 'Stock' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 80, avgCost: 380.00, currentPrice: 417.52, sector: 'Technology', weight: 0.15, allocation: 15, assetClass: 'Stock' },
    { symbol: 'JPM', name: 'JPMorgan Chase', shares: 100, avgCost: 170.50, currentPrice: 198.76, sector: 'Financials', weight: 0.10, allocation: 10, assetClass: 'Stock' },
    { symbol: 'BTC', name: 'Bitcoin', shares: 0.8, avgCost: 42000, currentPrice: 67842.50, sector: 'Crypto', weight: 0.12, allocation: 12, assetClass: 'Crypto' },
    { symbol: 'ETH', name: 'Ethereum', shares: 12, avgCost: 2200, currentPrice: 3521.80, sector: 'Crypto', weight: 0.08, allocation: 8, assetClass: 'Crypto' },
    { symbol: 'UNH', name: 'UnitedHealth Group', shares: 25, avgCost: 480.00, currentPrice: 527.88, sector: 'Healthcare', weight: 0.07, allocation: 7, assetClass: 'Stock' },
    { symbol: 'XOM', name: 'Exxon Mobil', shares: 60, avgCost: 95.00, currentPrice: 104.56, sector: 'Energy', weight: 0.05, allocation: 5, assetClass: 'Stock' },
    { symbol: 'PG', name: 'Procter & Gamble', shares: 30, avgCost: 148.00, currentPrice: 162.89, sector: 'Consumer Defensive', weight: 0.03, allocation: 3, assetClass: 'Stock' },
  ];
}

export function getSectorAllocation() {
  return [
    { name: 'Technology', value: 55, color: '#3B82F6' },
    { name: 'Crypto', value: 20, color: '#F59E0B' },
    { name: 'Financials', value: 10, color: '#10B981' },
    { name: 'Healthcare', value: 7, color: '#8B5CF6' },
    { name: 'Energy', value: 5, color: '#EF4444' },
    { name: 'Consumer Defensive', value: 3, color: '#6366F1' },
  ];
}

export function generatePriceHistory(days = 90, startVal = 100, trend = 0.52) {
  const data = [];
  let price = startVal;
  const now = new Date('2026-05-12');
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price = price * (1 + (Math.random() - trend) * 0.03);
    data.push({
      date: date.toISOString().split('T')[0],
      value: +price.toFixed(2),
      volume: Math.floor(Math.random() * 50000000 + 10000000),
    });
  }
  return data;
}

export function generateMonteCarloSimulation(initialValue = 100000, years = 5, simulations = 50) {
  const paths = [];
  const steps = years * 12;
  for (let s = 0; s < simulations; s++) {
    const path = [{ month: 0, value: initialValue }];
    let val = initialValue;
    for (let m = 1; m <= steps; m++) {
      const drift = 0.008;
      const vol = 0.06;
      const monthlyReturn = drift + (Math.random() - 0.5) * vol * 2;
      val = val * (1 + monthlyReturn);
      path.push({ month: m, value: +val.toFixed(0) });
    }
    paths.push(path);
  }
  return paths;
}

export function generateCorrelationMatrix() {
  const assets = ['AAPL', 'NVDA', 'MSFT', 'JPM', 'BTC', 'ETH', 'XOM', 'UNH'];
  const baseCorrelations: any = {
    'AAPL-NVDA': 0.71, 'AAPL-MSFT': 0.82, 'AAPL-JPM': 0.38, 'AAPL-BTC': 0.21, 'AAPL-ETH': 0.18, 'AAPL-XOM': 0.12, 'AAPL-UNH': 0.28,
    'NVDA-MSFT': 0.69, 'NVDA-JPM': 0.31, 'NVDA-BTC': 0.29, 'NVDA-ETH': 0.24, 'NVDA-XOM': 0.08, 'NVDA-UNH': 0.19,
    'MSFT-JPM': 0.41, 'MSFT-BTC': 0.17, 'MSFT-ETH': 0.15, 'MSFT-XOM': 0.14, 'MSFT-UNH': 0.32,
    'JPM-BTC': 0.09, 'JPM-ETH': 0.07, 'JPM-XOM': 0.34, 'JPM-UNH': 0.21,
    'BTC-ETH': 0.88, 'BTC-XOM': -0.04, 'BTC-UNH': -0.11,
    'ETH-XOM': -0.06, 'ETH-UNH': -0.09,
    'XOM-UNH': 0.15,
  };
  const matrix: any[] = [];
  for (let i = 0; i < assets.length; i++) {
    for (let j = 0; j < assets.length; j++) {
      let corr;
      if (i === j) { corr = 1; }
      else {
        const key1 = `${assets[i]}-${assets[j]}`;
        const key2 = `${assets[j]}-${assets[i]}`;
        corr = baseCorrelations[key1] ?? baseCorrelations[key2] ?? 0;
        corr = +(corr + (Math.random() - 0.5) * 0.05).toFixed(2);
        corr = Math.max(-1, Math.min(1, corr));
      }
      matrix.push({ x: assets[i], y: assets[j], value: corr });
    }
  }
  return { assets, matrix };
}

export function getRiskMetrics() {
  return {
    sharpeRatio: 1.84, sortinoRatio: 2.31, maxDrawdown: -18.4, beta: 1.12, alpha: 3.2,
    volatility: 22.5, var95: -4.2, var99: -6.8, cvar95: -5.9, cvar99: -8.7,
    treynorRatio: 0.14, informationRatio: 0.67, calmarRatio: 1.42, trackingError: 4.8,
    omegaRatio: 1.78, ulcerIndex: 3.21,
  };
}

export function getPerformanceData() {
  return {
    totalValue: 487234.56, totalGain: 87234.56, totalGainPct: 21.8,
    dayChange: 3456.78, dayChangePct: 0.71,
    weekChange: 12345.67, weekChangePct: 2.60,
    monthChange: -4567.89, monthChangePct: -0.93,
    yearChange: 67890.12, yearChangePct: 16.18,
    ytdReturn: 14.3, annualizedReturn: 18.7,
    benchmarkReturn: 12.4, alpha: 3.2, beta: 1.12,
  };
}

export function getTradingSignals() {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', signal: 'BUY', confidence: 87, reason: 'LSTM bullish divergence + RSI oversold bounce. iPhone supercycle driven by AI features.', timeframe: '1W', targetPrice: 205.00, currentPrice: 189.84, model: 'LSTM', upside: 8.0 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', signal: 'STRONG BUY', confidence: 94, reason: 'Transformer sentiment bullish + momentum breakout. Data center demand accelerating.', timeframe: '2W', targetPrice: 1050.00, currentPrice: 924.79, model: 'Transformer', upside: 13.5 },
    { symbol: 'TSLA', name: 'Tesla Inc.', signal: 'SELL', confidence: 72, reason: 'Bearish head & shoulders pattern + negative social sentiment. Margin pressure ongoing.', timeframe: '1W', targetPrice: 155.00, currentPrice: 177.67, model: 'Ensemble', upside: -12.8 },
    { symbol: 'BTC', name: 'Bitcoin', signal: 'HOLD', confidence: 65, reason: 'Consolidation phase, post-halving accumulation pending. On-chain metrics neutral.', timeframe: '1M', targetPrice: 75000.00, currentPrice: 67842.50, model: 'LSTM', upside: 10.5 },
    { symbol: 'ETH', name: 'Ethereum', signal: 'BUY', confidence: 78, reason: 'ETF approval catalyst + on-chain metrics bullish. EIP improvements boosting sentiment.', timeframe: '2W', targetPrice: 4200.00, currentPrice: 3521.80, model: 'RL Agent', upside: 19.3 },
    { symbol: 'META', name: 'Meta Platforms', signal: 'HOLD', confidence: 61, reason: 'Valuation premium vs growth. Llama AI monetization timeline uncertain.', timeframe: '1M', targetPrice: 530.00, currentPrice: 512.33, model: 'Transformer', upside: 3.5 },
    { symbol: 'JPM', name: 'JPMorgan Chase', signal: 'BUY', confidence: 82, reason: 'Rate environment remains favorable. Q2 earnings beat and loan growth positive.', timeframe: '1W', targetPrice: 215.00, currentPrice: 198.76, model: 'Ensemble', upside: 8.2 },
    { symbol: 'XOM', name: 'Exxon Mobil', signal: 'SELL', confidence: 69, reason: 'Crude oil price weakness below $80/bbl + institutional ESG rotation out of energy.', timeframe: '2W', targetPrice: 95.00, currentPrice: 104.56, model: 'LSTM', upside: -9.1 },
  ];
}

export function getStressTestScenarios() {
  return [
    { name: 'Deep Recession', impact: -24.5, techImpact: -32, cryptoImpact: -45, finImpact: -20, healthImpact: -8, energyImpact: -15, probability: 15, description: 'GDP contraction >2%, unemployment spike to 8%+' },
    { name: 'Rate Hike +200bp', impact: -12.8, techImpact: -18, cryptoImpact: -25, finImpact: -5, healthImpact: -4, energyImpact: 6, probability: 20, description: 'Fed emergency hike on persistent inflation' },
    { name: 'Inflation Spike', impact: -8.3, techImpact: -12, cryptoImpact: -15, finImpact: -8, healthImpact: 2, energyImpact: 12, probability: 25, description: 'CPI rebounds to 8%+ driven by supply shock' },
    { name: 'Bull Market Rally', impact: 28.4, techImpact: 35, cryptoImpact: 55, finImpact: 20, healthImpact: 12, energyImpact: 18, probability: 30, description: 'AI productivity boom + rate cuts materialize' },
    { name: 'Black Swan Event', impact: -38.2, techImpact: -42, cryptoImpact: -65, finImpact: -35, healthImpact: -20, energyImpact: -30, probability: 5, description: 'Systemic financial crisis / geopolitical shock' },
    { name: 'Crypto Winter', impact: -15.6, techImpact: -5, cryptoImpact: -70, finImpact: -2, healthImpact: 1, energyImpact: -1, probability: 10, description: 'Crypto regulatory crackdown + exchange failures' },
    { name: 'Tech Bubble Burst', impact: -19.4, techImpact: -38, cryptoImpact: -20, finImpact: -10, healthImpact: 5, energyImpact: 3, probability: 8, description: 'AI hype correction + rate normalization' },
  ];
}

export function getGlobalDistribution() {
  return [
    { region: 'North America', allocation: 72, value: 350810, change: 1.2 },
    { region: 'Decentralized', allocation: 20, value: 97447, change: -0.8 },
    { region: 'Europe', allocation: 5, value: 24362, change: 0.4 },
    { region: 'Asia Pacific', allocation: 3, value: 14617, change: 2.1 },
  ];
}

export function getRebalancingSuggestions() {
  return {
    riskScore: 78, riskLabel: 'HIGH',
    issues: [
      { severity: 'high', message: 'Technology concentration at 55% exceeds 40% threshold' },
      { severity: 'high', message: 'Crypto exposure at 20% — significantly above recommended 5-10%' },
      { severity: 'medium', message: 'Missing bond/fixed-income allocation for downside protection' },
      { severity: 'medium', message: 'BTC and ETH 0.88 correlation — reduces diversification benefit' },
      { severity: 'low', message: 'International equity exposure below 10% recommended minimum' },
    ],
    suggestions: [
      { action: 'REDUCE', symbol: 'NVDA', currentWeight: 22, targetWeight: 12, rationale: 'High P/E 72x at risk if AI capex growth decelerates', impact: '+0.18 Sharpe', urgency: 'High' as const },
      { action: 'REDUCE', symbol: 'BTC', currentWeight: 12, targetWeight: 6, rationale: 'Crypto winter scenario probability at 10%, outsized portfolio impact', impact: '-8.2% VaR', urgency: 'High' as const },
      { action: 'REDUCE', symbol: 'AAPL', currentWeight: 18, targetWeight: 14, rationale: 'Over-concentrated in single tech name, trim to fund diversification', impact: '+0.09 Sharpe', urgency: 'Medium' as const },
      { action: 'ADD', symbol: 'TLT', currentWeight: 0, targetWeight: 8, rationale: 'US 20Y Treasury bonds provide recession hedge and rate-cut upside', impact: '-12.3% Max DD', urgency: 'High' as const },
      { action: 'ADD', symbol: 'GLD', currentWeight: 0, targetWeight: 5, rationale: 'Gold as inflation hedge — low correlation to equities in crisis', impact: '-6.8% VaR', urgency: 'Medium' as const },
      { action: 'ADD', symbol: 'VEA', currentWeight: 0, targetWeight: 7, rationale: 'Developed market international ETF for geographic diversification', impact: '+0.12 Sharpe', urgency: 'Medium' as const },
      { action: 'ADD', symbol: 'XLV', currentWeight: 7, targetWeight: 10, rationale: 'Healthcare defensive — outperforms in recession, low beta 0.7', impact: '-4.1% Max DD', urgency: 'Low' as const },
    ],
    optimizedMetrics: { sharpe: 2.21, maxDrawdown: -12.8, var95: -3.1, volatility: 16.2, expectedReturn: 15.4 },
    currentMetrics: { sharpe: 1.84, maxDrawdown: -18.4, var95: -4.2, volatility: 22.5, expectedReturn: 18.7 },
  };
}

export function getPortfolioInsights() {
  return [
    { type: 'warning', title: 'Concentration Risk Alert', description: 'Tech sector at 55% is 15pp above recommended max. A sector-specific correction could cause outsized losses.', metric: '-32% scenario', action: 'Reduce Tech' },
    { type: 'info', title: 'Crypto Correlation', description: 'BTC and ETH move together 88% of the time. Holding both provides minimal diversification benefit.', metric: '0.88 correlation', action: 'Trim ETH' },
    { type: 'success', title: 'Strong Risk-Adjusted Returns', description: 'Sharpe ratio of 1.84 significantly outperforms the market average of 1.0. Portfolio efficiency is above average.', metric: '1.84 Sharpe', action: 'Maintain' },
    { type: 'warning', title: 'Missing Defensive Allocation', description: 'Zero bond or gold allocation means portfolio has no hedge against equity market drawdowns or inflation spikes.', metric: '0% bonds/gold', action: 'Add TLT + GLD' },
  ];
}
