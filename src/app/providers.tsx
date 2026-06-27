"use client";

import { ReactQueryProvider } from "@/shared/lib/react-query";
import { Toaster } from "@/shared/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
      <Toaster richColors position="top-center" />
    </ReactQueryProvider>
  );
}
