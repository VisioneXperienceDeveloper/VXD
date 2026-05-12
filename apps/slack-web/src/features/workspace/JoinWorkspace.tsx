'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import styles from './WorkspaceOnboarding.module.css';

export function JoinWorkspace({ onBack }: { onBack: () => void }) {
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const join = useMutation(api.workspaces.join);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6 || isJoining) return;

    setIsJoining(true);
    setError(null);
    try {
      const workspaceId = await join({ joinCode: code });
      router.push(`/workspace/${workspaceId}`);
    } catch (err) {
      console.error('Failed to join workspace:', err);
      setError('Invalid invite code. Please try again.');
      setIsJoining(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>
        <h1 className={styles.title}>Join a workspace</h1>
        <p className={styles.subtitle}>
          Enter the 6-digit invite code to join an existing workspace.
        </p>
        
        <form onSubmit={handleJoin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="join-code" className={styles.label}>
              Invite Code
            </label>
            <input
              id="join-code"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="E.G. X7Y2Z9"
              className={`${styles.input} ${styles.codeInput}`}
              autoFocus
              maxLength={6}
              disabled={isJoining}
            />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={joinCode.trim().length !== 6 || isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Workspace'}
          </button>
          <button 
            type="button" 
            className={styles.backBtn}
            onClick={onBack}
            disabled={isJoining}
          >
            Back to create
          </button>
        </form>
      </div>
    </div>
  );
}
