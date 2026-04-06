import React from 'react';
import {
  LayoutDashboard,
  History,
  PieChart,
  Lock,
  Settings,
  ShieldCheck,
  Eye,
  LogOut
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 py-3 px-8 transition-all duration-200 group",
      active
        ? "bg-primary-container text-on-background border-l-4 border-primary"
        : "text-outline hover:text-on-surface hover:bg-surface-container-low"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-outline group-hover:text-on-surface")} />
    <span className="font-manrope text-sm tracking-tight leading-relaxed uppercase font-semibold">
      {label}
    </span>
  </button>
);

export const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { role, setRole } = useFinance();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-outline-variant/15 flex flex-col z-50">
      <div className="p-8 pb-12">
        <h1 className="text-xl font-bold tracking-tighter text-on-surface">Zorvyn</h1>
        <p className="font-manrope text-[10px] tracking-widest uppercase font-semibold text-outline mt-1">Architectural Finance</p>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarItem
          icon={LayoutDashboard}
          label="Portfolio"
          active={activeTab === 'portfolio'}
          onClick={() => setActiveTab('portfolio')}
        />
        <SidebarItem
          icon={PieChart}
          label="Analytics"
          active={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        />
        <SidebarItem
          icon={History}
          label="Ledger"
          active={activeTab === 'ledger'}
          onClick={() => setActiveTab('ledger')}
        />
        <SidebarItem
          icon={Lock}
          label="Vault"
          active={activeTab === 'vault'}
          onClick={() => setActiveTab('vault')}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </nav>

      <div className="p-8 mt-auto border-t border-outline-variant/10">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-3">Access Level</p>
          <div className="flex bg-surface-container-lowest p-1 rounded-sm border border-outline-variant/10">
            <button
              onClick={() => setRole('viewer')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all",
                role === 'viewer' ? "bg-surface-container-high text-on-surface shadow-inner" : "text-outline hover:text-on-surface"
              )}
            >
              <Eye className="w-3 h-3" />
              Viewer
            </button>
            <button
              onClick={() => setRole('admin')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all",
                role === 'admin' ? "bg-primary-container text-on-background shadow-inner" : "text-outline hover:text-on-surface"
              )}
            >
              <ShieldCheck className="w-3 h-3" />
              Admin
            </button>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-sm transition-all duration-200 cursor-pointer",
            activeTab === 'profile'
              ? "bg-primary-container border border-primary/20"
              : "bg-surface-container-low hover:bg-surface-container"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all">
            <img
              src="https://picsum.photos/seed/vault/100/100"
              alt="User"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-xs font-bold text-on-surface truncate uppercase">Anougna Routu</p>
            <p className="text-[10px] text-outline uppercase tracking-wider">Principal</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
