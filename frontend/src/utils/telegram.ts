import type { TelegramUser } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

export function getTelegramWebApp() {
  return typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
}

export function initTelegram() {
  const webApp = getTelegramWebApp();
  if (webApp) {
    try {
      webApp.ready();
      webApp.expand();
      if (webApp.enableClosingConfirmation) {
        webApp.enableClosingConfirmation();
      }
      if (typeof webApp.setHeaderColor === 'function') {
        webApp.setHeaderColor('#faf7f5');
      }
      if (typeof webApp.setBackgroundColor === 'function') {
        webApp.setBackgroundColor('#faf7f5');
      }
    } catch (e) {
      console.warn('Telegram WebApp init error:', e);
    }
  }
}

export function getTelegramUser(): TelegramUser | null {
  const webApp = getTelegramWebApp();
  if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
    return webApp.initDataUnsafe.user as TelegramUser;
  }
  return null;
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
  const webApp = getTelegramWebApp();
  if (webApp?.HapticFeedback) {
    try {
      webApp.HapticFeedback.impactOccurred(style);
    } catch {
      // Ignore if not supported
    }
  }
}

export function hapticNotification(type: 'error' | 'success' | 'warning' = 'success') {
  const webApp = getTelegramWebApp();
  if (webApp?.HapticFeedback) {
    try {
      webApp.HapticFeedback.notificationOccurred(type);
    } catch {
      // Ignore if not supported
    }
  }
}

export function hapticSelection() {
  const webApp = getTelegramWebApp();
  if (webApp?.HapticFeedback) {
    try {
      webApp.HapticFeedback.selectionChanged();
    } catch {
      // Ignore if not supported
    }
  }
}

export function openExternalLink(url: string) {
  const webApp = getTelegramWebApp();
  if (webApp && typeof webApp.openLink === 'function') {
    try {
      webApp.openLink(url);
      return;
    } catch {}
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
