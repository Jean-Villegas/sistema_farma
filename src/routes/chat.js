const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/contactos', authenticateToken, async (req, res) => {
  try {
    const result = await chatController.getContactos(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.get('/historial/:userId', authenticateToken, async (req, res) => {
  try {
    const result = await chatController.getHistorial(req);
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
