import { Disc3, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatMoney } from '@/lib/money';
import type { CatalogItem } from '@/lib/types';

interface ProductCardProps {
  item: CatalogItem;
  onAddToCart: (item: CatalogItem) => void;
}

function availabilityLabel(item: CatalogItem): { label: string; variant: 'success' | 'warning' | 'outline' } {
  if (typeof item.stockQuantity === 'number' && item.stockQuantity <= 0) {
    return { label: 'Sold out', variant: 'outline' };
  }
  if (typeof item.stockQuantity === 'number' && item.stockQuantity <= 3) {
    return { label: `${item.stockQuantity} left`, variant: 'warning' };
  }
  return { label: 'Available', variant: 'success' };
}

export function ProductCard({ item, onAddToCart }: ProductCardProps) {
  const available = typeof item.stockQuantity !== 'number' || item.stockQuantity > 0;
  const availability = availabilityLabel(item);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.coverRef ?? '/covers/catalog.svg'}
          alt={`${item.title} album cover`}
          className="h-full w-full object-cover"
        />
        <Badge variant={availability.variant} className="absolute left-3 top-3">
          {availability.label}
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
          <Disc3 className="h-4 w-4" aria-hidden="true" />
          {item.genre}
        </div>
        <CardTitle className="leading-tight">{item.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{item.artist}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-2xl font-black">{formatMoney(item.price)}</p>
      </CardContent>
      <CardFooter>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                className="w-full"
                variant={available ? 'default' : 'outline'}
                disabled={!available}
                onClick={() => onAddToCart(item)}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Add to cart
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-md border bg-card px-3 py-2 text-sm shadow-storefront">
              {available ? 'Add this album to your cart' : 'This album is unavailable'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
