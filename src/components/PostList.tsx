import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import { formatPostDate } from '../utils/date';
import { Trash2, Copy, Check, Terminal, Pin } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onDeletePost: (id: string) => Promise<void>;
}

export const PostList: React.FC<PostListProps> = ({ posts, onDeletePost }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCopy = (post: BlogPost) => {
    navigator.clipboard.writeText(post.content);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu girdiyi silmek istediğinizden emin misiniz?')) {
      setDeletingId(id);
      try {
        await onDeletePost(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-400 dark:text-neutral-600 font-light text-sm">
        Henüz bir girdi yok. Yukarıdan ilk düşünceni paylaşabilirsin.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {posts.map((post) => {
        const { fullFormatted } = formatPostDate(post.created_at);
        const isCopied = copiedId === post.id;
        const isDevLog = post.category === 'devlog';

        return (
          <article
            key={post.id}
            className="group py-7 border-t border-neutral-100 dark:border-neutral-800/70 transition-colors"
          >
            {/* Header: Date and Meta */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 font-code text-xs tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                <span>{fullFormatted}</span>
                {isDevLog && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] lowercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-normal">
                    <Terminal className="w-2.5 h-2.5" />
                    dev
                  </span>
                )}
                {post.pinned && (
                  <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />
                )}
              </div>

              {/* Hover Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500">
                <button
                  onClick={() => handleCopy(post)}
                  title="Metni Kopyala"
                  className="p-1 rounded hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  title="Girdiyi Sil"
                  className="p-1 rounded hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-neutral-800 dark:text-neutral-200 font-light text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </div>

            {/* Tags if any */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="font-code text-[11px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};
