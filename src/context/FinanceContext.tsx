import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Role, Theme, Currency } from '../types';
import { fetchTransactions, createTransaction, deleteTransactionAPI, updateTransactionAPI } from '../api/endpoints';

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  theme: Theme;
  currency: Currency;
  isLoading: boolean;
  setRole: (role: Role) => void;
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: Currency) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('zorvyn_role');
    return (saved as Role) || 'admin';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('zorvyn_theme');
    return (saved as Theme) || 'dark';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('zorvyn_currency');
    return (saved as Currency) || 'INR';
  });

  // Fetch transactions from dummy API on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTransactions();
        setTransactions(data as Transaction[]);
      } catch (error) {
        console.error('Failed to fetch transactions from API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Check for locally cached transactions first, but always fetch from API
    const cached = localStorage.getItem('zorvyn_transactions');
    if (cached) {
      setTransactions(JSON.parse(cached));
      setIsLoading(false);
    }

    loadTransactions();
  }, []);

  // Persist transactions to localStorage as cache
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('zorvyn_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('zorvyn_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('zorvyn_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zorvyn_currency', currency);
  }, [currency]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      // POST to dummy API
      const newTransaction = await createTransaction(transaction);
      setTransactions([newTransaction, ...transactions]);
    } catch (error) {
      console.error('Failed to create transaction via API:', error);
      // Fallback: add locally
      const fallback: Transaction = {
        ...transaction,
        id: `TRX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      };
      setTransactions([fallback, ...transactions]);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      // DELETE via dummy API
      await deleteTransactionAPI(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction via API:', error);
      // Fallback: delete locally anyway
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const updateTransaction = async (id: string, updated: Partial<Transaction>) => {
    try {
      // PATCH via dummy API
      await updateTransactionAPI(id, updated);
      setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    } catch (error) {
      console.error('Failed to update transaction via API:', error);
      // Fallback: update locally anyway
      setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        theme,
        currency,
        isLoading,
        setRole,
        setTheme,
        setCurrency,
        addTransaction,
        deleteTransaction,
        updateTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
