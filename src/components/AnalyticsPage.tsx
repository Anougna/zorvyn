import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, DollarSign,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieIcon,
  Zap, Target, Shield, Layers
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, cn, getCurrencySymbol } from '../lib/utils';
import { motion } from 'motion/react';

const StatCard: React.FC<{
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: React.ElementType;
  delay?: number;
}> = ({ label, value, change, changeType, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-surface-container-low p-6 border border-outline-variant/10 matte-grain
               hover:bg-surface-container transition-all duration-300 group"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] text-outline tracking-[0.2em] uppercase font-semibold">{label}</span>
      <div className="p-2 bg-primary/10 rounded-sm">
        <Icon className="w-4 h-4 text-primary" />
      </div>
    </div>
    <p className="text-2xl font-bold text-on-surface tracking-tighter mb-1">{value}</p>
    <div className="flex items-center gap-1">
      {changeType === 'up' ? (
        <ArrowUpRight className="w-3 h-3 text-primary" />
      ) : (
        <ArrowDownRight className="w-3 h-3 text-error" />
      )}
      <span className={cn("text-[10px] font-bold tracking-widest uppercase",
        changeType === 'up' ? "text-primary" : "text-error"
      )}>{change}</span>
      <span className="text-[10px] text-outline tracking-widest uppercase ml-1">vs last month</span>
    </div>
  </motion.div>
);

export const AnalyticsPage: React.FC = () => {
  const { transactions, theme, currency } = useFinance();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#41484b' : '#bec8cb';
  const axisColor = isDark ? '#8b9295' : '#6f797c';
  const tooltipBg = isDark ? '#1b2122' : '#ffffff';
  const tooltipBorder = isDark ? '#41484b' : '#bec8cb';

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    const net = income - expenses;
    const avgTransaction = transactions.length > 0 ? (income + expenses) / transactions.length : 0;
    return { income, expenses, net, avgTransaction };
  }, [transactions]);

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, i) => {
      const monthTxns = transactions.filter(t => new Date(t.date).getMonth() === i);
      const income = monthTxns.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
      const expense = monthTxns.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
      return { month, income, expense, net: income - expense };
    });
  }, [transactions]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const categories: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      if (!categories[t.category]) categories[t.category] = { income: 0, expense: 0 };
      categories[t.category][t.type] += t.amount;
    });
    return Object.entries(categories).map(([name, data]) => ({
      name,
      income: data.income,
      expense: data.expense,
      total: data.income + data.expense,
    }));
  }, [transactions]);

  // Cumulative balance trend
  const balanceTrend = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc: any[], t) => {
        const last = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        const balance = t.type === 'income' ? last + t.amount : last - t.amount;
        acc.push({
          date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          balance,
          income: t.type === 'income' ? t.amount : 0,
          expense: t.type === 'expense' ? t.amount : 0,
        });
        return acc;
      }, []);
  }, [transactions]);

  // Status distribution
  const statusData = useMemo(() => {
    const settled = transactions.filter(t => t.status === 'settled').length;
    const processing = transactions.filter(t => t.status === 'processing').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    return [
      { name: 'Settled', value: settled, color: isDark ? '#a4cddb' : '#1f6070' },
      { name: 'Processing', value: processing, color: isDark ? '#d4c3ba' : '#5e504a' },
      { name: 'Pending', value: pending, color: isDark ? '#8b9295' : '#6f797c' },
    ];
  }, [transactions, isDark]);

  // Risk metrics for radar
  const riskData = useMemo(() => {
    const totalIncome = stats.income || 1;
    return [
      { metric: 'Liquidity', value: Math.min((stats.net / totalIncome) * 100, 100) },
      { metric: 'Diversification', value: Math.min(categoryData.length * 20, 100) },
      { metric: 'Velocity', value: Math.min(transactions.length * 12, 100) },
      { metric: 'Stability', value: Math.max(100 - (stats.expenses / totalIncome) * 100, 0) },
      { metric: 'Growth', value: Math.min((stats.income / (stats.expenses || 1)) * 30, 100) },
      { metric: 'Coverage', value: Math.min((statusData[0].value / (transactions.length || 1)) * 100, 100) },
    ];
  }, [stats, categoryData, transactions, statusData]);

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mt-16 mb-12">
        <h1 className="text-5xl font-bold tracking-tighter text-on-surface uppercase mb-4">
          Analytical Engine
        </h1>
        <p className="text-outline text-sm leading-relaxed max-w-lg font-light">
          Real-time financial intelligence derived from sovereign ledger data.
          All metrics are computed from your live transactional stream.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Net Revenue"
          value={formatCurrency(stats.net, currency)}
          change="+12.4%"
          changeType="up"
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          label="Gross Income"
          value={formatCurrency(stats.income, currency)}
          change="+8.2%"
          changeType="up"
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          label="Total Outflow"
          value={formatCurrency(stats.expenses, currency)}
          change="-3.1%"
          changeType="down"
          icon={TrendingDown}
          delay={0.2}
        />
        <StatCard
          label="Avg Transaction"
          value={formatCurrency(stats.avgTransaction, currency)}
          change="+5.7%"
          changeType="up"
          icon={Activity}
          delay={0.3}
        />
      </div>

      {/* Balance Trend + Status Distribution */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-8 bg-surface-container-low/50 p-8 border border-outline-variant/5 matte-grain"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Equity Flow Analysis</h3>
              <p className="text-[10px] text-outline tracking-widest mt-1 uppercase">Cumulative balance with income/expense overlay</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: isDark ? '#a4cddb' : '#1f6070' }}></div>
                <span className="text-[10px] text-outline uppercase tracking-widest">Balance</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTrend}>
                <defs>
                  <linearGradient id="colorBalanceAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#a4cddb' : '#1f6070'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isDark ? '#a4cddb' : '#1f6070'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.2} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={(val) => `${getCurrencySymbol(currency)}${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '4px' }}
                  itemStyle={{ color: isDark ? '#a4cddb' : '#1f6070', fontSize: '12px' }}
                  labelStyle={{ color: axisColor, fontSize: '10px', marginBottom: '4px' }}
                  formatter={(val: number) => [formatCurrency(val, currency), 'Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke={isDark ? '#a4cddb' : '#1f6070'}
                  fillOpacity={1} fill="url(#colorBalanceAnalytics)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 lg:col-span-4 bg-surface-container-low/50 p-8 border border-outline-variant/5 matte-grain"
        >
          <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight mb-2">Settlement Status</h3>
          <p className="text-[10px] text-outline tracking-widest uppercase mb-6">Transaction resolution state</p>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                  paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '4px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" align="center" iconType="circle"
                  formatter={(value) => <span className="text-[10px] text-outline uppercase tracking-widest font-semibold">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Monthly Income vs Expenses */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="col-span-12 lg:col-span-8 bg-surface-container-low/50 p-8 border border-outline-variant/5 matte-grain"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Monthly Revenue vs Expenditure</h3>
              <p className="text-[10px] text-outline tracking-widest mt-1 uppercase">Fiscal year comparative analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: isDark ? '#a4cddb' : '#1f6070' }}></div>
                <span className="text-[10px] text-outline uppercase tracking-widest">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: isDark ? '#d4c3ba' : '#5e504a' }}></div>
                <span className="text-[10px] text-outline uppercase tracking-widest">Expense</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} opacity={0.2} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false}
                  tickFormatter={(val) => `${getCurrencySymbol(currency)}${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '4px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ color: axisColor, fontSize: '10px', marginBottom: '4px' }}
                  formatter={(val: number) => [formatCurrency(val, currency)]}
                />
                <Bar dataKey="income" fill={isDark ? '#a4cddb' : '#1f6070'} radius={[2, 2, 0, 0]} />
                <Bar dataKey="expense" fill={isDark ? '#d4c3ba' : '#5e504a'} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-12 lg:col-span-4 bg-surface-container-low/50 p-8 border border-outline-variant/5 matte-grain"
        >
          <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight mb-2">Risk Matrix</h3>
          <p className="text-[10px] text-outline tracking-widest uppercase mb-6">Multi-axis portfolio assessment</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskData}>
                <PolarGrid stroke={gridColor} opacity={0.3} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: axisColor }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar dataKey="value" stroke={isDark ? '#a4cddb' : '#1f6070'}
                  fill={isDark ? '#a4cddb' : '#1f6070'} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-surface-container-low/50 p-8 border border-outline-variant/5 matte-grain mb-6"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Category Intelligence</h3>
            <p className="text-[10px] text-outline tracking-widest mt-1 uppercase">Breakdown by asset classification</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-sm">
            <Layers className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="space-y-4">
          {categoryData.map((cat, i) => {
            const maxTotal = Math.max(...categoryData.map(c => c.total));
            const percentage = maxTotal > 0 ? (cat.total / maxTotal) * 100 : 0;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="group"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-3 py-1 bg-surface-container-highest border border-outline-variant/20 uppercase tracking-widest text-on-surface-variant">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] text-outline uppercase tracking-widest block">Income</span>
                      <span className="text-sm font-bold text-primary tracking-tighter">{formatCurrency(cat.income, currency)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-outline uppercase tracking-widest block">Expense</span>
                      <span className="text-sm font-bold text-on-surface tracking-tighter">{formatCurrency(cat.expense, currency)}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
