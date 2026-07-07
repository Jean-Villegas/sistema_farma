const pool = require('../config/db');

class MedicamentoModel {
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM medicamentos ORDER BY nombre ASC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM medicamentos WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async search(term) {
    const pattern = `%${term}%`;
    const [rows] = await pool.execute(
      `SELECT * FROM medicamentos 
       WHERE nombre LIKE ? 
          OR laboratorio LIKE ? 
          OR categoria LIKE ?
          OR descripcion LIKE ?
          OR dosis LIKE ?
          OR efectos_secundarios LIKE ?
          OR contraindicaciones LIKE ?
          OR presentacion LIKE ?
       ORDER BY 
         CASE WHEN nombre LIKE ? THEN 0
              WHEN categoria LIKE ? THEN 1
              WHEN descripcion LIKE ? THEN 2
              ELSE 3 END,
         nombre ASC`,
      [pattern, pattern, pattern, pattern, pattern, pattern, pattern, pattern,
       pattern, pattern, pattern]
    );
    return rows;
  }

  static async findByCategoria(categoria) {
    const [rows] = await pool.execute(
      'SELECT * FROM medicamentos WHERE categoria = ? ORDER BY nombre ASC',
      [categoria]
    );
    return rows;
  }

  static async create({ nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones, icono, color }) {
    const [result] = await pool.execute(
      `INSERT INTO medicamentos 
       (nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones, icono, color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones, icono || null, color || null]
    );
    return result.insertId;
  }

  static async update(id, { nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones, icono, color }) {
    const [result] = await pool.execute(
      `UPDATE medicamentos 
       SET nombre = ?, descripcion = ?, presentacion = ?, dosis = ?, laboratorio = ?, 
           categoria = ?, efectos_secundarios = ?, contraindicaciones = ?, icono = ?, color = ?
       WHERE id = ?`,
      [nombre, descripcion, presentacion, dosis, laboratorio, categoria, efectos_secundarios, contraindicaciones, icono || null, color || null, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM medicamentos WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getCategorias() {
    const [rows] = await pool.execute(
      'SELECT DISTINCT categoria FROM medicamentos WHERE categoria IS NOT NULL ORDER BY categoria ASC'
    );
    return rows.map(r => r.categoria);
  }

  static async getStats() {
    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) AS total FROM medicamentos'
    );
    const [categorias] = await pool.execute(
      `SELECT categoria, COUNT(*) AS count FROM medicamentos
       WHERE categoria IS NOT NULL
       GROUP BY categoria
       ORDER BY categoria ASC`
    );
    const [[{ laboratorios }]] = await pool.execute(
      'SELECT COUNT(DISTINCT laboratorio) AS laboratorios FROM medicamentos WHERE laboratorio IS NOT NULL'
    );
    return { total, laboratorios, categorias };
  }
  static async addFavorito(usuarioId, medicamentoId) {
    try {
      const [result] = await pool.execute(
        'INSERT IGNORE INTO medicamentos_favoritos (usuario_id, medicamento_id) VALUES (?, ?)',
        [usuarioId, medicamentoId]
      );
      return result.affectedRows > 0 || result.warningStatus > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async removeFavorito(usuarioId, medicamentoId) {
    const [result] = await pool.execute(
      'DELETE FROM medicamentos_favoritos WHERE usuario_id = ? AND medicamento_id = ?',
      [usuarioId, medicamentoId]
    );
    return result.affectedRows > 0;
  }

  static async getFavoritosByUser(usuarioId) {
    const [rows] = await pool.execute(`
      SELECT m.* 
      FROM medicamentos m
      JOIN medicamentos_favoritos mf ON m.id = mf.medicamento_id
      WHERE mf.usuario_id = ?
      ORDER BY mf.created_at DESC
    `, [usuarioId]);
    return rows;
  }

  static async isFavorito(usuarioId, medicamentoId) {
    const [rows] = await pool.execute(
      'SELECT 1 FROM medicamentos_favoritos WHERE usuario_id = ? AND medicamento_id = ?',
      [usuarioId, medicamentoId]
    );
    return rows.length > 0;
  }
}

module.exports = MedicamentoModel;
