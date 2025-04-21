import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

type LoanWithItem = {
  loan_id: number;
  loan_out_date: string;
  due_date: string;
  return_date: string | null;
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { account_id } = req.query;

  if (!account_id || typeof account_id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid account ID' });
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
      `
      SELECT
        l.loan_id,
        l.loan_out_date,
        l.due_date,
        l.return_date,
        l.item_id,
        i.title,
        i.description,
        i.quantity_available
      FROM loan l
      JOIN item i ON l.item_id = i.item_id
      WHERE l.account_id = ?
      ORDER BY l.loan_out_date DESC
      `,
      [account_id]
    );

    await connection.end();

    res.status(200).json(rows as LoanWithItem[]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
