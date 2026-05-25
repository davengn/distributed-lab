import type { Metadata } from 'next';
import Link from 'next/link';
import { Music2, ShoppingBag } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MusicCorp',
  description: 'A simple MusicCorp storefront for distributed systems labs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="storefront-shell">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
          <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex min-h-11 items-center gap-3 no-underline">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Music2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xl font-black tracking-normal">MusicCorp</span>
            </Link>
            <nav aria-label="Primary navigation" className="flex items-center gap-2">
              <Link
                href="/"
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-semibold no-underline hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                Catalog
              </Link>
              <Link
                href="/checkout"
                className="flex min-h-11 items-center gap-2 rounded-md bg-accent px-3 text-sm font-semibold text-accent-foreground no-underline hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Checkout
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
