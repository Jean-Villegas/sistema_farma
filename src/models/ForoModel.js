const pool = require('../config/db');

class ForoModel {
  static async _attachMedicamentos(posts) {
    if (!posts || posts.length === 0) return posts;
    for (let post of posts) {
      const [meds] = await pool.execute(`
        SELECT m.id, m.nombre, m.categoria
        FROM medicamentos m
        JOIN foro_medicamentos fm ON m.id = fm.medicamento_id
        WHERE fm.foro_id = ?
      `, [post.id]);
      post.medicamentos = meds;
    }
    return posts;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT f.id, f.titulo, f.contenido, f.created_at,
             u.username as autor_username, u.id as autor_id, u.rol as autor_rol,
             (SELECT COUNT(*) FROM foro_comentarios fc WHERE fc.foro_id = f.id) as comentarios_count
      FROM foros f
      JOIN usuarios u ON f.autor_id = u.id
      ORDER BY f.created_at DESC
    `);
    return await this._attachMedicamentos(rows);
  }

  static async search(term) {
    const query = `%${term}%`;
    const [rows] = await pool.execute(`
      SELECT f.id, f.titulo, f.contenido, f.created_at,
             u.username as autor_username, u.id as autor_id, u.rol as autor_rol,
             (SELECT COUNT(*) FROM foro_comentarios fc WHERE fc.foro_id = f.id) as comentarios_count
      FROM foros f
      JOIN usuarios u ON f.autor_id = u.id
      WHERE f.titulo LIKE ? OR f.contenido LIKE ? OR u.username LIKE ?
      ORDER BY f.created_at DESC
    `, [query, query, query]);
    return await this._attachMedicamentos(rows);
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.execute(`
        SELECT f.id, f.titulo, f.contenido, f.created_at,
               u.username as autor_username, u.id as autor_id, u.rol as autor_rol
        FROM foros f
        JOIN usuarios u ON f.autor_id = u.id
        WHERE f.id = ?
      `, [id])
        .then(([rows]) => resolve(rows[0] || null))
        .catch(err => reject(err));
    });
  }

  static async findByAutorId(autorId) {
    const [rows] = await pool.execute(`
      SELECT f.id, f.titulo, f.contenido, f.created_at,
             u.username as autor_username, u.id as autor_id, u.rol as autor_rol,
             (SELECT COUNT(*) FROM foro_comentarios fc WHERE fc.foro_id = f.id) as comentarios_count
      FROM foros f
      JOIN usuarios u ON f.autor_id = u.id
      WHERE f.autor_id = ?
      ORDER BY f.created_at DESC
    `, [autorId]);
    return await this._attachMedicamentos(rows);
  }

  static async update(id, { titulo, contenido }) {
    const updates = [];
    const values = [];
    if (titulo !== undefined) {
      updates.push('titulo = ?');
      values.push(titulo);
    }
    if (contenido !== undefined) {
      updates.push('contenido = ?');
      values.push(contenido);
    }
    if (updates.length === 0) return false;
    values.push(id);
    await pool.execute(`UPDATE foros SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  }

  static async create({ autorId, titulo, contenido, medicamentosIds }) {
    const [result] = await pool.execute(
      'INSERT INTO foros (autor_id, titulo, contenido) VALUES (?, ?, ?)',
      [autorId, titulo, contenido]
    );
    const foroId = result.insertId;

    if (medicamentosIds && Array.isArray(medicamentosIds) && medicamentosIds.length > 0) {
      for (const medId of medicamentosIds) {
        await pool.execute(
          'INSERT IGNORE INTO foro_medicamentos (foro_id, medicamento_id) VALUES (?, ?)',
          [foroId, medId]
        );
      }
    }
    return foroId;
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.execute('DELETE FROM foros WHERE id = ?', [id])
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }
}

// Modelo de Comentarios del Foro
class ForoComentarioModel {
  static findByForoId(foroId) {
    return new Promise((resolve, reject) => {
      pool.execute(`
        SELECT fc.id, fc.comentario, fc.created_at,
               u.username as autor_username, u.id as autor_id, u.rol as autor_rol
        FROM foro_comentarios fc
        JOIN usuarios u ON fc.autor_id = u.id
        WHERE fc.foro_id = ?
        ORDER BY fc.created_at ASC
      `, [foroId])
        .then(([rows]) => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static create({ foroId, autorId, comentario }) {
    return new Promise((resolve, reject) => {
      pool.execute(
        'INSERT INTO foro_comentarios (foro_id, autor_id, comentario) VALUES (?, ?, ?)',
        [foroId, autorId, comentario]
      )
        .then(([result]) => resolve(result.insertId))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.execute('DELETE FROM foro_comentarios WHERE id = ?', [id])
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }
}

module.exports = { ForoModel, ForoComentarioModel };
