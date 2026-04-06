import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { getCurrencySymbol, formatCurrency } from './lib/utils';
import { fetchPortfolioSummary, PortfolioSummaryData } from './api/endpoints';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SummaryCards } from './components/SummaryCards';
import { BalanceTrend, SpendingBreakdown } from './components/Charts';
import { TransactionTable } from './components/TransactionTable';
import { Insights } from './components/Insights';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AnalyticsPage } from './components/AnalyticsPage';
import { VaultPage } from './components/VaultPage';
import { SettingsPage } from './components/SettingsPage';
import { AdminProfile } from './components/AdminProfile';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DashboardContent: React.FC = () => {
  const { role, currency, isLoading } = useFinance();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummaryData | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  // Fetch portfolio summary from dummy API
  useEffect(() => {
    const loadPortfolioSummary = async () => {
      try {
        setPortfolioLoading(true);
        const data = await fetchPortfolioSummary();
        setPortfolioSummary(data);
      } catch (error) {
        console.error('Failed to fetch portfolio summary from API:', error);
      } finally {
        setPortfolioLoading(false);
      }
    };
    loadPortfolioSummary();
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TopBar onSearch={setSearchQuery} onProfileClick={() => setActiveTab('profile')} />

      <main className="ml-64 pt-16 min-h-screen px-12 pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-12 gap-12 mt-16 items-end mb-16">
                <div className="col-span-12 lg:col-span-8">
                  <p className="text-outline font-label text-[10px] tracking-[0.3em] uppercase mb-4">Current Aggregated Liquidity</p>
                  <div className="relative group">
                    {portfolioLoading ? (
                      <div className="h-24 w-96 bg-surface-container-low animate-pulse rounded" />
                    ) : (
                      <h2 className="text-7xl lg:text-8xl font-bold text-on-surface tracking-tighter leading-none mb-2">
                        {getCurrencySymbol(currency)}{portfolioSummary ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(portfolioSummary.totalBalance).replace(/^/, '').split('.')[0] : '0'}.<span className="text-outline text-4xl">{portfolioSummary ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(portfolioSummary.totalBalance).split('.')[1] || '00' : '00'}</span>
                      </h2>
                    )}
                    <div className="absolute -bottom-4 left-0 w-full h-24 opacity-20 pointer-events-none overflow-hidden">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                        <path d="M0 80 Q 50 20 100 60 T 200 40 T 300 90 T 400 30 T 500 70 T 600 50 T 700 80 T 800 20 T 900 60 T 1000 40" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 border-l border-outline-variant/20 pl-8">
                  <div>
                    <span className="text-[10px] text-outline tracking-widest uppercase block mb-1">Portfolio Velocity</span>
                    {portfolioLoading ? (
                      <div className="h-7 w-32 bg-surface-container-low animate-pulse rounded" />
                    ) : (
                      <span className="text-primary text-xl font-bold">{portfolioSummary?.portfolioVelocity} <span className="text-on-surface-variant text-xs font-normal ml-2">{portfolioSummary?.velocityPeriod}</span></span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-outline tracking-widest uppercase block mb-1">Last Reconciliation</span>
                    {portfolioLoading ? (
                      <div className="h-4 w-48 bg-surface-container-low animate-pulse rounded" />
                    ) : (
                      <span className="text-on-surface text-xs font-mono uppercase">{portfolioSummary?.lastReconciliation}</span>
                    )}
                  </div>
                </div>
              </div>

              <SummaryCards />

              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-12 lg:col-span-8">
                  <BalanceTrend />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <SpendingBreakdown />
                </div>
              </div>

              <Insights />
            </motion.div>
          )}

          {activeTab === 'ledger' && (
            <motion.div
              key="ledger"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-16">
                <div className="flex justify-between items-end mb-8">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl font-bold tracking-tighter text-on-surface uppercase mb-4">Sovereign Transactions</h1>
                    <p className="text-outline text-sm leading-relaxed max-w-lg font-light">
                      Real-time immutable ledger of architectural equity and digital asset movements. All entries are cryptographically signed and verified through the Zorvyn network.
                    </p>
                  </div>
                  {role === 'admin' && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-primary-container text-on-background px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 active:scale-95 transition-all flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-3" />
                      Add Transaction
                    </button>
                  )}
                </div>
                <TransactionTable searchQuery={searchQuery} />
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'vault' && <VaultPage />}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'profile' && <AdminProfile onBack={() => setActiveTab('portfolio')} />}
        </AnimatePresence>
      </main>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <footer className="fixed bottom-0 right-0 w-[calc(100%-16rem)] p-8 flex justify-between items-center border-t border-outline-variant/5 bg-background/80 backdrop-blur-md z-40">
        <div className="text-[10px] font-bold tracking-[0.4em] text-outline uppercase opacity-40">
          © MMXXIII Zorvyn. All Rights Reserved.
        </div>
        <div className="flex gap-8">
          <a className="text-[10px] font-bold tracking-widest text-outline uppercase hover:text-on-surface transition-colors" href="#">Manifesto</a>
          <a className="text-[10px] font-bold tracking-widest text-outline uppercase hover:text-on-surface transition-colors" href="#">Audit logs</a>
          <a className="text-[10px] font-bold tracking-widest text-outline uppercase hover:text-on-surface transition-colors" href="#">Legal</a>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
