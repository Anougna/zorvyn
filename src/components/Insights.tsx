import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../lib/utils';

export const Insights: React.FC = () => {
  const { transactions, currency } = useFinance();

  const expenses = transactions.filter((t) => t.type === 'expense');
  const income = transactions.filter((t) => t.type === 'income');

  const categoryTotals = expenses.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const highestCategory = Object.entries(categoryTotals).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

  const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
      <div className="bg-surface-container-low p-8 matte-grain border border-outline-variant/10 flex flex-col justify-between">
        <div>
          <Lightbulb className="text-primary w-6 h-6 mb-6" />
          <h3 className="text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase mb-4">Peak Allocation</h3>
          <p className="text-lg font-bold tracking-tighter text-on-surface uppercase">
            {highestCategory ? highestCategory[0] : 'N/A'}
          </p>
        </div>
        <p className="text-[10px] text-outline tracking-widest uppercase font-mono mt-4">
          {highestCategory ? formatCurrency(highestCategory[1] as number, currency) : '$0.00'} Total
        </p>
      </div>

      <div className="bg-surface-container-low p-8 matte-grain border border-outline-variant/10 flex flex-col justify-between">
        <div>
          <Target className="text-primary w-6 h-6 mb-6" />
          <h3 className="text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase mb-4">Savings Velocity</h3>
          <p className="text-lg font-bold tracking-tighter text-on-surface uppercase">
            {savingsRate.toFixed(1)}%
          </p>
        </div>
        <p className="text-[10px] text-outline tracking-widest uppercase font-mono mt-4">
          {savingsRate > 20 ? 'OPTIMAL' : 'BELOW TARGET'}
        </p>
      </div>

      <div className="bg-surface-container-low p-8 matte-grain border border-outline-variant/10 flex flex-col justify-between">
        <div>
          <TrendingUp className="text-primary w-6 h-6 mb-6" />
          <h3 className="text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase mb-4">Monthly Delta</h3>
          <p className="text-lg font-bold tracking-tighter text-on-surface uppercase">
            {formatCurrency(totalIncome - totalExpenses, currency)}
          </p>
        </div>
        <p className="text-[10px] text-outline tracking-widest uppercase font-mono mt-4">
          Net Periodic Change
        </p>
      </div>

      <div className="bg-surface-container-low p-8 matte-grain border border-outline-variant/10 flex flex-col justify-between">
        <div>
          <AlertTriangle className="text-tertiary w-6 h-6 mb-6" />
          <h3 className="text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase mb-4">Risk Exposure</h3>
          <p className="text-lg font-bold tracking-tighter text-on-surface uppercase">
            {(totalExpenses / (totalIncome || 1) * 100).toFixed(1)}%
          </p>
        </div>
        <p className="text-[10px] text-outline tracking-widest uppercase font-mono mt-4">
          Expense to Income Ratio
        </p>
      </div>
    </div>
  );
};
