"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface UseWebSocketOptions {
  onMessage?: (message: IMessage) => void;
  topics?: string[];
}

export function useWebSocket({ onMessage, topics = [] }: UseWebSocketOptions) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:3001/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        topics.forEach((topic) => {
          client.subscribe(topic, (message: IMessage) => {
            onMessage?.(message);
          });
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const send = useCallback((destination: string, body: unknown) => {
    clientRef.current?.publish({
      destination,
      body: JSON.stringify(body),
    });
  }, []);

  return { connected, send };
}
