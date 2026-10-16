import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';
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

    setNotifications((prev) => [newNotif, ...prev.slice(0, 1)]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 3500);
  }, []);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <div className="fixed top-16 left-3.5 right-3.5 sm:left-auto sm:right-4 sm:w-80 z-50 pointer-events-none space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl px-3.5 py-2.5 shadow-lg flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold truncate">{notif.title}</h4>
              <p className="text-[11px] opacity-80 truncate">{notif.message}</p>
            </div>
            <button
              onClick={() => dismiss(notif.id)}
              className="opacity-60 hover:opacity-100 p-0.5 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
