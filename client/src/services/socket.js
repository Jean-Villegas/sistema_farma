import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  return socket;
}

export function connectSocket() {
  if (socket?.connected) return socket;

  // En dev Vite hace proxy de /socket.io → backend (misma cookie de sesión)
  socket = io({
    path: '/socket.io',
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
