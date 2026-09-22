import React from 'react';
import { ViewTab } from '../types/blog';
import { Moon, Sun, Download, Cloud } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  totalEntries: number;
  authorName: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCloudModal: () => void;
  onOpenExportModal: () => void;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  totalEntries,
  authorName,
  isDark,
  onToggleTheme,
  onOpenCloudModal,
  onOpenExportModal,
  isConnected
}) => {
  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'devlog', label: 'Dev Log' },
    { id: 'search', label: 'Search' },
    { id: 'archive', label: 'Archive' },
    { id: 'random', label: 'Random' },
  ];

  return (
    <header className="pt-10 pb-14 w-full flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      {/* Brand & Entry Count */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onSelectTab('timeline')}
          className="text-2xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity"
        >
          {authorName}
        </button>
        <span className="text-sm font-light text-neutral-400 dark:text-neutral-500">
          {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center gap-4 sm:gap-6 text-sm">
        <nav className="flex items-center gap-4 sm:gap-6 font-light">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`transition-colors relative py-1 ${
                  isActive
                    ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-neutral-900 dark:bg-neutral-100 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 border-l border-neutral-200 dark:border-neutral-800 pl-4">
          {/* Cloud Sync Status Trigger */}
          <button
            onClick={onOpenCloudModal}
            title={isConnected ? "Supabase Bağlı (Bulut Senkronize)" : "Bulut Ayarlarını Yapılandır"}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors relative rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Cloud className="w-4 h-4" />
            <span
              className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Export / Netlify ZIP Trigger */}
          <button
            onClick={onOpenExportModal}
            title="Netlify ZIP İndir / Dağıtıma Hazırla"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Açık Tema' : 'Karanlık Tema'}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
