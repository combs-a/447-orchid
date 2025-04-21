import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

type User = {
  id: number;
  card_number: string;
  name?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cardNumber } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM account WHERE card_number = ?',
      [cardNumber]
    );
    await connection.end();

    const users = rows as User[];

    res.status(200).json({ valid: users.length > 0 });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
