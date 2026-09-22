import React from 'react';
import { SyncStatus } from '../types/blog';

interface FooterProps {
  authorHandle: string;
  quote: string;
  syncStatus: SyncStatus;
  onOpenCloudModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  authorHandle,
  quote,
  syncStatus,
  onOpenCloudModal
}) => {
  const getStatusText = () => {
    switch (syncStatus) {
      case 'connected':
        return 'Supabase Connected';
      case 'connecting':
        return 'Connecting to Cloud...';
      case 'error':
        return 'Cloud Sync Warning';
      case 'offline':
      default:
        return 'Local Mode (Click to Connect Cloud)';
    }
  };

  return (
    <footer className="pt-24 pb-16 w-full flex flex-col items-center justify-center text-center select-none">
      {/* Centered subtle dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 mb-6" />

      {/* Quote matching screenshot: "And then, there was light." */}
      <p className="text-sm sm:text-base font-light font-serif-quote italic text-neutral-400 dark:text-neutral-500 mb-16 tracking-wide">
        {quote}
      </p>

      {/* Status Bar matching screenshot: "ogulguney · Supabase Connected" */}
      <div className="flex items-center gap-2 text-xs font-light text-neutral-400 dark:text-neutral-500">
        <span>{authorHandle}</span>
        <span>·</span>
        <button
          onClick={onOpenCloudModal}
          className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors inline-flex items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              syncStatus === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : syncStatus === 'error'
                ? 'bg-amber-400'
                : 'bg-neutral-400'
            }`}
          />
          <span className="group-hover:underline underline-offset-4">
            {getStatusText()}
          </span>
        </button>
      </div>
    </footer>
  );
};
