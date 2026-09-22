import React, { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '../types/blog';
import { formatPostDate } from '../utils/date';
import { Sparkles, RefreshCw } from 'lucide-react';

interface RandomViewProps {
  posts: BlogPost[];
}

export const RandomView: React.FC<RandomViewProps> = ({ posts }) => {
  const [randomPost, setRandomPost] = useState<BlogPost | null>(null);

  const pickRandom = useCallback(() => {
    if (posts.length === 0) {
      setRandomPost(null);
      return;
    }
    const idx = Math.floor(Math.random() * posts.length);
    setRandomPost(posts[idx]);
  }, [posts]);

  useEffect(() => {
    pickRandom();
  }, [pickRandom]);

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-400 font-light text-sm">
        Rastgele görüntülenecek bir girdi henüz yok.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center pt-8 pb-16">
      <div className="flex items-center gap-2 text-xs font-code uppercase tracking-wider text-neutral-400 mb-8">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Rastgele Hatırlatma</span>
      </div>

      {randomPost && (
        <div className="w-full max-w-xl p-8 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-center relative mb-8">
          <div className="font-code text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-6">
            {formatPostDate(randomPost.created_at).fullFormatted}
          </div>
          <div className="text-xl sm:text-2xl font-light text-neutral-900 dark:text-neutral-100 leading-relaxed italic font-serif-quote">
            "{randomPost.content}"
          </div>
        </div>
      )}

      <button
        onClick={pickRandom}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Başka bir düşünce seç
      </button>
    </div>
  );
};
