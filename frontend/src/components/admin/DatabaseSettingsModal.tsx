import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  UploadCloud,
  DownloadCloud,
  X,
  ShieldCheck,
} from 'lucide-react';
import { api, SERVER_CONFIG_KEY } from '../../api';
import { hapticImpact, hapticNotification } from '../../utils/telegram';

interface DatabaseSettingsModalProps {
  onClose: () => void;
  onRefresh: () => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  onClose,
  onRefresh,
}) => {
  const [serverUrl, setServerUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    tested: boolean;
    ok: boolean;
    message: string;
    timestamp?: string;
  }>({
    tested: false,
    ok: false,
    message: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem(SERVER_CONFIG_KEY) || import.meta.env.VITE_API_URL || '';
    setServerUrl(saved);
    if (saved) {
      testConnection(saved);
    }
  }, []);

  const testConnection = async (targetUrl?: string) => {
    const urlToTest = (targetUrl !== undefined ? targetUrl : serverUrl).trim();
    if (!urlToTest) {
      setHealthStatus({
        tested: true,
        ok: false,
        message: 'Вкажіть коректну HTTPS-адресу сервера',
      });
      return;
    }

    try {
      setIsChecking(true);
      hapticImpact('light');
      const res = await api.checkServerHealth(urlToTest);
      setHealthStatus({
        tested: true,
        ok: res.ok,
        message: res.message,
        timestamp: res.timestamp,
      });
      if (res.ok) {
        hapticNotification('success');
      } else {
        hapticNotification('warning');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    hapticImpact('medium');

    const clean = serverUrl.trim();
    if (clean) {
      localStorage.setItem(SERVER_CONFIG_KEY, clean);
      await api.syncFromServer();
    } else {
      localStorage.removeItem(SERVER_CONFIG_KEY);
    }

    onRefresh();
    hapticNotification('success');
    onClose();
  };

  const handleExportToCloud = async () => {
    if (!serverUrl.trim()) {
      alert('Спочатку вкажіть адресу сервера');
      return;
    }

    try {
      setIsExporting(true);
      hapticImpact('heavy');
      const count = await api.exportLocalToCentralServer();
      hapticNotification('success');
      alert(`Успішно експортовано ${count} букетів у єдину базу даних! Тепер кожен пристрій бачить оновлений каталог.`);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Помилка експорту в базу даних');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFromCloud = async () => {
    try {
      setIsImporting(true);
      hapticImpact('medium');
      await api.syncFromServer();
      hapticNotification('success');
      onRefresh();
      alert('Каталог та замовлення успішно синхронізовано з єдиної бази даних!');
    } catch (err: any) {
      alert(err.message || 'Помилка синхронізації');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-white dark:bg-[#131b2d] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-[#e8e4da] dark:border-white/10">
        
        {/* Mobile handle & Header */}
        <div className="pt-2 sm:pt-0">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-slate-700 mx-auto sm:hidden my-2" />
          <div className="px-5 py-4 border-b border-[#e8e4da] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#131d33]/10 dark:bg-white/10 text-[#131d33] dark:text-[#f8fafc] flex items-center justify-center font-bold">
                <Database className="w-4.5 h-4.5 text-[#c5a880]" />
              </div>
              <div>
                <h3 className="font-brand-serif text-base font-bold text-[#131d33] dark:text-white leading-tight">
                  Єдина база даних & Cloud Sync
                </h3>
                <p className="text-[11px] text-[#6e809f]">
                  Синхронізація букетів та замовлень між усіма пристроями
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                hapticImpact('light');
                onClose();
              }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 no-scrollbar pb-[calc(2.5rem+env(safe-area-inset-bottom,20px))]">
          
          {/* Status Indicator Card */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              healthStatus.tested && healthStatus.ok
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {healthStatus.tested && healthStatus.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider">
                {healthStatus.tested && healthStatus.ok
                  ? 'Єдина база даних підключена'
                  : 'Автономний режим (LocalStorage)'}
              </h4>
              <p className="text-xs leading-relaxed opacity-90">
                {healthStatus.tested && healthStatus.ok
                  ? 'Всі пристрої, клієнти та адміністратори підключені до одного сервера. Будь-які видалення, нові букети та замовлення синхронізуються миттєво.'
                  : 'Зараз дані зберігаються лише в браузері цього смартфона. Щоб видалений букет зникав скрізь, а замовлення надходили всім адмінам — підключіть URL сервера бази даних.'}
              </p>
              {healthStatus.timestamp && (
                <p className="text-[10px] opacity-75 pt-1">
                  Час останньої відповіді сервера: {new Date(healthStatus.timestamp).toLocaleTimeString('uk-UA')}
                </p>
              )}
            </div>
          </div>

          {/* Server URL Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#131d33] dark:text-[#f8fafc] mb-1.5">
                URL бекенд-сервера бази даних (Render, Railway, VPS або тунель):
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Server className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e809f]" />
                  <input
                    type="url"
                    placeholder="https://flowers-lviv-api.onrender.com"
                    value={serverUrl}
                    onChange={(e) => {
                      setServerUrl(e.target.value);
                      setHealthStatus({ tested: false, ok: false, message: '' });
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf8f5] dark:bg-slate-800 text-xs sm:text-sm text-stone-900 dark:text-white rounded-xl border border-[#e8e4da] dark:border-white/10 focus:border-[#131d33] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="button"
                  disabled={isChecking}
                  onClick={() => testConnection()}
                  className="px-3.5 py-2.5 bg-[#131d33]/10 hover:bg-[#131d33]/20 dark:bg-white/10 dark:hover:bg-white/20 text-[#131d33] dark:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>Перевірити</span>
                </button>
              </div>

              {healthStatus.tested && (
                <p
                  className={`text-[11px] font-semibold mt-1.5 ${
                    healthStatus.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                  }`}
                >
                  {healthStatus.message}
                </p>
              )}
            </div>

            {/* Cloud Sync Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={isExporting || !serverUrl}
                onClick={handleExportToCloud}
                className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-stone-50 text-[#131d33] dark:text-white rounded-xl text-xs font-bold border border-[#e8e4da] dark:border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{isExporting ? 'Вивантаження...' : 'Відправити в базу'}</span>
              </button>

              <button
                type="button"
                disabled={isImporting || !serverUrl}
                onClick={handleImportFromCloud}
                className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-stone-50 text-[#131d33] dark:text-white rounded-xl text-xs font-bold border border-[#e8e4da] dark:border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-[#6e809f]" />
                <span>{isImporting ? 'Завантаження...' : 'Підтягнути з бази'}</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#131d33] hover:bg-[#1a2846] text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-[#131d33]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#2b3c5c] mt-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span className="font-brand-serif tracking-wider uppercase">Зберегти налаштування</span>
            </button>
          </form>

          {/* Helpful 2-minute Deployment Guide Card */}
          <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-slate-800/50 border border-[#e8e4da] dark:border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#131d33] dark:text-white uppercase tracking-wider text-[10px]">
                🚀 Як безкоштовно запустити сервер на Render.com (2 хв):
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                100% Безкоштовно
              </span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
              <li>Зареєструйтесь на <b>render.com</b> (через ваш GitHub).</li>
              <li>Натисніть <b>New +</b> → <b>Blueprint</b> та оберіть ваш репозиторій <b>miniapp-store</b>.</li>
              <li>Render автоматично підхопить готовий файл <b>render.yaml</b> і запустить сервер та базу даних SQLite.</li>
              <li>Скопіюйте видану HTTPS-адресу (наприклад <i>https://flowers-lviv-api.onrender.com</i>) та вставте в поле вище!</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};
