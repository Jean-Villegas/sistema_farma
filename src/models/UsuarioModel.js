const bcrypt = require('bcryptjs');
const pool = require('../config/db');

class UsuarioModel {
  static findAll() {
    return new Promise((resolve, reject) => {
      pool.execute('SELECT id, username, email, rol, created_at FROM usuarios')
        .then(([rows]) => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.execute(`
        SELECT u.id, u.username, u.email, u.rol, u.created_at,
               COALESCE(u.bio, '') as bio,
               COALESCE(c.cedula, m.cedula) as cedula,
               COALESCE(c.nombre, u.username) as nombre_completo,
               c.apellido, c.telefono as telefono_cliente, m.telefono as telefono_medico,
               m.especialidad
        FROM usuarios u
        LEFT JOIN clientes c ON u.id = c.usuario_id
        LEFT JOIN medicos m ON u.id = m.usuario_id
        WHERE u.id = ?
      `, [id])
        .then(([rows]) => resolve(rows[0] || null))
        .catch(err => reject(err));
    });
  }

  static async ensureBioColumn() {
    try {
      await pool.execute('ALTER TABLE usuarios ADD COLUMN bio TEXT NULL');
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }
  }

  static async findPublicById(id) {
    await this.ensureBioColumn();
    const [rows] = await pool.execute(`
      SELECT u.id, u.username, u.rol, u.created_at,
             COALESCE(u.bio, '') as bio,
             COALESCE(c.nombre, u.username) as nombre,
             COALESCE(c.apellido, '') as apellido,
             m.especialidad,
             (SELECT COUNT(*) FROM foros f WHERE f.autor_id = u.id) as publicaciones_count
      FROM usuarios u
      LEFT JOIN clientes c ON u.id = c.usuario_id
      LEFT JOIN medicos m ON u.id = m.usuario_id
      WHERE u.id = ?
    `, [id]);
    return rows[0] || null;
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      pool.execute('SELECT * FROM usuarios WHERE username = ?', [username])
        .then(([rows]) => resolve(rows[0] || null))
        .catch(err => reject(err));
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      pool.execute('SELECT id FROM usuarios WHERE email = ?', [email])
        .then(([rows]) => resolve(rows[0] || null))
        .catch(err => reject(err));
    });
  }

  static findByUsernameOrEmail(username, email) {
    return new Promise((resolve, reject) => {
      pool.execute('SELECT id FROM usuarios WHERE username = ? OR email = ?', [username, email])
        .then(([rows]) => resolve(rows[0] || null))
        .catch(err => reject(err));
    });
  }

  // Búsqueda eficiente por SQL (no carga todos a RAM)
  static search(term) {
    const pattern = `%${term}%`;
    return new Promise((resolve, reject) => {
      pool.execute(
        `SELECT id, username, email, rol, created_at
         FROM usuarios
         WHERE username LIKE ? OR email LIKE ?
         ORDER BY username ASC
         LIMIT 50`,
        [pattern, pattern]
      )
        .then(([rows]) => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static create({ username, password, email, rol }) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10)
        .then(hashedPassword => {
          return pool.execute(
            'INSERT INTO usuarios (username, password, email, rol) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, rol]
          );
        })
        .then(([result]) => resolve(result.insertId))
        .catch(err => reject(err));
    });
  }

  static update(id, { username, email, rol, bio }) {
    return new Promise((resolve, reject) => {
      const updates = [];
      const values = [];

      if (username) {
        updates.push('username = ?');
        values.push(username);
      }
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      if (rol) {
        updates.push('rol = ?');
        values.push(rol);
      }
      if (bio !== undefined) {
        updates.push('bio = ?');
        values.push(bio);
      }

      if (updates.length === 0) {
        return resolve(false);
      }

      values.push(id);
      pool.execute(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`, values)
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.execute('DELETE FROM usuarios WHERE id = ?', [id])
        .then(() => resolve(true))
        .catch(err => reject(err));
    });
  }

  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UsuarioModel;
