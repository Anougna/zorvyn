export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  status: 'settled' | 'processing' | 'pending';
}

export type Role = 'viewer' | 'admin';
export type Theme = 'light' | 'dark';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF';

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string; label: string }> = {
  INR: { symbol: '₹', locale: 'en-IN', label: 'INR' },
  USD: { symbol: '$', locale: 'en-US', label: 'USD' },
  EUR: { symbol: '€', locale: 'de-DE', label: 'EUR' },
  GBP: { symbol: '£', locale: 'en-GB', label: 'GBP' },
  JPY: { symbol: '¥', locale: 'ja-JP', label: 'JPY' },
  CHF: { symbol: 'CHF', locale: 'de-CH', label: 'CHF' },
};
