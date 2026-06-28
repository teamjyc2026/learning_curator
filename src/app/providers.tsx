"use client";

import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "@/shared/lib/react-query";
import { Toaster } from "@/shared/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        {children}
        <Toaster richColors position="top-center" />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
