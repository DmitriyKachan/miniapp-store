import React, { createContext, useContext, useState, useCallback } from 'react';
import { ShieldCheck, Truck, User, X } from 'lucide-react';
import { hapticNotification } from '../utils/telegram';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  role: 'client' | 'florist' | 'courier';
  createdAt: number;
}

interface NotificationContextType {
  showNotification: (title: string, message: string, role: 'client' | 'florist' | 'courier') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const showNotification = useCallback((title: string, message: string, role: 'client' | 'florist' | 'courier') => {
    hapticNotification('success');
    const newNotif: AppNotification = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      message,
      role,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [newNotif, ...prev.slice(0, 2)]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 5500);
  }, []);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getRoleBadge = (role: 'client' | 'florist' | 'courier') => {
    switch (role) {
      case 'florist':
        return { label: 'Уведомление Флориста', icon: ShieldCheck, color: 'bg-rose-500 text-white' };
      case 'courier':
        return { label: 'Уведомление Курьера', icon: Truck, color: 'bg-indigo-600 text-white' };
      default:
        return { label: 'Уведомление Клиента', icon: User, color: 'bg-emerald-600 text-white' };
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Floating Live Notification Toasts for Testing */}
      <div className="fixed top-14 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-50 pointer-events-none space-y-2">
        {notifications.map((notif) => {
          const badge = getRoleBadge(notif.role);
          return (
            <div
              key={notif.id}
              className="pointer-events-auto bg-white/95 dark:bg-[#18222d]/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-4 duration-300 flex items-start gap-3 ring-1 ring-black/5"
            >
              <div className={`p-2 rounded-xl shrink-0 ${badge.color}`}>
                <badge.icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-500 dark:text-gray-400">
                    {badge.label}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {notif.title}
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
                  {notif.message}
                </p>
              </div>

              <button
                onClick={() => dismiss(notif.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
