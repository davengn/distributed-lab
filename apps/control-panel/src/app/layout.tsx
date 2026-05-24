import type { Metadata } from "next";
import "@/styles/globals.css";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/hooks/useTheme";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "DistributedLab",
  description: "Self-hosted learning sandbox for distributed systems",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ErrorBoundary>
            <Layout>{children}</Layout>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
