const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS medicamentos_favoritos (
      usuario_id INT NOT NULL,
      medicamento_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (usuario_id, medicamento_id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
    )
  `);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS post_medicamentos (
      post_id INT NOT NULL,
      medicamento_id INT NOT NULL,
      PRIMARY KEY (post_id, medicamento_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
    )
  `);

  console.log('Tablas medicamentos_favoritos y post_medicamentos creadas correctamente.');
  await conn.end();
}

migrate().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
