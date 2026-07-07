const pool = require('../config/db');

class PostModel {
  static async _attachMedicamentos(posts) {
    if (!posts || posts.length === 0) return posts;
    for (let post of posts) {
      const [meds] = await pool.execute(`
        SELECT m.id, m.nombre, m.icono_clase, m.categoria 
        FROM medicamentos m
        JOIN post_medicamentos pm ON m.id = pm.medicamento_id
        WHERE pm.post_id = ?
      `, [post.id]);
      post.medicamentos = meds;
    }
    return posts;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT p.id, p.titulo, p.contenido, p.tipo, p.rutina_recomendada, p.created_at,
             u_medico.username as medico_username, u_medico.id as medico_id,
             u_cliente.username as cliente_username, u_cliente.id as cliente_id,
             c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM posts p
      JOIN usuarios u_medico ON p.medico_id = u_medico.id
      JOIN usuarios u_cliente ON p.cliente_id = u_cliente.id
      LEFT JOIN clientes c ON u_cliente.id = c.usuario_id
      ORDER BY p.created_at DESC
    `);
    return await this._attachMedicamentos(rows);
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT p.id, p.titulo, p.contenido, p.tipo, p.rutina_recomendada, p.created_at,
             u_medico.username as medico_username, u_medico.id as medico_id,
             u_cliente.username as cliente_username, u_cliente.id as cliente_id,
             c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM posts p
      JOIN usuarios u_medico ON p.medico_id = u_medico.id
      JOIN usuarios u_cliente ON p.cliente_id = u_cliente.id
      LEFT JOIN clientes c ON u_cliente.id = c.usuario_id
      WHERE p.id = ?
    `, [id]);
    const posts = await this._attachMedicamentos(rows);
    return posts[0] || null;
  }

  static async findByClienteId(clienteId) {
    const [rows] = await pool.execute(`
      SELECT p.id, p.titulo, p.contenido, p.tipo, p.rutina_recomendada, p.created_at,
             u_medico.username as medico_username, u_medico.id as medico_id,
             c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM posts p
      JOIN usuarios u_medico ON p.medico_id = u_medico.id
      JOIN usuarios u_cliente ON p.cliente_id = u_cliente.id
      LEFT JOIN clientes c ON u_cliente.id = c.usuario_id
      WHERE p.cliente_id = ?
      ORDER BY p.created_at DESC
    `, [clienteId]);
    return await this._attachMedicamentos(rows);
  }

  static async create({ medicoId, clienteId, titulo, contenido, tipo, rutina_recomendada, medicamentosIds }) {
    const [result] = await pool.execute(
      'INSERT INTO posts (medico_id, cliente_id, titulo, contenido, tipo, rutina_recomendada) VALUES (?, ?, ?, ?, ?, ?)',
      [medicoId, clienteId, titulo, contenido, tipo || 'diagnostico', rutina_recomendada || null]
    );
    const postId = result.insertId;

    if (medicamentosIds && Array.isArray(medicamentosIds) && medicamentosIds.length > 0) {
      for (const medId of medicamentosIds) {
        await pool.execute(
          'INSERT IGNORE INTO post_medicamentos (post_id, medicamento_id) VALUES (?, ?)',
          [postId, medId]
        );
      }
    }
    return postId;
  }

  static async update(id, { titulo, contenido, tipo }) {
    const updates = [];
    const values = [];

    if (titulo) { updates.push('titulo = ?'); values.push(titulo); }
    if (contenido) { updates.push('contenido = ?'); values.push(contenido); }
    if (tipo) { updates.push('tipo = ?'); values.push(tipo); }

    if (updates.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = PostModel;
