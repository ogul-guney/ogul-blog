import React, { useState, useMemo } from 'react';
import { BlogPost } from '../types/blog';
import { Search as SearchIcon, X } from 'lucide-react';
import { PostList } from './PostList';

interface SearchViewProps {
  posts: BlogPost[];
  onDeletePost: (id: string) => Promise<void>;
}

export const SearchView: React.FC<SearchViewProps> = ({ posts, onDeletePost }) => {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts.filter((p) => {
      const matchContent = p.content.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      const matchCategory = p.category.toLowerCase().includes(q);
      return matchContent || matchTags || matchCategory;
    });
  }, [posts, query]);

  return (
    <div className="w-full flex flex-col pt-2 pb-12">
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yazılarda veya etiketlerde ara..."
          autoFocus
          className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all font-light"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {query.trim() === '' ? (
        <div className="py-16 text-center text-neutral-400 dark:text-neutral-600 font-light text-sm">
          Aramak istediğin kelimeyi veya etiketi yaz...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center text-neutral-400 dark:text-neutral-600 font-light text-sm">
          "{query}" ile eşleşen bir girdi bulunamadı.
        </div>
      ) : (
        <div>
          <div className="text-xs font-code text-neutral-400 uppercase tracking-wider mb-4">
            {filteredPosts.length} sonuç bulundu
          </div>
          <PostList posts={filteredPosts} onDeletePost={onDeletePost} />
        </div>
      )}
    </div>
  );
};
