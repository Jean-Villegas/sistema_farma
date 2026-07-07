const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const medicoRoutes = require('./routes/medicos');
const clienteRoutes = require('./routes/clientes');
const postRoutes = require('./routes/posts');
const foroRoutes = require('./routes/foros');
const perfilSaludRoutes = require('./routes/perfilSalud');
const analisisRoutes = require('./routes/analisis');
const medicamentosRoutes = require('./routes/medicamentos');

const path = require('path');

const app = express();

// Middlewares
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
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

// Ruta de prueba API
app.get('/api', (req, res) => {
  res.json({ mensaje: 'API del Sistema de Salud funcionando' });
});

// Ruta raíz (servir React)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
