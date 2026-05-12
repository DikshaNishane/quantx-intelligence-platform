/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import CommandCenter from '@/pages/CommandCenter';
import QuantLab from '@/pages/QuantLab';
import Forecasting from '@/pages/Forecasting';
import Signals from '@/pages/Signals';
import MarketPulse from '@/pages/MarketPulse';
import Copilot from '@/pages/Copilot';
import Rebalancer from '@/pages/Rebalancer';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/quant-lab" element={<QuantLab />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/market-pulse" element={<MarketPulse />} />
            <Route path="/rebalancer" element={<Rebalancer />} />
            <Route path="/copilot" element={<Copilot />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

