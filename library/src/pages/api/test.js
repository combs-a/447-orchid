import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.query('SHOW TABLES');
    await connection.end();

    res.status(200).json({ tables: rows });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
}
