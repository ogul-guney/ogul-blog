import React, { useState } from 'react';
import { CloudConfig, SyncStatus } from '../types/blog';
import { SUPABASE_SQL_SCHEMA } from '../services/supabase';
import { X, Check, Copy, Database, Cloud, ShieldCheck, RefreshCw, Key, Globe } from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CloudConfig;
  syncStatus: SyncStatus;
  onSaveConfig: (newConfig: CloudConfig) => Promise<void>;
  onForceSync: () => Promise<void>;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  config,
  syncStatus,
  onSaveConfig,
  onForceSync
}) => {
  const [formData, setFormData] = useState<CloudConfig>(config);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTestResult(null);
    try {
      await onSaveConfig(formData);
      setTestResult('Ayarlar kaydedildi ve bulut bağlantısı güncellendi!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult(`Hata: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-base text-neutral-900 dark:text-neutral-100">
                Bulut Senkronizasyonu (Supabase)
              </h3>
              <p className="text-xs text-neutral-400">
                Farklı cihazlar ve Netlify dağıtımı için veritabanı altyapısı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Live Status Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl mb-6 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                syncStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : syncStatus === 'error'
                  ? 'bg-amber-400'
                  : 'bg-neutral-400'
              }`}
            />
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              Durum:{' '}
              {syncStatus === 'connected'
                ? 'Buluta Bağlı (Supabase Realtime Aktif)'
                : syncStatus === 'error'
                ? 'Bağlantı Hatası / Tablo Bekleniyor'
                : 'Yerel Mod (Tarayıcıda Saklanıyor)'}
            </span>
          </div>

          <button
            type="button"
            onClick={onForceSync}
            className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-code"
          >
            <RefreshCw className="w-3 h-3" />
            Yenile
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Supabase URL */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              Supabase Project URL
            </label>
            <input
              type="text"
              value={formData.supabaseUrl}
              onChange={(e) =>
                setFormData({ ...formData, supabaseUrl: e.target.value.trim() })
              }
              placeholder="https://your-project.supabase.co"
              className="w-full text-xs font-code px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>

          {/* Supabase Anon Key */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-neutral-400" />
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              value={formData.supabaseAnonKey}
              onChange={(e) =>
                setFormData({ ...formData, supabaseAnonKey: e.target.value.trim() })
              }
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full text-xs font-code px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>

          {/* Profile Name & Handle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Yazar Başlığı (Header)
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                placeholder="Oğul"
                className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Altbilgi Kullanıcı Adı
              </label>
              <input
                type="text"
                value={formData.authorHandle}
                onChange={(e) =>
                  setFormData({ ...formData, authorHandle: e.target.value })
                }
                placeholder="ogulguney"
                className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>

          {/* Favorite Quote */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Altbilgi Özlü Sözü (Quote)
            </label>
            <input
              type="text"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="And then, there was light."
              className="w-full text-xs font-serif-quote italic px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>

          {/* SQL Setup Helper */}
          <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neutral-500" />
                Supabase SQL Tablo Kodu (1 Tıkta Kopyala)
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    Kopyalandı!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    SQL'i Kopyala
                  </>
                )}
              </button>
            </div>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Supabase panelinizde <strong>SQL Editor</strong> bölümüne yapıştırıp <strong>Run</strong> diyerek tablonuzu ve gerçek zamanlı senkronizasyonu 5 saniyede aktif edebilirsiniz.
            </p>
          </div>

          {testResult && (
            <div className="text-xs p-2.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-code text-center">
              {testResult}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Kapat
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet ve Bağlan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
