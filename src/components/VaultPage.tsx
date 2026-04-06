import React, { useState, useEffect } from 'react';
import {
  Lock, Shield, Key, Eye, EyeOff, Copy, Check,
  Fingerprint, Globe, CreditCard, Building2,
  AlertTriangle, CheckCircle2, Clock, Plus, ArrowUpRight, Loader2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { cn, formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  fetchVaultAssets, fetchSecurityKeys, fetchSecurityLogs,
  VaultAssetData, SecurityKeyData, SecurityLogData
} from '../api/endpoints';

const ICON_MAP: Record<string, React.ElementType> = {
  'building': Building2,
  'globe': Globe,
  'shield': Shield,
  'credit-card': CreditCard,
};

const SecurityKey: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-outline-variant/10 last:border-0">
      <div className="flex items-center gap-3">
        <Key className="w-4 h-4 text-outline" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-outline">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-on-surface-variant tracking-tight">
          {revealed ? value : '••••••••••••••••'}
        </span>
        <button onClick={() => setRevealed(!revealed)}
          className="text-outline hover:text-on-surface transition-colors p-1.5 rounded-sm hover:bg-surface-container-low">
          {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button onClick={handleCopy}
          className="text-outline hover:text-primary transition-colors p-1.5 rounded-sm hover:bg-surface-container-low">
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-surface-container-low p-8 border border-outline-variant/10 h-40 rounded" />
      ))}
    </div>
    <div className="bg-surface-container-low p-8 border border-outline-variant/10 h-64 rounded" />
  </div>
);

export const VaultPage: React.FC = () => {
  const { role, currency } = useFinance();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // State for API data
  const [vaultAssets, setVaultAssets] = useState<VaultAssetData[]>([]);
  const [securityKeys, setSecurityKeys] = useState<SecurityKeyData[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLogData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all vault data from dummy API
  useEffect(() => {
    const loadVaultData = async () => {
      try {
        setLoading(true);
        const [assets, keys, logs] = await Promise.all([
          fetchVaultAssets(),
          fetchSecurityKeys(),
          fetchSecurityLogs(),
        ]);
        setVaultAssets(assets);
        setSecurityKeys(keys);
        setSecurityLogs(logs);
      } catch (error) {
        console.error('Failed to fetch vault data from API:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVaultData();
  }, []);

  const totalVaultValue = vaultAssets.reduce((a, b) => a + b.value, 0);
  const securedCount = vaultAssets.filter(a => a.status === 'secured').length;

  return (
    <motion.div
      key="vault"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mt-16 mb-12">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter text-on-surface uppercase mb-4">
              Sovereign Vault
            </h1>
            <p className="text-outline text-sm leading-relaxed max-w-lg font-light">
              Encrypted asset management and secure storage protocol.
              All vault entries are protected with multi-layer cryptographic shielding.
            </p>
          </div>
          {role === 'admin' && (
            <button className="bg-primary-container text-on-background px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 active:scale-95 transition-all flex items-center gap-3">
              <Plus className="w-4 h-4" />
              New Vault Entry
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Vault Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-sm">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">Total Vault Value</span>
              </div>
              <p className="text-4xl font-bold text-on-surface tracking-tighter mb-2">
                {formatCurrency(totalVaultValue, currency)}
              </p>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-primary font-bold tracking-widest uppercase">+3.8% this quarter</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-sm">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">Security Status</span>
              </div>
              <p className="text-4xl font-bold text-primary tracking-tighter mb-2">
                {securedCount}/{vaultAssets.length}
              </p>
              <span className="text-[10px] text-outline font-bold tracking-widest uppercase">Assets Fully Secured</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-sm">
                  <Fingerprint className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">Encryption Level</span>
              </div>
              <p className="text-4xl font-bold text-on-surface tracking-tighter mb-2">
                AES-256
              </p>
              <span className="text-[10px] text-outline font-bold tracking-widest uppercase">Military-Grade Protocol</span>
            </motion.div>
          </div>

          {/* Vault Assets Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-surface-container-low p-1 border border-outline-variant/5 mb-8"
          >
            <div className="p-6 pb-0">
              <h3 className="text-xl font-bold text-on-surface tracking-tighter uppercase mb-1">Vault Registry</h3>
              <p className="text-[10px] text-outline tracking-widest uppercase mb-6">Protected asset inventory</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="py-5 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase">Asset ID</th>
                    <th className="py-5 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase">Name</th>
                    <th className="py-5 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase">Type</th>
                    <th className="py-5 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase text-right">Value</th>
                    <th className="py-5 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase text-right">Change</th>
                    <th className="py-5 px-6 text-[10px] font-extrabold tracking-[0.3em] text-outline uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vaultAssets.map((asset, i) => {
                    const IconComponent = ICON_MAP[asset.iconType] || Shield;
                    return (
                      <motion.tr
                        key={asset.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                        className={cn(
                          "border-b border-outline-variant/15 hover:bg-surface-container-high transition-colors cursor-pointer group",
                          selectedAsset === asset.id && "bg-surface-container-high"
                        )}
                      >
                        <td className="py-5 px-6 text-xs font-mono tracking-tighter text-outline">{asset.id}</td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-surface-container-highest rounded-sm">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-bold tracking-tight uppercase text-on-surface">{asset.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="text-[10px] font-bold px-3 py-1 bg-surface-container-highest border border-outline-variant/20 uppercase tracking-widest text-on-surface-variant">
                            {asset.type}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right font-mono text-sm font-bold text-on-surface tracking-tighter">
                          {formatCurrency(asset.value, currency)}
                        </td>
                        <td className={cn("py-5 px-6 text-right font-mono text-sm font-bold tracking-tighter",
                          asset.change >= 0 ? "text-primary" : "text-error"
                        )}>
                          {asset.change >= 0 ? '+' : ''}{asset.change}%
                        </td>
                        <td className="py-5 px-6 text-center">
                          {asset.status === 'secured' && (
                            <div className="flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Secured</span>
                            </div>
                          )}
                          {asset.status === 'pending' && (
                            <div className="flex items-center justify-center gap-1.5">
                              <Clock className="w-4 h-4 text-tertiary" />
                              <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Pending</span>
                            </div>
                          )}
                          {asset.status === 'review' && (
                            <div className="flex items-center justify-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-outline" />
                              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Review</span>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Security Keys Panel */}
          {role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Access Keys</h3>
                </div>
                {securityKeys.map((key, i) => (
                  <SecurityKey key={i} label={key.label} value={key.value} />
                ))}
              </div>

              <div className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Security Log</h3>
                </div>
                <div className="space-y-4">
                  {securityLogs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full",
                          log.type === 'success' ? "bg-primary" :
                          log.type === 'warning' ? "bg-tertiary" : "bg-outline"
                        )} />
                        <span className="text-sm text-on-surface font-medium">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-outline uppercase tracking-widest font-mono">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};
