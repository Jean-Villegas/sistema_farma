const pool = require('../config/db');

class ChatModel {
  static async ensureTable() {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS chat_mensajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        emisor_id INT NOT NULL,
        receptor_id INT NOT NULL,
        contenido TEXT NOT NULL,
        leido TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_chat_pair (emisor_id, receptor_id),
        INDEX idx_chat_created (created_at)
      )
    `);
  }

  static async getContactos(excludeUserId) {
    const [rows] = await pool.execute(
      `SELECT id, username, rol FROM usuarios WHERE id != ? ORDER BY username ASC`,
      [excludeUserId]
    );
    return rows;
  }

  static async getHistorial(userId, peerId, limit = 100) {
    const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
    const [rows] = await pool.execute(
      `SELECT id, emisor_id, receptor_id, contenido, leido, created_at
       FROM chat_mensajes
       WHERE (emisor_id = ? AND receptor_id = ?) OR (emisor_id = ? AND receptor_id = ?)
       ORDER BY created_at ASC
       LIMIT ${safeLimit}`,
      [userId, peerId, peerId, userId]
    );
    return rows;
  }

  static async create({ emisorId, receptorId, contenido }) {
    const [result] = await pool.execute(
      `INSERT INTO chat_mensajes (emisor_id, receptor_id, contenido) VALUES (?, ?, ?)`,
      [emisorId, receptorId, contenido]
    );
    const [rows] = await pool.execute(
      `SELECT id, emisor_id, receptor_id, contenido, leido, created_at FROM chat_mensajes WHERE id = ?`,
      [result.insertId]
    );
    return rows[0];
  }

  static async markRead(userId, peerId) {
    await pool.execute(
      `UPDATE chat_mensajes SET leido = 1
       WHERE receptor_id = ? AND emisor_id = ? AND leido = 0`,
      [userId, peerId]
    );
  }
}

module.exports = ChatModel;
