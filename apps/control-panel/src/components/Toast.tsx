"use client";

import { useState, useEffect, useCallback } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function showToast(message: string, type: Toast["type"] = "info") {
  const toast: Toast = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`rounded-[6px] border px-4 py-3 text-table text-fg-default shadow-[0_4px_12px_rgba(0,0,0,0.1)] animate-[slideIn_200ms_ease-out] ${toastClass(toast.type)}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function toastClass(type: Toast["type"]) {
  if (type === "success") return "border-success-fg bg-success-subtle";
  if (type === "error") return "border-danger-fg bg-danger-subtle";
  if (type === "warning") return "border-attention-fg bg-attention-subtle";
  return "border-border bg-canvas-subtle";
}
