"use client";

import { ReactNode } from "react";
import { ConvexAuthProvider, useAuth } from "@vxd/auth";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider 
      convexUrl={process.env.NEXT_PUBLIC_CONVEX_URL!} 
      useAuth={useAuth}
    >
      {children}
    </ConvexAuthProvider>
  );
}
