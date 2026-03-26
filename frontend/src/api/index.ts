import { io } from 'socket.io-client';
import { Incident } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export async function fetchIncidents(): Promise<Incident[]> {
  const response = await fetch(`${SOCKET_URL}/api/incidents`);
  if (!response.ok) throw new Error('Failed to fetch incidents');
  return response.json();
}

export async function acknowledgeIncident(
  incidentId: string,
): Promise<Incident> {
  const response = await fetch(
    `${SOCKET_URL}/api/incidents/${incidentId}/acknowledge`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!response.ok) throw new Error('Failed to acknowledge incident');
  return response.json();
}

export async function resolveIncident(incidentId: string): Promise<Incident> {
  const response = await fetch(
    `${SOCKET_URL}/api/incidents/${incidentId}/resolve`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!response.ok) throw new Error('Failed to resolve incident');
  return response.json();
}

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
