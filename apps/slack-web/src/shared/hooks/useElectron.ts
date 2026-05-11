'use client';

import { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useParams } from 'next/navigation';


export function useElectron() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string | undefined;
  
  const unreadCount = useQuery(
    api.notifications.getUnreadCount, 
    workspaceId ? { workspaceId: workspaceId as Id<"workspaces"> } : "skip"
  );


  useEffect(() => {
    // @ts-expect-error - electron is exposed via preload script
    if (window.electron && typeof unreadCount === 'number') {
      // @ts-expect-error - setBadgeCount is exposed via preload script
      window.electron.setBadgeCount(unreadCount);
    }
  }, [unreadCount]);

  useEffect(() => {
    // @ts-expect-error - electron is exposed via preload script
    if (window.electron) {
      // @ts-expect-error - onOpenShortcut is exposed via preload script
      const unsubscribe = window.electron.onOpenShortcut((value: string) => {
        console.log('Global shortcut triggered:', value);
        if (value === 'switcher') {

          // Trigger the switcher modal or search focus
          // For now, we'll just log it. In a real app, you'd use a global state
          // to open the search/switcher modal.
          const searchButton = document.querySelector('[data-search-trigger]') as HTMLButtonElement;
          if (searchButton) {
            searchButton.click();
          } else {
            // Fallback: alert or log
            console.log('Switcher requested via global shortcut');
          }
        }
      });

      return () => {
        // If the bridge provides an unsubscribe mechanism
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, []);
}
