import JSZip from 'jszip';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('netlify.toml', `[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`);

  zip.file('_redirects', `/*    /index.html   200\n`);

  zip.file('.env.example', `# Supabase Cloud Database Configuration
# You can find these in your Supabase Project Settings -> API
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
`);

  zip.file('README.md', `# Oğul Minimal Blog

Minimalist, ultra-clean kişisel micro-blog ve dev-log sitesi.
Cihazlar arası Supabase bulut senkronizasyonu, zaman tüneli, arama, arşiv ve Netlify için hazır altyapı.

## 🚀 Netlify'a Yükleme (2 Kolay Yol)

### 1. Yol: Doğrudan Netlify Drop ile (Saniyeler İçinde)
1. Bu projede terminalde \`npm install\` ve \`npm run build\` komutunu çalıştırın.
2. Oluşan \`dist\` klasörünü [Netlify Drop](https://app.netlify.com/drop) sayfasına sürükleyip bırakın.
3. Siteniz anında yayında!

### 2. Yol: GitHub & Netlify Continuous Deployment
1. Bu kodları bir GitHub deposuna yükleyin (\`git init\`, \`git add .\`, \`git commit\`, \`git push\`).
2. Netlify'da "Import from Git" seçin.
3. Build Settings:
   - **Build Command:** \`npm run build\`
   - **Publish Directory:** \`dist\`
4. Environment Variables (Opsiyonel ama önerilir):
   - \`VITE_SUPABASE_URL\`: Supabase proje URL'iniz
   - \`VITE_SUPABASE_ANON_KEY\`: Supabase Anon Public Key'iniz

## ☁️ Supabase Bulut Veritabanı Kurulumu (1 Dakika)
1. [supabase.com](https://supabase.com) adresinde ücretsiz bir proje oluşturun.
2. Soldaki menüden **SQL Editor**'e gidin.
3. Projedeki \`supabase-schema.sql\` dosyasının içeriğini yapıştırın ve **Run**'a basın.
4. Settings -> API sekmesindeki URL ve Anon Key'i kopyalayıp sitedeki sağ alttaki "Supabase Connected" butonuna tıklayarak yapıştırın.
5. Artık telefonunuzdan, tabletinizden veya bilgisayarınızdan girdiğiniz tüm yazılar anında bulutta senkronize olur!
`);

  zip.file('supabase-schema.sql', `-- Supabase SQL Schema for Oğul Personal Blog
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

alter table public.posts enable row level security;

create policy "Allow public read access"
  on public.posts for select
  using (true);

create policy "Allow authenticated insert"
  on public.posts for insert
  with check (true);

create policy "Allow update for all"
  on public.posts for update
  using (true);

create policy "Allow delete for all"
  on public.posts for delete
  using (true);

alter publication supabase_realtime add table public.posts;
`);

  zip.file('package.json', JSON.stringify({
    name: "ogul-minimal-blog",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "lint": "tsc --noEmit"
    },
    dependencies: {
      "@supabase/supabase-js": "^2.49.1",
      "@tailwindcss/vite": "^4.3.3",
      "@vitejs/plugin-react": "^6.1.1",
      "jszip": "^3.10.1",
      "lucide-react": "^0.546.0",
      "motion": "^12.23.24",
      "react": "^19.0.1",
      "react-dom": "^19.0.1",
      "vite": "^8.3.0"
    },
    devDependencies: {
      "@types/node": "^22.14.0",
      "@types/react": "^19.3.0",
      "@types/react-dom": "^19.3.0",
      "autoprefixer": "^10.4.21",
      "tailwindcss": "^4.3.3",
      "typescript": "^7.0.2"
    }
  }, null, 2));

  zip.file('tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: false,
      module: "ESNext",
      types: ["vite/client"],
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      skipLibCheck: true,
      moduleResolution: "bundler",
      isolatedModules: true,
      moduleDetection: "force",
      allowJs: true,
      jsx: "react-jsx",
      paths: {
        "@/*": ["./*"]
      },
      allowImportingTsExtensions: true,
      noEmit: true
    }
  }, null, 2));

  zip.file('vite.config.ts', `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
`);

  // Include public directory
  const publicFolder = zip.folder('public');
  if (publicFolder) {
    publicFolder.file('_redirects', '/*    /index.html   200\n');
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename = 'ogul-blog-netlify-ready.zip'): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
