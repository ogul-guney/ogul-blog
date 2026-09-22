import React, { useState } from 'react';
import { generateProjectZip, triggerDownload } from '../services/zipExporter';
import { X, Download, CheckCircle2, Server, FolderArchive, ArrowRight } from 'lucide-react';

interface ExportNetlifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportNetlifyModal: React.FC<ExportNetlifyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const blob = await generateProjectZip();
      triggerDownload(blob, 'ogul-minimal-blog-netlify.zip');
      setDownloaded(true);
    } catch (err) {
      console.error('ZIP export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-base text-neutral-900 dark:text-neutral-100">
                Netlify Dağıtımı & Proje ZIP Çıktısı
              </h3>
              <p className="text-xs text-neutral-400">
                Netlify için %100 hazır yapılandırmalı proje paketi
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

        {/* Action Button */}
        <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-center mb-6">
          <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
            Tüm kaynak kodlar, Tailwind ayarları, Supabase SQL şeması, Netlify <code className="font-code text-neutral-700 dark:text-neutral-300">netlify.toml</code> ve <code className="font-code text-neutral-700 dark:text-neutral-300">_redirects</code> yönlendirme kuralları pakete dahildir.
          </p>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting
              ? 'ZIP Hazırlanıyor...'
              : downloaded
              ? 'ZIP İndirildi (Tekrar İndir)'
              : 'Tam Proje ZIP Dosyasını İndir (.zip)'}
          </button>

          {downloaded && (
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>ogul-minimal-blog-netlify.zip başarıyla indirildi!</span>
            </div>
          )}
        </div>

        {/* Deployment Steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" />
            Netlify'a Nasıl Yüklenir?
          </h4>

          <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-code text-[11px] shrink-0 font-medium text-neutral-700 dark:text-neutral-300">
                1
              </span>
              <div>
                <strong className="text-neutral-900 dark:text-neutral-100">ZIP'i Çıkartın veya GitHub'a Gönderin:</strong>
                <p className="text-neutral-500 mt-0.5">
                  İndirdiğiniz ZIP'i açıp <code className="font-code">npm run build</code> alabilir ya da GitHub deponuza yükleyebilirsiniz.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-code text-[11px] shrink-0 font-medium text-neutral-700 dark:text-neutral-300">
                2
              </span>
              <div>
                <strong className="text-neutral-900 dark:text-neutral-100">Netlify Ayarları:</strong>
                <p className="text-neutral-500 mt-0.5">
                  Build command: <code className="font-code">npm run build</code><br/>
                  Publish directory: <code className="font-code">dist</code>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-code text-[11px] shrink-0 font-medium text-neutral-700 dark:text-neutral-300">
                3
              </span>
              <div>
                <strong className="text-neutral-900 dark:text-neutral-100">Tüm Cihazlarda Eşit Görünüm:</strong>
                <p className="text-neutral-500 mt-0.5">
                  Supabase URL ve Anon Key bilgilerinizi Netlify Environment Variables'a veya sitedeki bulut paneline girdiğinizde, hangi cihazdan girerseniz girin verileriniz aynı şekilde listelenir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
