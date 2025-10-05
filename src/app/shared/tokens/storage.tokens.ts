import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const LOCAL_STORAGE = new InjectionToken<Storage | undefined>('LOCAL_STORAGE', {
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    try {
      return isPlatformBrowser(platformId) ? window.localStorage : undefined;
    } catch {
      return undefined;
    }
  },
});

export const SESSION_STORAGE = new InjectionToken<Storage | undefined>('SESSION_STORAGE', {
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    try {
      return isPlatformBrowser(platformId) ? window.sessionStorage : undefined;
    } catch {
      return undefined;
    }
  },
});
