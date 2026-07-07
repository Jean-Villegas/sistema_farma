const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'sistema' });
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medicamentos_favoritos (
        usuario_id INT NOT NULL,
        medicamento_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (usuario_id, medicamento_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabla medicamentos_favoritos creada.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_medicamentos (
        post_id INT NOT NULL,
        medicamento_id INT NOT NULL,
        PRIMARY KEY (post_id, medicamento_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabla post_medicamentos creada.');
  } catch(e) {
    console.error('Error:', e);
  }
  process.exit(0);
}
run();
