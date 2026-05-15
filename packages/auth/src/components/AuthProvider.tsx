'use client';

import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { theme } = useTheme();
  
  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: theme === 'dark' ? '#FFFFFF' : '#000000',
          borderRadius: '8px',
        },
        elements: {
          card: 'shadow-xl border border-border',
          formButtonPrimary: 'bg-primary text-primary-foreground hover:opacity-90 transition-all',
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
