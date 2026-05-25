import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/ProductCard';
import type { CatalogItem } from '@/lib/types';

interface CatalogGridProps {
  items: CatalogItem[];
  loading: boolean;
  hasLoaded: boolean;
  hasCatalogItems: boolean;
  onAddToCart: (item: CatalogItem) => void;
  onResetFilters: () => void;
}

function CatalogSkeletons() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-border bg-card p-4">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <Skeleton className="mt-5 h-11 w-full" />
        </div>
      ))}
    </div>
  );
}

export function CatalogGrid({
  items,
  loading,
  hasLoaded,
  hasCatalogItems,
  onAddToCart,
  onResetFilters,
}: CatalogGridProps) {
  if (loading) {
    return <CatalogSkeletons />;
  }

  if (hasLoaded && !hasCatalogItems) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <LayoutGrid className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-bold">The catalog is empty</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          MusicCorp is reachable, but it did not return any albums. Seed data or switch the backend
          route, then retry the catalog.
        </p>
      </div>
    );
  }

  if (hasLoaded && items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-bold">No albums match these filters</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Clear search, change genre, or include unavailable titles to rebuild the cart scenario.
        </p>
        <Button type="button" variant="outline" className="mt-5" onClick={onResetFilters}>
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
