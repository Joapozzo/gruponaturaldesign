'use client';

import { io, type Socket } from 'socket.io-client';
import { getAccessToken } from '@/lib/auth-client';
import type { AdminNotification } from '@/app/types/admin-notification.types';

export interface ServerToClientEvents {
  'admin.notification.created': (notification: AdminNotification) => void;
}

type AdminSocket = Socket<ServerToClientEvents>;

function getRealtimeBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
  return apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

class RealtimeService {
  private socket: AdminSocket | null = null;

  async connect(): Promise<AdminSocket> {
    if (this.socket?.connected) return this.socket;

    const token = await getAccessToken();
    if (!token) {
      throw new Error('No hay token de sesión para conectar realtime.');
    }

    this.socket = io(getRealtimeBaseUrl(), {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      auth: { token },
    }) as AdminSocket;

    const socket = this.socket;
    socket.io.on('reconnect_attempt', async () => {
      const nextToken = await getAccessToken();
      socket.auth = { token: nextToken };
    });

    return socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): AdminSocket | null {
    return this.socket;
  }
}

export const realtimeService = new RealtimeService();
