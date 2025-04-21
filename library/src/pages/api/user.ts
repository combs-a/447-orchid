import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

type Account = {
  account_id: number;
  first_name: string;
  last_name: string;
  middle_initial: string | null;
  card_number: string;
  account_type_id: number;
  restricted: boolean;
  address: string | null;
  birthdate: string;
  email: string;
  phone_number: string | null;
  parent_id: number | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { card } = req.query;

  if (!card || typeof card !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid card number' });
  }

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
      [card]
    );
    await connection.end();

    const account = rows[0] as Account | undefined;

    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
