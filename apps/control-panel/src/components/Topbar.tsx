"use client";

import { usePathname } from "next/navigation";

export function Topbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-[var(--header-bg)] px-6 max-lg:px-4">
      <h1 className="text-section text-fg-default">{title}</h1>
      <div className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
        <span className="h-2 w-2 rounded-full bg-success-fg" aria-hidden="true" />
        Environment running
      </div>
    </header>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/labs")) return "Lab Modules";
  if (pathname.startsWith("/chaos")) return "Chaos Console";
  if (pathname.startsWith("/registry")) return "Service Registry";
  return "Dashboard";
}
