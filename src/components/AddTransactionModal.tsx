import React, { useState } from 'react';
import { X, Plus, DollarSign, Calendar, Tag, Type } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType } from '../types';
import { cn } from '../lib/utils';

export const AddTransactionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addTransaction, role } = useFinance();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || role !== 'admin') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    addTransaction({
      description,
      amount: parseFloat(amount),
      category,
      type,
      date,
      status: 'settled',
    });

    setDescription('');
    setAmount('');
    setCategory('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface-container-low border border-outline-variant/20 w-full max-w-md p-8 matte-grain shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold tracking-tighter uppercase text-on-surface">New Transaction</h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Description</label>
            <div className="relative">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. Global Equities Buy"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/10 p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g. Dividend, Service, Equity"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Transaction Type</label>
            <div className="flex bg-surface-container-lowest p-1 rounded-sm border border-outline-variant/10">
              <button
                type="button"
                onClick={() => setType('income')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold tracking-widest uppercase transition-all",
                  type === 'income' ? "bg-primary-container text-on-background" : "text-outline hover:text-on-surface"
                )}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold tracking-widest uppercase transition-all",
                  type === 'expense' ? "bg-primary-container text-on-background" : "text-outline hover:text-on-surface"
                )}
              >
                Expense
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-on-primary py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:brightness-110 transition-all mt-4"
          >
            COMMIT TO LEDGER
          </button>
        </form>
      </div>
    </div>
  );
};
