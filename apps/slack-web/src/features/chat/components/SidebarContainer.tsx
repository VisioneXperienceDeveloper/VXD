'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import Skeleton from '@/shared/components/Skeleton';
import Sidebar from './Sidebar';
import type { Id } from '@convex/_generated/dataModel';

interface SidebarContainerProps {
  workspaceId: string;
}

export default function SidebarContainer({ workspaceId }: SidebarContainerProps) {
  const workspace = useQuery(api.workspaces.get, { workspaceId: workspaceId as Id<"workspaces"> });
  const currentUser = useQuery(api.users.viewer);
  const channels = useQuery(api.channels.list, { workspaceId: workspaceId as Id<"workspaces"> });
  const conversations = useQuery(api.conversations.list, { workspaceId: workspaceId as Id<"workspaces"> });
  
  const params = useParams();
  const currentChannelId = params.channelId as string;
  const [now, setNow] = useState(() => Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const isLoaded = workspace !== undefined && currentUser !== undefined && channels !== undefined && conversations !== undefined;

  if (!isLoaded) {
    // ... loading UI ...
    return (
      <aside style={{ 
        width: 'var(--sidebar-width)', 
        height: '100vh',
        backgroundColor: 'rgba(17, 17, 17, 0.8)', 
        backdropFilter: 'blur(var(--glass-blur))',
        borderRight: '1px solid var(--glass-border)', 
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <Skeleton width="28px" height="28px" borderRadius="4px" />
          <Skeleton width="120px" height="20px" borderRadius="4px" />
        </div>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} width="100%" height="32px" borderRadius="6px" />
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Skeleton width="36px" height="36px" borderRadius="8px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <Skeleton width="80px" height="12px" borderRadius="4px" />
            <Skeleton width="60px" height="10px" borderRadius="4px" />
          </div>
        </div>
      </aside>
    );
  }

  if (!currentUser || !workspace) {
    return (
      <aside style={{ width: 'var(--sidebar-width)', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
        Workspace not found
      </aside>
    );
  }

  const mappedWorkspace = {
    id: workspace._id,
    name: workspace.name,
    ownerId: workspace.ownerId,
    joinCode: workspace.joinCode,
    createdAt: new Date(workspace.createdAt),
  };

  const ONLINE_THRESHOLD = 60000; // Reduce to 1 minute for snappier feedback

  const isOnline = (lastSeen?: number) => {
    if (!lastSeen) return false;
    const diff = now - lastSeen;
    return diff >= 0 && diff < ONLINE_THRESHOLD;
  };

  const mappedCurrentUser = {
    id: currentUser._id,
    name: currentUser.name || 'Anonymous',
    displayName: currentUser.name || 'Anonymous',
    avatarUrl: currentUser.image,
    status: isOnline(currentUser.lastSeen) ? 'online' as const : 'offline' as const,
  };

  const mappedChannels = (channels || []).map(ch => ({
    id: ch._id,
    workspaceId: ch.workspaceId,
    name: ch.name,
    description: ch.description,
    isPrivate: ch.isPrivate,
    memberCount: 0,
    createdAt: new Date(ch.createdAt),
  }));

  const mappedDms = conversations.map((conv) => ({
    id: conv.channelId,
    workspaceId: conv.workspaceId,
    memberOneId: conv.memberOneId,
    memberTwoId: conv.memberTwoId,
    channelId: conv.channelId,
    otherUser: conv.otherUser ? {
      id: conv.otherUser._id,
      name: conv.otherUser.name || 'Anonymous',
      displayName: conv.otherUser.name || 'Anonymous',
      avatarUrl: conv.otherUser.image,
      status: isOnline(conv.otherUser.lastSeen) ? 'online' as const : 'offline' as const,
    } : undefined,
  })) || [];

  const currentChannel = mappedChannels.find(c => c.id === currentChannelId) || null;

  return (
    <Sidebar
      workspace={mappedWorkspace}
      channels={mappedChannels}
      dms={mappedDms}
      currentChannel={currentChannel}
      currentUser={mappedCurrentUser}
    />
  );
}
