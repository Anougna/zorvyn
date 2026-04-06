import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency, CURRENCY_CONFIG } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency = 'INR') {
  const config = CURRENCY_CONFIG[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getCurrencySymbol(currency: Currency = 'INR') {
  return CURRENCY_CONFIG[currency].symbol;
}

export function getCurrencyLabel(currency: Currency = 'INR') {
  return CURRENCY_CONFIG[currency].label;
}
