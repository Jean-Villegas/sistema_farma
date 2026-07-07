const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/categorias', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.getCategorias(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.getStats(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Rutas de Favoritos
router.get('/favoritos/me', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.getFavoritos(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.get('/favoritos/check/:id', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.checkFavorito(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.post('/:id/favorito', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.addFavorito(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.delete('/:id/favorito', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.removeFavorito(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.getAll(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await medicamentoController.getById(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Solo Médicos y Administradores pueden crear, editar o eliminar medicamentos
router.post('/', authenticateToken, authorizeRoles('Medico', 'Administrador'), async (req, res) => {
  try {
    const result = await medicamentoController.create(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.put('/:id', authenticateToken, authorizeRoles('Medico', 'Administrador'), async (req, res) => {
  try {
    const result = await medicamentoController.update(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.delete('/:id', authenticateToken, authorizeRoles('Medico', 'Administrador'), async (req, res) => {
  try {
    const result = await medicamentoController.remove(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
