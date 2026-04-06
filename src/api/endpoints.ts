/**
 * API Endpoints
 * All data fetching functions that use the dummy API via json-server.
 * json-server must be running on port 5000.
 */

import type { Transaction } from '../types';

const API_BASE_URL = 'http://localhost:5000';

// ─── Transactions API ──────────────────────────────────────────────

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

export async function createTransaction(
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) throw new Error('Failed to create transaction');
  return response.json();
}

export async function deleteTransactionAPI(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete transaction');
}

export async function updateTransactionAPI(
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update transaction');
  return response.json();
}

// ─── Vault API ─────────────────────────────────────────────────────

export interface VaultAssetData {
  id: string;
  name: string;
  type: 'crypto' | 'fiat' | 'commodity' | 'real-estate';
  value: number;
  change: number;
  status: 'secured' | 'pending' | 'review';
  iconType: string;
  lastAccessed: string;
}

export async function fetchVaultAssets(): Promise<VaultAssetData[]> {
  const response = await fetch(`${API_BASE_URL}/vaultAssets`);
  if (!response.ok) throw new Error('Failed to fetch vault assets');
  return response.json();
}

export interface SecurityKeyData {
  label: string;
  value: string;
}

export async function fetchSecurityKeys(): Promise<SecurityKeyData[]> {
  const response = await fetch(`${API_BASE_URL}/securityKeys`);
  if (!response.ok) throw new Error('Failed to fetch security keys');
  return response.json();
}

export interface SecurityLogData {
  action: string;
  time: string;
  type: string;
}

export async function fetchSecurityLogs(): Promise<SecurityLogData[]> {
  const response = await fetch(`${API_BASE_URL}/securityLogs`);
  if (!response.ok) throw new Error('Failed to fetch security logs');
  return response.json();
}

// ─── Admin Profile API ─────────────────────────────────────────────

export interface AdminProfileData {
  name: string;
  avatar: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  established: string;
  verified: boolean;
}

export async function fetchAdminProfile(): Promise<AdminProfileData> {
  const response = await fetch(`${API_BASE_URL}/adminProfile`);
  if (!response.ok) throw new Error('Failed to fetch admin profile');
  return response.json();
}

export interface ActivityLogData {
  action: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

export async function fetchActivityLogs(): Promise<ActivityLogData[]> {
  const response = await fetch(`${API_BASE_URL}/activityLogs`);
  if (!response.ok) throw new Error('Failed to fetch activity logs');
  return response.json();
}

export async function fetchPermissions(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/permissions`);
  if (!response.ok) throw new Error('Failed to fetch permissions');
  return response.json();
}

// ─── Portfolio API ─────────────────────────────────────────────────

export interface PortfolioSummaryData {
  totalBalance: number;
  portfolioVelocity: string;
  velocityPeriod: string;
  lastReconciliation: string;
}

export async function fetchPortfolioSummary(): Promise<PortfolioSummaryData> {
  const response = await fetch(`${API_BASE_URL}/portfolioSummary`);
  if (!response.ok) throw new Error('Failed to fetch portfolio summary');
  return response.json();
}
