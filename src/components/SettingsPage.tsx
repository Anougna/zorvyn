import React, { useState } from 'react';
import { Sun, Moon, Bell, Mail, Globe, Lock, Shield, Palette, Monitor, Eye, AlertTriangle, Save, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Currency } from '../types';

const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <button onClick={onToggle} className={cn("relative w-11 h-6 rounded-full transition-all duration-300", enabled ? "bg-primary" : "bg-outline-variant")}>
    <motion.div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      animate={{ left: enabled ? '24px' : '4px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
  </button>
);

const SettingRow: React.FC<{ icon: React.ElementType; title: string; desc: string; children: React.ReactNode }> = ({ icon: Icon, title, desc, children }) => (
  <div className="flex items-center justify-between py-5 border-b border-outline-variant/10 last:border-0 group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-surface-container-highest rounded-sm group-hover:bg-primary/10 transition-colors">
        <Icon className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface uppercase tracking-tight">{title}</p>
        <p className="text-[10px] text-outline tracking-widest uppercase mt-0.5">{desc}</p>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, role, currency, setCurrency } = useFinance();
  const [notif, setNotif] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [showBal, setShowBal] = useState(true);
  const [compact, setCompact] = useState(false);
  const [lang, setLang] = useState('en');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="mt-16 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-on-surface uppercase mb-4">System Configuration</h1>
          <p className="text-outline text-sm leading-relaxed max-w-lg font-light">Manage preferences, security protocols, and display configurations.</p>
        </div>
        <button onClick={handleSave} className={cn("px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-3",
          saved ? "bg-primary text-on-primary" : "bg-primary-container text-on-background hover:opacity-90 active:scale-95")}>
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Appearance</h3>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-4">Interface Theme</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {(['light', 'dark'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)} className={cn("p-4 border rounded-sm transition-all flex items-center gap-3",
                theme === t ? "border-primary bg-primary/10" : "border-outline-variant/20 hover:border-outline-variant/40")}>
                {t === 'light' ? <Sun className={cn("w-5 h-5", theme === t ? "text-primary" : "text-outline")} /> :
                  <Moon className={cn("w-5 h-5", theme === t ? "text-primary" : "text-outline")} />}
                <div className="text-left">
                  <p className={cn("text-xs font-bold uppercase", theme === t ? "text-primary" : "text-on-surface")}>{t}</p>
                  <p className="text-[10px] text-outline tracking-widest uppercase">{t === 'light' ? 'Daylight' : 'Stealth'} Protocol</p>
                </div>
                {theme === t && <Check className="w-4 h-4 text-primary ml-auto" />}
              </button>
            ))}
          </div>
          <SettingRow icon={Eye} title="Show Balances" desc="Display monetary values"><Toggle enabled={showBal} onToggle={() => setShowBal(!showBal)} /></SettingRow>
          <SettingRow icon={Monitor} title="Compact Mode" desc="Dense data view"><Toggle enabled={compact} onToggle={() => setCompact(!compact)} /></SettingRow>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Notifications</h3>
          </div>
          <SettingRow icon={Bell} title="Push Notifications" desc="Real-time transaction alerts"><Toggle enabled={notif} onToggle={() => setNotif(!notif)} /></SettingRow>
          <SettingRow icon={Mail} title="Email Alerts" desc="Daily digest and critical alerts"><Toggle enabled={emailAlerts} onToggle={() => setEmailAlerts(!emailAlerts)} /></SettingRow>
          <SettingRow icon={AlertTriangle} title="Security Alerts" desc="Breach detection (always on)"><Toggle enabled={true} onToggle={() => {}} /></SettingRow>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Security</h3>
          </div>
          <SettingRow icon={Lock} title="Two-Factor Auth" desc="OTP for sensitive operations"><Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} /></SettingRow>
          <SettingRow icon={Shield} title="Biometric Login" desc="Fingerprint or face recognition"><Toggle enabled={biometric} onToggle={() => setBiometric(!biometric)} /></SettingRow>
          {role === 'admin' && (
            <div className="mt-6 p-4 bg-error-container/10 border border-error/20 rounded-sm">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-error" /><span className="text-[10px] font-bold text-error uppercase tracking-widest">Danger Zone</span></div>
              <div className="flex gap-3 mt-3">
                <button className="px-4 py-2 text-[10px] font-bold text-error uppercase tracking-widest border border-error/30 hover:bg-error/10 transition-all">Revoke All Sessions</button>
                <button className="px-4 py-2 text-[10px] font-bold text-error uppercase tracking-widest border border-error/30 hover:bg-error/10 transition-all">Reset Security Keys</button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Localization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-surface-container-low p-8 border border-outline-variant/10 matte-grain">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">Localization</h3>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Language</p>
          <select value={lang} onChange={(e) => setLang(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/10 p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none mb-6">
            <option value="en">English (US)</option><option value="fr">French</option><option value="de">German</option><option value="ja">Japanese</option>
          </select>
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Base Currency</p>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full bg-surface-container-lowest border border-outline-variant/10 p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none mb-6">
            <option value="INR">INR — Indian Rupee</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option><option value="JPY">JPY — Japanese Yen</option><option value="CHF">CHF — Swiss Franc</option>
          </select>
          <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between">
            <div><p className="text-sm font-bold text-on-surface uppercase tracking-tight">Timezone</p><p className="text-[10px] text-outline tracking-widest uppercase mt-0.5">Auto-detected</p></div>
            <span className="text-xs font-mono text-primary tracking-tight">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
