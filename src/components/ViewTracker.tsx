'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  postId: string;
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current) return;
    hasTracked.current = true;

    // Fire and forget - don't block rendering
    fetch(`/api/view/${postId}`, { method: 'POST' }).catch(() => {
      // Silently fail - view count is not critical
    });
  }, [postId]);

  return null;
}
