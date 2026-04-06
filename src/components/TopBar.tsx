import React from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { cn } from '../lib/utils';

export const TopBar: React.FC<{ onSearch: (query: string) => void; onProfileClick?: () => void }> = ({ onSearch, onProfileClick }) => {
  const { theme, setTheme } = useFinance();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant/15 flex justify-between items-center px-12 z-40">
      <div className="flex items-center gap-4 text-outline focus-within:text-primary transition-colors">
        <Search className="w-4 h-4" />
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-[10px] font-medium tracking-[0.2em] uppercase placeholder:text-outline/50 w-64 outline-none"
          placeholder="QUERY LEDGER..."
        />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-outline hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-low"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="text-outline hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-low">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={onProfileClick}
            className="text-outline hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-low"
            title="View profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
        <div className="h-4 w-px bg-outline-variant/30"></div>
        <div className="text-[10px] font-bold text-on-surface tracking-widest">
          VERIFIED STATUS: <span className="text-primary">ACTIVE</span>
        </div>
      </div>
    </header>
  );
};
