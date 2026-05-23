"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { useWebSocket } from "./useWebSocket";

interface ServiceInfo {
  id: string;
  name: string;
  status: string;
  version: string;
  port: number;
  cpuPercent: number;
  memoryPercent: number;
  memoryLimitMB: number;
}

export function useServices() {
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const data = await apiClient.get<ServiceInfo[]>("/services");
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 10000);
    return () => clearInterval(interval);
  }, [fetchServices]);

  useWebSocket({
    topics: ["/topic/services"],
    onMessage: (msg) => {
      try {
        const parsed = JSON.parse(msg.body);
        if (parsed.type === "SERVICE_UPDATE") {
          setServices((prev) =>
            prev.map((s) =>
              s.name === parsed.payload.name ? { ...s, ...parsed.payload } : s
            )
          );
        }
      } catch {}
    },
  });

  return { services, loading, error, refetch: fetchServices };
}
