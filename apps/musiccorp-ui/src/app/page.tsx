'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Headphones, RefreshCw } from 'lucide-react';
import { BackendStatusBanner } from '@/components/BackendStatusBanner';
import { CartDrawer } from '@/components/CartDrawer';
import { CatalogFilters } from '@/components/CatalogFilters';
import { CatalogGrid } from '@/components/CatalogGrid';
import { StorefrontActivityPanel } from '@/components/StorefrontActivityPanel';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-store';
import { createActionId, toEventStatus, useStorefrontEvents } from '@/lib/storefront-events';
import type { BackendResult, CatalogFilter, CatalogItem } from '@/lib/types';

const defaultFilters: CatalogFilter = {
  query: '',
  genre: 'all',
  availableOnly: false,
};

function matchesFilters(item: CatalogItem, filters: CatalogFilter) {
  const query = filters.query.trim().toLowerCase();
  const queryMatches =
    query.length === 0 ||
    item.title.toLowerCase().includes(query) ||
    item.artist.toLowerCase().includes(query);
  const genreMatches = filters.genre === 'all' || item.genre === filters.genre;
  const availabilityMatches =
    !filters.availableOnly || typeof item.stockQuantity !== 'number' || item.stockQuantity > 0;
  return queryMatches && genreMatches && availabilityMatches;
}

export default function CatalogPage() {
  const { cart, addItem, updateQuantity, removeItem, canCheckout } = useCart();
  const { events, record, clear } = useStorefrontEvents();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [filters, setFilters] = useState<CatalogFilter>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [catalogResult, setCatalogResult] = useState<BackendResult<CatalogItem[]> | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    const fallbackActionId = createActionId('catalog');
    const startedAt = performance.now();
    try {
      const response = await fetch('/api/catalog');
      const result = (await response.json()) as BackendResult<CatalogItem[]>;
      setCatalogResult(result);
      if (result.ok) {
        setItems(result.data);
      }
      record({
        clientActionId: result.actionId ?? fallbackActionId,
        label: 'Catalog load',
        status: toEventStatus(result.ok, result.ok ? undefined : result.category),
        durationMs: result.durationMs || Math.round(performance.now() - startedAt),
        timestamp: new Date().toISOString(),
        businessSummary: result.ok ? `Loaded ${result.data.length} catalog items` : result.message,
      });
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [record]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const genres = useMemo(
    () => Array.from(new Set(items.map((item) => item.genre))).sort((a, b) => a.localeCompare(b)),
    [items]
  );
  const visibleItems = useMemo(
    () => items.filter((item) => matchesFilters(item, filters)),
    [filters, items]
  );

  function handleAddToCart(item: CatalogItem) {
    addItem(item);
    record({
      clientActionId: createActionId('cart'),
      label: 'Add to cart',
      status: 'succeeded',
      durationMs: 0,
      timestamp: new Date().toISOString(),
      businessSummary: `Added ${item.title} by ${item.artist}`,
    });
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
      <section className="min-w-0 space-y-5">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-normal text-secondary">
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Customer storefront
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">MusicCorp Catalog</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Browse albums, build a cart, and run checkout through the existing MusicCorp backend.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => void loadCatalog()} disabled={loading}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh catalog
            </Button>
            <CartDrawer
              cart={cart}
              canCheckout={canCheckout}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          </div>
        </div>

        <BackendStatusBanner result={catalogResult} onRetry={() => void loadCatalog()} />

        <CatalogFilters filters={filters} genres={genres} onChange={setFilters} />

        <CatalogGrid
          items={visibleItems}
          loading={loading}
          hasLoaded={hasLoaded}
          hasCatalogItems={items.length > 0}
          onAddToCart={handleAddToCart}
          onResetFilters={() => setFilters(defaultFilters)}
        />
      </section>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground">Cart subtotal</p>
          <p className="mt-1 text-3xl font-black">${cart.subtotal.toFixed(2)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} ready for checkout.
          </p>
        </div>
        <StorefrontActivityPanel events={events} onClear={clear} />
      </aside>
    </main>
  );
}
