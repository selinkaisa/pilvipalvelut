
import { useCallback } from 'react';

export function useCloudflareAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, data?: Record<string, unknown>) => {
      if (localStorage.getItem('consent') !== 'true') return;

      if (!window._cfq) {
        window._cfq = [];
      }

      window._cfq.push([
        'trackEvent',
        {
          name: eventName,
          ...data,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  return { trackEvent };
}