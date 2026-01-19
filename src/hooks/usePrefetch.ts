import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

interface UsePrefetchOptions {
  delay?: number;
  enabled?: boolean;
}

export function usePrefetch(href: string, options: UsePrefetchOptions = {}) {
  const { delay = 150, enabled = true } = options;
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isPrefetchedRef = useRef(false);

  const prefetch = useCallback(() => {
    if (!enabled || isPrefetchedRef.current) return;

    timeoutRef.current = setTimeout(() => {
      router.prefetch(href);
      isPrefetchedRef.current = true;
    }, delay);
  }, [href, delay, enabled, router]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { prefetch, cancel };
}
