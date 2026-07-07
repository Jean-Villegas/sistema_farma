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
    CREATE TABLE IF NOT EXISTS foro_medicamentos (
      foro_id INT NOT NULL,
      medicamento_id INT NOT NULL,
      PRIMARY KEY (foro_id, medicamento_id),
      FOREIGN KEY (foro_id) REFERENCES foros(id) ON DELETE CASCADE,
      FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
    )
  `);

  console.log('Tabla foro_medicamentos creada.');
  await conn.end();
}

migrate().catch(err => { console.error(err.message); process.exit(1); });
