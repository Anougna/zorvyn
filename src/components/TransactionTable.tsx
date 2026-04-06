import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { cn, formatCurrency, getCurrencyLabel } from '../lib/utils';
import { TransactionType } from '../types';

export const TransactionTable: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const { transactions, role, deleteTransaction, currency } = useFinance();
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [transactions, searchQuery, filterType, sortField, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'zorvyn-ledger.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="mt-24">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h3 className="text-3xl font-bold text-on-surface tracking-tighter">Recent Ledger</h3>
          <p className="text-[10px] text-outline tracking-widest uppercase mt-1">Unfiltered Transactional Stream</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-surface-container-lowest p-1 rounded-sm border border-outline-variant/10">
            <button 
              onClick={() => setFilterType('all')}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all",
                filterType === 'all' ? "bg-primary-container text-on-background" : "text-outline hover:text-on-surface"
              )}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('income')}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all",
                filterType === 'income' ? "bg-primary-container text-on-background" : "text-outline hover:text-on-surface"
              )}
            >
              Income
            </button>
            <button 
              onClick={() => setFilterType('expense')}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all",
                filterType === 'expense' ? "bg-primary-container text-on-background" : "text-outline hover:text-on-surface"
              )}
            >
              Expense
            </button>
          </div>
          <button 
            onClick={exportData}
            className="px-4 py-1.5 text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-70 transition-opacity border border-primary/20"
          >
            EXPORT <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low p-1 relative overflow-hidden border border-outline-variant/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="py-6 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase">
                  <button onClick={() => toggleSort('date')} className="flex items-center gap-2 hover:text-on-surface">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-6 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase">
                  <button onClick={() => toggleSort('description')} className="flex items-center gap-2 hover:text-on-surface">
                    Description <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-6 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase">Category</th>
                <th className="py-6 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase">Type</th>
                <th className="py-6 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase text-right">
                  <button onClick={() => toggleSort('amount')} className="flex items-center gap-2 justify-end hover:text-on-surface w-full">
                    Amount <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-6 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase text-center w-20">Status</th>
                {role === 'admin' && <th className="py-6 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase text-center w-20">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-on-surface/90">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 7 : 6} className="py-12 text-center text-outline uppercase tracking-widest text-xs">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-outline-variant/15 hover:bg-surface-container-high transition-colors group">
                    <td className="py-6 px-6 text-xs font-mono tracking-tighter text-outline">
                      {new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight uppercase">{t.description}</span>
                        <span className="text-[10px] text-outline uppercase tracking-wider">Ref: #{t.id}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="text-[10px] font-bold px-3 py-1 bg-surface-container-highest border border-outline-variant/20 uppercase tracking-widest">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-1.5 h-1.5 rounded-full", t.type === 'income' ? "bg-primary" : "bg-error")}></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {t.type}
                        </span>
                      </div>
                    </td>
                    <td className={cn(
                      "py-6 px-6 text-right font-mono text-sm font-bold",
                      t.type === 'income' ? "text-primary" : "text-on-surface"
                    )}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount, currency).replace(/^[^\d]+/, '')} <span className="text-outline text-[10px]">{getCurrencyLabel(currency)}</span>
                    </td>
                    <td className="py-6 px-6 text-center">
                      {t.status === 'settled' && <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />}
                      {t.status === 'processing' && <Clock className="w-5 h-5 text-tertiary mx-auto" />}
                      {t.status === 'pending' && <AlertCircle className="w-5 h-5 text-outline mx-auto" />}
                    </td>
                    {role === 'admin' && (
                      <td className="py-6 px-6 text-center">
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="text-outline hover:text-error transition-colors p-2 rounded-full hover:bg-error/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
