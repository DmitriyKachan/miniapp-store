import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TelegramUser, UserRole } from '../types';
import { getTelegramUser, initTelegram } from '../utils/telegram';
import { api } from '../api';

interface AuthContextType {
  user: TelegramUser | null;
  mode: UserRole;
  setMode: (mode: UserRole) => void;
  isAdmin: boolean;
  adminIds: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [mode, setMode] = useState<UserRole>('buyer');
  const [adminIds, setAdminIds] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  useEffect(() => {
    initTelegram();
    const tgUser = getTelegramUser();
    if (tgUser) {
      setUser(tgUser);
    }

    // Fetch health and admin IDs from backend
    api.getHealth()
      .then((data) => {
        if (data && data.adminIds) {
          setAdminIds(data.adminIds);
          if (tgUser && data.adminIds.length > 0) {
            const hasAdminRight = data.adminIds.includes(String(tgUser.id));
            setIsAdmin(hasAdminRight);
          } else {
            setIsAdmin(true);
          }
        }
      })
      .catch(() => {
        setIsAdmin(true);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        mode,
        setMode,
        isAdmin,
        adminIds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
