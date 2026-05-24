import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export function Panel({
  title,
  meta,
  children,
  className = '',
  bodyClassName = '',
  noPadding = false,
}: PanelProps) {
  return (
    <section className={`overflow-hidden rounded-[6px] border border-border bg-canvas ${className}`}>
      <div className="flex min-h-11 items-center justify-between border-b border-border bg-canvas-subtle px-4 py-3">
        <h2 className="text-section text-fg-default">{title}</h2>
        {meta}
      </div>
      <div className={noPadding ? bodyClassName : `p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

interface TableShellProps {
  children: ReactNode;
  className?: string;
  minWidth?: string;
  ariaLabel?: string;
}

export function TableShell({
  children,
  className = '',
  minWidth = 'min-w-[560px]',
  ariaLabel,
}: TableShellProps) {
  return (
    <div className={`overflow-x-auto ${className}`} aria-label={ariaLabel}>
      <table className={`w-full border-collapse text-left ${minWidth}`}>{children}</table>
    </div>
  );
}

export const tableHeaderCellClass =
  'border-b border-border px-3 py-2 text-caption font-medium text-fg-muted';
export const tableCellClass = 'border-b border-border-subtle px-3 py-2 text-table text-fg-default';

interface TabButtonProps {
  active: boolean;
  children: ReactNode;
  id: string;
  controls: string;
  onClick: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export function TabButton({ active, children, id, controls, onClick, onKeyDown }: TabButtonProps) {
  return (
    <button
      id={id}
      role="tab"
      type="button"
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`min-h-10 border-b-2 px-4 text-sm transition-colors ${
        active
          ? 'border-accent-fg text-accent-fg font-medium'
          : 'border-transparent text-fg-muted hover:text-fg-default'
      }`}
    >
      {children}
    </button>
  );
}
