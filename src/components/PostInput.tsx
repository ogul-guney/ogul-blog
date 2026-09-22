import React, { useState, useRef, useEffect } from 'react';
import { PostCategory } from '../types/blog';
import { Terminal, BookOpen, Hash } from 'lucide-react';

interface PostInputProps {
  onAddPost: (content: string, category: PostCategory, tags: string[]) => Promise<void>;
  defaultCategory?: PostCategory;
}

export const PostInput: React.FC<PostInputProps> = ({
  onAddPost,
  defaultCategory = 'timeline'
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>(defaultCategory);
  const [tagsText, setTagsText] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(84, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  // Sync category if tab changes
  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const extractedTags = tagsText
        .split(/[\s,]+/)
        .map((t) => t.replace(/^#/, '').trim())
        .filter((t) => t.length > 0);

      await onAddPost(content, category, extractedTags);
      setContent('');
      setTagsText('');
      setShowTagInput(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = '84px';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // ⌘ + Enter or Ctrl + Enter submits
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full mb-12 group">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full bg-transparent border-0 border-b border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-600 text-lg sm:text-xl font-light focus:outline-none resize-none transition-all px-0 pb-3"
        />

        {/* Optional Tag Editor Row if active */}
        {showTagInput && (
          <div className="flex items-center gap-2 mt-2 mb-3">
            <span className="text-xs text-neutral-400 font-code">tags:</span>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g. react, design, thoughts"
              className="text-xs bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-700 dark:text-neutral-300 focus:outline-none w-64 font-code"
            />
          </div>
        )}

        {/* Bottom bar matching image */}
        <div className="flex items-center justify-between pt-3 text-xs sm:text-sm">
          {/* Left shortcuts & category pills */}
          <div className="flex items-center gap-3 select-none">
            <span className="font-code text-neutral-400 dark:text-neutral-500 text-xs">
              ⌘ + Enter
            </span>

            {/* Category switch */}
            <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-900/80 p-0.5 rounded-full border border-neutral-200/60 dark:border-neutral-800/60">
              <button
                type="button"
                onClick={() => setCategory('timeline')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-light transition-all flex items-center gap-1 ${
                  category === 'timeline'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setCategory('devlog')}
                className={`px-2.5 py-0.5 rounded-full text-xs font-light transition-all flex items-center gap-1 ${
                  category === 'devlog'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                <Terminal className="w-3 h-3" />
                Dev Log
              </button>
            </div>

            {/* Tag toggle */}
            <button
              type="button"
              onClick={() => setShowTagInput(!showTagInput)}
              title="Etiket ekle"
              className={`p-1 rounded-full text-xs transition-colors ${
                showTagInput || tagsText
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Post Button matching screenshot */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-normal tracking-wide transition-all select-none ${
              content.trim() && !isSubmitting
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 cursor-pointer shadow-2xs'
                : 'bg-neutral-100/60 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-600 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};
