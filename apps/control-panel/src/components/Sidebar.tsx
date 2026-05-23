"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { href: "/labs", label: "Labs", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { href: "/chaos", label: "Chaos", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { href: "/registry", label: "Registry", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r border-border bg-canvas-subtle flex flex-col z-40 max-lg:w-[56px]">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
        <div className="w-6 h-6 rounded bg-accent-fg flex items-center justify-center">
          <span className="text-white text-xs font-bold">DL</span>
        </div>
        <span className="text-fg-default font-semibold text-sm max-lg:hidden">DistributedLab</span>
      </div>
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-accent-subtle text-accent-fg font-medium"
                  : "text-fg-muted hover:bg-neutral-muted hover:text-fg-default"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="max-lg:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
