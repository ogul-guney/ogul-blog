import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BlogPost, CloudConfig, SyncStatus } from '../types/blog';

// Default initial posts matching the user's design image
export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    content: 'deneme postu',
    created_at: '2026-09-22T15:03:00.000Z',
    category: 'timeline',
    author_name: 'Oğul Güney'
  },
  {
    id: 'post-2',
    content: 'Hello, World!',
    created_at: '2026-09-21T23:15:00.000Z',
    category: 'timeline',
    author_name: 'Oğul Güney'
  }
];

const STORAGE_KEYS = {
  POSTS: 'ogul_blog_posts_v1',
  CONFIG: 'ogul_blog_config_v1'
};

export const DEFAULT_CONFIG: CloudConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  authorName: 'Oğul',
  authorHandle: 'ogulguney',
  quote: 'And then, there was light.'
};

let cachedClient: SupabaseClient | null = null;
let currentConfig: CloudConfig = getStoredConfig();

export function getStoredConfig(): CloudConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to read config from localStorage', e);
  }
  return DEFAULT_CONFIG;
}

export function saveStoredConfig(config: CloudConfig): void {
  currentConfig = config;
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save config', e);
  }
  // Reset cached client
  cachedClient = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const url = currentConfig.supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
  const key = currentConfig.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (url && key && url.startsWith('https://')) {
    try {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return cachedClient;
    } catch (err) {
      console.error('Supabase initialization failed:', err);
      return null;
    }
  }
  return null;
}

// Local storage fallback helpers
export function getLocalPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load local posts', e);
  }
  return INITIAL_POSTS;
}

export function saveLocalPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.warn('Failed to save local posts', e);
  }
}

// Database Service API
export async function fetchAllPosts(): Promise<{ posts: BlogPost[]; status: SyncStatus; error?: string }> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    // Cloud sync not configured yet: load from local storage
    return {
      posts: getLocalPosts(),
      status: 'offline'
    };
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, using local data:', error.message);
      return {
        posts: getLocalPosts(),
        status: 'error',
        error: error.message
      };
    }

    if (data && data.length > 0) {
      const formatted: BlogPost[] = data.map((item) => ({
        id: String(item.id),
        content: item.content || '',
        created_at: item.created_at || new Date().toISOString(),
        category: item.category === 'devlog' ? 'devlog' : 'timeline',
        pinned: !!item.pinned,
        tags: Array.isArray(item.tags) ? item.tags : [],
        user_id: item.user_id,
        author_name: item.author_name || currentConfig.authorName
      }));
      // Also cache locally for offline access
      saveLocalPosts(formatted);
      return { posts: formatted, status: 'connected' };
    } else {
      // Empty table in Supabase; check if we should push initial posts
      const local = getLocalPosts();
      return { posts: local, status: 'connected' };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      posts: getLocalPosts(),
      status: 'error',
      error: msg
    };
  }
}

export async function createPostInCloud(
  content: string,
  category: 'timeline' | 'devlog' = 'timeline',
  tags: string[] = []
): Promise<{ post: BlogPost; status: SyncStatus }> {
  const newPost: BlogPost = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'post-' + Date.now(),
    content: content.trim(),
    created_at: new Date().toISOString(),
    category,
    tags,
    author_name: currentConfig.authorName
  };

  // Always update local storage first for snappy optimistic UI
  const localPosts = getLocalPosts();
  const updated = [newPost, ...localPosts];
  saveLocalPosts(updated);

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { post: newPost, status: 'offline' };
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;

    const { data, error } = await supabase
      .from('posts')
      .insert({
        id: newPost.id,
        content: newPost.content,
        category: newPost.category,
        tags: newPost.tags,
        author_name: newPost.author_name,
        created_at: newPost.created_at,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.warn('Could not insert to Supabase, stored locally:', error.message);
      return { post: newPost, status: 'error' };
    }

    if (data) {
      const savedPost: BlogPost = {
        ...newPost,
        id: String(data.id),
        created_at: data.created_at
      };
      return { post: savedPost, status: 'connected' };
    }

    return { post: newPost, status: 'connected' };
  } catch (e) {
    console.error('Error creating post in cloud:', e);
    return { post: newPost, status: 'error' };
  }
}

export async function deletePostFromCloud(id: string): Promise<boolean> {
  // Update local
  const local = getLocalPosts().filter((p) => p.id !== id);
  saveLocalPosts(local);

  const supabase = getSupabaseClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      console.warn('Could not delete from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to delete post:', e);
    return false;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  } catch {
    return null;
  }
}

export const SUPABASE_SQL_SCHEMA = `-- Supabase SQL Schema for Oğul Personal Blog
-- Run this in your Supabase SQL Editor (takes ~5 seconds):

create table if not exists public.posts (
  id text primary key,
  content text not null,
  category text not null default 'timeline',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  pinned boolean default false,
  tags text[] default '{}',
  author_name text default 'Oğul',
  user_id uuid references auth.users(id) on delete set null
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- Public read access so visitors can read your blog posts
create policy "Allow public read access"
  on public.posts for select
  using (true);

-- Allow authenticated or public insert/update/delete (or restrict to your own user_id)
create policy "Allow authenticated insert"
  on public.posts for insert
  with check (true);

create policy "Allow update for all"
  on public.posts for update
  using (true);

create policy "Allow delete for all"
  on public.posts for delete
  using (true);

-- Enable Realtime for live cross-device sync
alter publication supabase_realtime add table public.posts;
`;
