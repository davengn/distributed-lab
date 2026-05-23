"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas-default">
      <Sidebar />
      <div className="ml-[240px] max-lg:ml-[56px]">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
