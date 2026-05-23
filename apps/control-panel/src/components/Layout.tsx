"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas-default text-fg-default">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="min-w-0 flex-1 overflow-y-auto p-6 max-lg:p-4">{children}</main>
      </div>
    </div>
  );
}
