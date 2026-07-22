const ChatModel = require('../models/ChatModel');
const UsuarioModel = require('../models/UsuarioModel');

const getContactos = async (req) => {
  try {
    await ChatModel.ensureTable();
    const contactos = await ChatModel.getContactos(req.user.id);
    return { status: 200, data: contactos };
  } catch (error) {
    console.error('Error getContactos:', error);
    return { status: 500, data: { mensaje: 'Error al obtener contactos' } };
  }
};

const getHistorial = async (req) => {
  try {
    await ChatModel.ensureTable();
    const peerId = parseInt(req.params.userId, 10);
    if (!peerId) {
      return { status: 400, data: { mensaje: 'Usuario inválido' } };
    }
    const peer = await UsuarioModel.findById(peerId);
    if (!peer) {
      return { status: 404, data: { mensaje: 'Usuario no encontrado' } };
    }
    const mensajes = await ChatModel.getHistorial(req.user.id, peerId);
    await ChatModel.markRead(req.user.id, peerId);
    return { status: 200, data: mensajes };
  } catch (error) {
    console.error('Error getHistorial:', error);
    return { status: 500, data: { mensaje: 'Error al obtener historial' } };
  }
};

module.exports = { getContactos, getHistorial };
