export type PostCategory = 'timeline' | 'devlog';

export interface BlogPost {
  id: string;
  content: string;
  created_at: string; // ISO string
  category: PostCategory;
  pinned?: boolean;
  tags?: string[];
  user_id?: string;
  author_name?: string;
}

export type ViewTab = 'timeline' | 'devlog' | 'search' | 'archive' | 'random';

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  authorName: string;
  authorHandle: string;
  quote: string;
}

export type SyncStatus = 'connected' | 'connecting' | 'offline' | 'error';
