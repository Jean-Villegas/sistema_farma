const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const medicoRoutes = require('./routes/medicos');
const clienteRoutes = require('./routes/clientes');
const postRoutes = require('./routes/posts');
const foroRoutes = require('./routes/foros');
const perfilSaludRoutes = require('./routes/perfilSalud');
const analisisRoutes = require('./routes/analisis');
const medicamentosRoutes = require('./routes/medicamentos');
const chatRoutes = require('./routes/chat');
const { setupChatSocket } = require('./socket/chat');

const path = require('path');

const app = express();
const server = http.createServer(app);

const corsOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    credentials: true,
  },
});

setupChatSocket(io);

app.use(cors({
  credentials: true,
  origin: corsOrigins,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/foros', foroRoutes);
app.use('/api/perfiles-salud', perfilSaludRoutes);
app.use('/api/analisis', analisisRoutes);
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/chat', chatRoutes);

// Migración ligera: columna bio en usuarios
const UsuarioModel = require('./models/UsuarioModel');
UsuarioModel.ensureBioColumn().catch((err) => console.error('ensureBioColumn:', err.message));

app.get('/api', (req, res) => {
  res.json({ mensaje: 'API del Sistema de Salud funcionando' });
});

// SPA fallback (React Router)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
    if (err) next();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
