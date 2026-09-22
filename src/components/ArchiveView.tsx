import React, { useMemo, useState } from 'react';
import { BlogPost } from '../types/blog';
import { PostList } from './PostList';
import { Calendar, ChevronDown, ChevronRight } from 'lucide-react';

interface ArchiveViewProps {
  posts: BlogPost[];
  onDeletePost: (id: string) => Promise<void>;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ posts, onDeletePost }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Group by Year and Month
  const grouped = useMemo(() => {
    const groups: { [key: string]: { label: string; year: number; month: number; posts: BlogPost[] } } = {};

    posts.forEach((post) => {
      const d = new Date(post.created_at);
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      const key = `${year}-${String(month).padStart(2, '0')}`;
      const label = `${monthNames[month]} ${year}`;

      if (!groups[key]) {
        groups[key] = { label, year, month, posts: [] };
      }
      groups[key].posts.push(post);
    });

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [posts]);

  return (
    <div className="w-full flex flex-col pt-2 pb-12">
      <div className="flex items-center gap-2 mb-6 text-xs font-code uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        <Calendar className="w-3.5 h-3.5" />
        <span>Arşiv · {posts.length} toplam girdi</span>
      </div>

      <div className="space-y-4">
        {grouped.map(([key, group]) => {
          const isExpanded = selectedGroup === key;

          return (
            <div
              key={key}
              className="border border-neutral-100 dark:border-neutral-800/80 rounded-xl overflow-hidden bg-neutral-50/40 dark:bg-neutral-900/30 transition-all"
            >
              <button
                onClick={() => setSelectedGroup(isExpanded ? null : key)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  )}
                  <span className="font-normal text-neutral-800 dark:text-neutral-200 text-base">
                    {group.label}
                  </span>
                </div>
                <span className="text-xs font-code text-neutral-400 dark:text-neutral-500">
                  {group.posts.length} {group.posts.length === 1 ? 'yazı' : 'yazı'}
                </span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 pt-1 bg-white dark:bg-[#0c0d0e] border-t border-neutral-100 dark:border-neutral-800/80">
                  <PostList posts={group.posts} onDeletePost={onDeletePost} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
