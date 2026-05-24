"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  },
  {
    href: "/labs",
    label: "Labs",
    icon: "M9 3h6v7l5 8H4l5-8V3zM9 3h6",
  },
  {
    href: "/chaos",
    label: "Chaos",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    href: "/registry",
    label: "Registry",
    icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM4 8a2 2 0 100-4 2 2 0 000 4zM20 8a2 2 0 100-4 2 2 0 000 4zM4 20a2 2 0 100-4 2 2 0 000 4zM20 20a2 2 0 100-4 2 2 0 000 4zM5.5 7.5l4 3M18.5 7.5l-4 3M5.5 16.5l4-3M18.5 16.5l-4-3",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <aside className="z-40 flex h-full w-[240px] shrink-0 flex-col border-r border-border bg-[var(--sidebar-bg)] transition-[width] duration-200 max-lg:w-[56px]">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4 max-lg:justify-center max-lg:px-3">
        <svg
          className="h-[22px] w-[22px] shrink-0 text-fg-default"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span className="text-fg-default font-semibold text-sm max-lg:hidden">DistributedLab</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-8 items-center gap-2.5 rounded-[6px] px-3 py-[7px] text-sm transition-colors max-lg:justify-center max-lg:px-2 ${
                isActive
                  ? "bg-neutral-muted text-fg-default font-semibold"
                  : "text-fg-muted hover:bg-neutral-muted hover:text-fg-default"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="max-lg:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col gap-2 border-t border-border px-4 py-3 max-lg:items-center max-lg:px-2">
        <button
          type="button"
          onClick={toggle}
          className="flex min-h-8 items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-xs text-fg-muted transition-colors hover:bg-neutral-muted hover:text-fg-default max-lg:justify-center"
          aria-label={`Switch to ${nextTheme} mode`}
        >
          {theme === "light" ? (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          )}
          <span className="max-lg:hidden">{theme === "light" ? "Dark mode" : "Light mode"}</span>
        </button>
        <span className="mono inline-block rounded-[4px] border border-border bg-canvas px-2 py-0.5 text-[11px] text-fg-muted max-lg:hidden">
          v0.1.0-alpha
        </span>
      </div>
    </aside>
  );
}
