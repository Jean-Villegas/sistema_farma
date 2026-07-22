const jwt = require('jsonwebtoken');
const ChatModel = require('../models/ChatModel');
const UsuarioModel = require('../models/UsuarioModel');
require('dotenv').config();

function parseCookies(header = '') {
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (key) acc[key] = decodeURIComponent(rest.join('=') || '');
    return acc;
  }, {});
}

function parseToken(socket) {
  const cookies = parseCookies(socket.handshake.headers.cookie || '');
  const fromCookie = cookies.token;
  const fromAuth = socket.handshake.auth?.token;
  const fromHeader = socket.handshake.headers.authorization?.split(' ')[1];
  return fromCookie || fromAuth || fromHeader;
}

function setupChatSocket(io) {
  const online = new Map(); // userId -> Set(socketId)

  io.use((socket, next) => {
    try {
      const token = parseToken(socket);
      if (!token) return next(new Error('No autorizado'));
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new Error('Token inválido'));
        socket.user = user;
        next();
      });
    } catch (error) {
      next(new Error('Error de autenticación'));
    }
  });

  const broadcastOnline = () => {
    io.emit('usuarios_online', [...online.keys()].map(Number));
  };

  io.on('connection', async (socket) => {
    const userId = Number(socket.user.id);
    if (!online.has(userId)) online.set(userId, new Set());
    online.get(userId).add(socket.id);
    socket.join(`user:${userId}`);
    broadcastOnline();

    try {
      await ChatModel.ensureTable();
    } catch (err) {
      console.error('Error ensure chat table:', err.message);
    }

    socket.on('enviar_mensaje', async (payload = {}) => {
      try {
        const receptorId = Number(payload.receptor_id);
        const contenido = typeof payload.contenido === 'string' ? payload.contenido.trim() : '';

        if (!receptorId || !contenido) {
          socket.emit('chat_error', { mensaje: 'Mensaje inválido' });
          return;
        }
        if (contenido.length > 1000) {
          socket.emit('chat_error', { mensaje: 'El mensaje es demasiado largo' });
          return;
        }
        if (receptorId === userId) {
          socket.emit('chat_error', { mensaje: 'No puedes enviarte mensajes a ti mismo' });
          return;
        }

        const receptor = await UsuarioModel.findById(receptorId);
        if (!receptor) {
          socket.emit('chat_error', { mensaje: 'Destinatario no encontrado' });
          return;
        }

        const mensaje = await ChatModel.create({
          emisorId: userId,
          receptorId,
          contenido,
        });

        io.to(`user:${userId}`).emit('nuevo_mensaje', mensaje);
        io.to(`user:${receptorId}`).emit('nuevo_mensaje', mensaje);
      } catch (error) {
        console.error('Error enviar_mensaje:', error);
        socket.emit('chat_error', { mensaje: 'No se pudo enviar el mensaje' });
      }
    });

    socket.on('disconnect', () => {
      const sockets = online.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) online.delete(userId);
      }
      broadcastOnline();
    });
  });
}

module.exports = { setupChatSocket };
