# Oğul Minimal Blog 📝

Minimalist, zarif kişisel micro-blog ve dev-log sitesi.
Cihazlar arası Supabase bulut senkronizasyonu, zaman tüneli, anlık arama, kronolojik arşiv, rastgele düşünce seçici ve Netlify için %100 hazır dağıtım altyapısı.

---

## 🌟 Özellikler

- **Birebir Tasarım:** Görseldeki minimalist tipografi, sol üstte girdi sayacı, üst navigasyon (Timeline, Dev Log, Search, Archive, Random), sağda dark mode butonu.
- **Klavye Kısayolları:** Girdi kutusunda `⌘ + Enter` (veya `Ctrl + Enter`) ile anında gönderme.
- **Tarih Formatı:** Tam görseldeki gibi: `22 SEP 2026 · 15:03 · just now`.
- **Cihazlar Arası Senkronizasyon (Supabase Cloud Sync):** Telefonunuzdan, tabletinizden veya bilgisayarınızdan girdiğiniz tüm yazılar anında bulutta senkronize edilir ve gerçek zamanlı (realtime) olarak güncellenir.
- **Çevrimdışı / Yerel Yedekleme:** İnternet veya Supabase yapılandırması olmasa dahi LocalStorage ile kesintisiz çalışır.
- **Netlify'a Hazır:** `netlify.toml` ve `_redirects` SPA ayarları önceden tanımlıdır.

---

## 🚀 Netlify'a Dağıtım

### Yöntem 1: Netlify Drop ile (En Hızlısı - 1 Dakika)
1. Proje klasöründe terminalde şu komutları çalıştırın:
   ```bash
   npm install
   npm run build
   ```
2. Oluşan `dist` klasörünü [app.netlify.com/drop](https://app.netlify.com/drop) adresine sürükleyip bırakın.
3. Siteniz hemen canlıya alınır!

### Yöntem 2: GitHub ve Netlify Entegrasyonu
1. Kodları GitHub deponuza yükleyin.
2. Netlify panelinde **Add new site** > **Import an existing project** deyin.
3. Ayarlar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Environment Variables** (Ortam Değişkenleri):
   - `VITE_SUPABASE_URL`: Supabase proje URL adresiniz
   - `VITE_SUPABASE_ANON_KEY`: Supabase anon key'iniz

---

## ☁️ Supabase Bulut Veritabanı Kurulumu (2 Adım)

1. [Supabase](https://supabase.com) üzerinde ücretsiz bir hesap açın ve "New Project" oluşturun.
2. Sol menüden **SQL Editor**'e gelin, projedeki `supabase-schema.sql` dosyasının içeriğini yapıştırıp **Run** butonuna basın.
3. **Project Settings -> API** sayfasından:
   - **Project URL**
   - **anon public Key**
   bilgilerini sitenin sağ alt köşesindeki **"Supabase Connected"** bağlantısına tıklayarak girin veya `.env` dosyanıza ekleyin.

Artık tüm cihazlarınızda aynı veriler görünecektir!
