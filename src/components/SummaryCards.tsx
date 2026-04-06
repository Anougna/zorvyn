import React from 'react';
import { TrendingUp, TrendingDown, Minus, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../lib/utils';

interface SummaryCardProps {
  label: string;
  value: number;
  formattedValue: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, formattedValue, icon: Icon, trend, color }) => (
  <div className="bg-surface-container-low p-8 matte-grain group hover:bg-surface-container transition-all duration-300 border border-outline-variant/5">
    <div className="flex justify-between items-start mb-6">
      <span className="text-[10px] text-outline tracking-[0.2em] uppercase font-semibold">{label}</span>
      <Icon className={cn("w-4 h-4", color ? color : "text-outline")} />
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-on-surface tracking-tighter">{formattedValue}</span>
      {trend === 'up' && <TrendingUp className="text-primary w-4 h-4 mb-1" />}
      {trend === 'down' && <TrendingDown className="text-error w-4 h-4 mb-1" />}
      {trend === 'neutral' && <Minus className="text-outline w-4 h-4 mb-1" />}
    </div>
  </div>
);

import { cn } from '../lib/utils';

export const SummaryCards: React.FC = () => {
  const { transactions, currency } = useFinance();

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      <SummaryCard 
        label="Total Liquidity" 
        value={balance} 
        formattedValue={formatCurrency(balance, currency)}
        icon={Wallet} 
        trend={balance >= 0 ? 'up' : 'down'}
        color="text-primary"
      />
      <SummaryCard 
        label="Monthly Income" 
        value={income} 
        formattedValue={formatCurrency(income, currency)}
        icon={ArrowUpRight} 
        trend="up"
        color="text-primary"
      />
      <SummaryCard 
        label="Fixed Expenses" 
        value={expenses} 
        formattedValue={formatCurrency(expenses, currency)}
        icon={ArrowDownLeft} 
        trend="down"
        color="text-error"
      />
    </div>
  );
};
