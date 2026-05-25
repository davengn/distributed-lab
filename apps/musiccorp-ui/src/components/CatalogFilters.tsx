import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { CatalogFilter } from '@/lib/types';

interface CatalogFiltersProps {
  filters: CatalogFilter;
  genres: string[];
  onChange: (filters: CatalogFilter) => void;
}

export function CatalogFilters({ filters, genres, onChange }: CatalogFiltersProps) {
  return (
    <section
      aria-label="Catalog filters"
      className="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_auto]"
    >
      <div className="space-y-2">
        <Label htmlFor="catalog-search">Search albums</Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="catalog-search"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Title or artist"
            className="pl-9"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="genre-filter">Genre</Label>
        <Select
          id="genre-filter"
          value={filters.genre}
          onChange={(event) => onChange({ ...filters, genre: event.target.value })}
        >
          <option value="all">All genres</option>
          {genres.map((genre) => (
            <option value={genre} key={genre}>
              {genre}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex items-end">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(event) => onChange({ ...filters, availableOnly: event.target.checked })}
            className="h-4 w-4 rounded border-input accent-indigo-700"
          />
          Available only
        </label>
      </div>
    </section>
  );
}
