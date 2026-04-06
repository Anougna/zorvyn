import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../lib/utils';

export const BalanceTrend: React.FC = () => {
  const { transactions, currency } = useFinance();

  // Simple balance trend logic
  const data = transactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], t) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const newBalance = t.type === 'income' ? lastBalance + t.amount : lastBalance - t.amount;
      acc.push({
        date: t.date,
        balance: newBalance,
      });
      return acc;
    }, []);

  return (
    <div className="bg-surface-container-low/50 p-10 matte-grain border border-outline-variant/5">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Balance Structural Trend</h3>
          <p className="text-[10px] text-outline tracking-widest mt-1 uppercase">Fiscal Performance Over Time</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a4cddb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a4cddb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#41484b" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="#8b9295" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="#8b9295" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1b2122', border: '1px solid #41484b', borderRadius: '4px' }}
              itemStyle={{ color: '#a4cddb', fontSize: '12px' }}
              labelStyle={{ color: '#8b9295', fontSize: '10px', marginBottom: '4px' }}
              formatter={(val: number) => [formatCurrency(val, currency), 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#a4cddb" 
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const SpendingBreakdown: React.FC = () => {
  const { transactions, currency } = useFinance();

  const categoryTotals = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const COLORS = ['#a4cddb', '#d4c3ba', '#3c6470', '#50443e', '#8b9295'];

  return (
    <div className="bg-surface-container-low/50 p-10 matte-grain border border-outline-variant/5">
      <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight mb-8">Asset Breakdown</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1b2122', border: '1px solid #41484b', borderRadius: '4px' }}
              itemStyle={{ fontSize: '12px' }}
              formatter={(val: number) => [formatCurrency(val, currency), 'Spent']}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              formatter={(value) => <span className="text-[10px] text-outline uppercase tracking-widest font-semibold">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
