import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Shield, Calendar, Activity, TrendingUp, Clock, Edit3, LogOut, Loader2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import {
  fetchAdminProfile, fetchActivityLogs, fetchPermissions,
  AdminProfileData, ActivityLogData
} from '../api/endpoints';

const CONTACT_ICONS: Record<string, React.ElementType> = {
  'Email': Mail,
  'Direct Line': Phone,
  'Jurisdiction': MapPin,
  'Established': Calendar,
};

export const AdminProfile: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { transactions, role } = useFinance();
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  // State for API data
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLogData[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all profile data from dummy API
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, activityData, permData] = await Promise.all([
          fetchAdminProfile(),
          fetchActivityLogs(),
          fetchPermissions(),
        ]);
        setProfile(profileData);
        setActivityLogs(activityData);
        setPermissions(permData);
      } catch (error) {
        console.error('Failed to fetch profile data from API:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const contactItems = profile ? [
    { label: 'Email', value: profile.email },
    { label: 'Direct Line', value: profile.phone },
    { label: 'Jurisdiction', value: profile.location },
    { label: 'Established', value: profile.established },
  ] : [];

  return (
    <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="mt-16 mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-outline hover:text-on-surface transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
        </button>
        <h1 className="text-5xl font-bold tracking-tighter text-on-surface uppercase mb-4">Principal Profile</h1>
        <p className="text-outline text-sm leading-relaxed max-w-lg font-light">Administrative identity and operational metrics for the sovereign account holder.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-[10px] text-outline uppercase tracking-widest font-bold">Loading profile data from API...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-primary/30 flex items-center justify-center overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                <img src={profile?.avatar} alt={profile?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-2xl font-bold text-on-surface tracking-tighter uppercase mb-1">{profile?.name}</h2>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-4">{profile?.role} • {role === 'admin' ? 'Administrator' : 'Viewer'}</p>
              {profile?.verified && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-sm">
                  <Shield className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Verified Entity</span>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t border-outline-variant/10 pt-6">
              {contactItems.map((item, i) => {
                const Icon = CONTACT_ICONS[item.label] || Mail;
                return (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <Icon className="w-4 h-4 text-outline" />
                    <div>
                      <p className="text-[10px] text-outline uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-medium text-on-surface">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant/10 flex gap-3">
              <button className="flex-1 px-4 py-3 text-[10px] font-bold text-on-surface uppercase tracking-widest border border-outline-variant/20 hover:bg-surface-container transition-all flex items-center justify-center gap-2">
                <Edit3 className="w-3 h-3" /> Edit
              </button>
              <button className="flex-1 px-4 py-3 text-[10px] font-bold text-error uppercase tracking-widest border border-error/20 hover:bg-error/10 transition-all flex items-center justify-center gap-2">
                <LogOut className="w-3 h-3" /> Sign Out
              </button>
            </div>
          </motion.div>

          {/* Stats + Activity */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Performance Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Managed', value: formatCurrency(totalIncome + totalExpenses), icon: Activity, sub: `${transactions.length} transactions` },
                { label: 'Net Revenue', value: formatCurrency(totalIncome - totalExpenses), icon: TrendingUp, sub: 'Lifetime balance' },
                { label: 'Active Since', value: '1,847', icon: Clock, sub: 'Days operational' },
              ].map((stat, i) => (
                <div key={i} className="bg-surface-container-low p-6 border border-outline-variant/10 matte-grain">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-primary/10 rounded-sm"><stat.icon className="w-4 h-4 text-primary" /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-on-surface tracking-tighter mb-1">{stat.value}</p>
                  <p className="text-[10px] text-outline uppercase tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </motion.div>

            {/* Recent Activity - fetched from API */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
              <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight mb-6">Recent Activity</h3>
              <div className="space-y-0">
                {activityLogs.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                    className="flex items-center justify-between py-4 border-b border-outline-variant/10 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-primary' : item.type === 'warning' ? 'bg-tertiary' : 'bg-outline'}`} />
                      <span className="text-sm text-on-surface">{item.action}</span>
                    </div>
                    <span className="text-[10px] text-outline uppercase tracking-widest font-mono whitespace-nowrap ml-4">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Permissions - fetched from API */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
              <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight mb-6">Access Permissions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {permissions.map((perm, i) => (
                  <div key={i} className="p-3 bg-surface-container-highest border border-outline-variant/10 rounded-sm flex items-center gap-2">
                    <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{perm}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
