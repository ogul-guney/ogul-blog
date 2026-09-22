/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BlogPost, CloudConfig, PostCategory, SyncStatus, ViewTab } from './types/blog';
import {
  createPostInCloud,
  deletePostFromCloud,
  fetchAllPosts,
  getStoredConfig,
  getSupabaseClient,
  saveStoredConfig
} from './services/supabase';
import { Header } from './components/Header';
import { PostInput } from './components/PostInput';
import { PostList } from './components/PostList';
import { SearchView } from './components/SearchView';
import { ArchiveView } from './components/ArchiveView';
import { RandomView } from './components/RandomView';
import { Footer } from './components/Footer';
import { CloudSyncModal } from './components/CloudSyncModal';
import { ExportNetlifyModal } from './components/ExportNetlifyModal';

export default function App() {
  const [config, setConfig] = useState<CloudConfig>(() => {
    const stored = getStoredConfig();
    return {
      ...stored,
      authorName: stored.authorName || 'Oğulr',
      authorHandle: stored.authorHandle || 'ogulguney',
      quote: stored.quote || 'And then, there was light.'
    };
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentTab, setCurrentTab] = useState<ViewTab>('timeline');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('connecting');
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dark mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ogul_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ogul_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ogul_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Fetch posts and sync
  const loadPosts = useCallback(async () => {
    setSyncStatus('connecting');
    try {
      const { posts: fetchedPosts, status } = await fetchAllPosts();
      setPosts(fetchedPosts);
      setSyncStatus(status);
    } catch {
      setSyncStatus('offline');
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Real-time Supabase listener
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'posts'
          },
          () => {
            // Live update whenever another device or user posts/edits
            loadPosts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime subscription could not be established:', e);
    }
  }, [config.supabaseUrl, config.supabaseAnonKey, loadPosts]);

  // Handle post creation
  const handleAddPost = async (
    content: string,
    category: PostCategory,
    tags: string[]
  ) => {
    const { post, status } = await createPostInCloud(content, category, tags);
    setPosts((prev) => [post, ...prev]);
    if (status === 'connected') {
      setSyncStatus('connected');
    }
  };

  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    await deletePostFromCloud(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Save new configuration
  const handleSaveConfig = async (newConfig: CloudConfig) => {
    saveStoredConfig(newConfig);
    setConfig(newConfig);
    await loadPosts();
  };

  // Filter posts based on current view tab
  const displayedPosts = useMemo(() => {
    if (currentTab === 'devlog') {
      return posts.filter((p) => p.category === 'devlog');
    }
    // Timeline shows all posts, or timeline-specific posts
    return posts;
  }, [posts, currentTab]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0d0e] text-neutral-800 dark:text-neutral-200 transition-colors flex flex-col justify-between selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Centered container with ample whitespace matching design */}
      <div className="w-full max-w-[680px] mx-auto px-5 sm:px-6 flex-1 flex flex-col">
        {/* Minimal Navigation Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          totalEntries={posts.length}
          authorName={config.authorName}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenCloudModal={() => setIsCloudModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          isConnected={syncStatus === 'connected'}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {currentTab === 'timeline' && (
            <>
              <PostInput
                onAddPost={handleAddPost}
                defaultCategory="timeline"
              />
              <PostList
                posts={displayedPosts}
                onDeletePost={handleDeletePost}
              />
            </>
          )}

          {currentTab === 'devlog' && (
            <>
              <PostInput
                onAddPost={handleAddPost}
                defaultCategory="devlog"
              />
              <PostList
                posts={displayedPosts}
                onDeletePost={handleDeletePost}
              />
            </>
          )}

          {currentTab === 'search' && (
            <SearchView
              posts={posts}
              onDeletePost={handleDeletePost}
            />
          )}

          {currentTab === 'archive' && (
            <ArchiveView
              posts={posts}
              onDeletePost={handleDeletePost}
            />
          )}

          {currentTab === 'random' && (
            <RandomView posts={posts} />
          )}
        </main>

        {/* Minimal Footer */}
        <Footer
          authorHandle={config.authorHandle}
          quote={config.quote}
          syncStatus={syncStatus}
          onOpenCloudModal={() => setIsCloudModalOpen(true)}
        />
      </div>

      {/* Cloud Settings Modal */}
      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        config={config}
        syncStatus={syncStatus}
        onSaveConfig={handleSaveConfig}
        onForceSync={loadPosts}
      />

      {/* Netlify Export & Deployment Modal */}
      <ExportNetlifyModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
