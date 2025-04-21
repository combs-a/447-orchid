import type { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

type ReservationWithItem = {
  reservation_id: number;
  reservation_date: string;
  reservation_end_date: string;
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
  reservation_amount: number;
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
        r.reservation_id,
        r.reservation_date,
        r.reservation_end_date,
        r.item_id,
        i.title,
        i.description,
        i.quantity_available,
        i.reservation_amount
      FROM reservations r
      JOIN item i ON r.item_id = i.item_id
      WHERE r.account_id = ?
      ORDER BY r.reservation_date DESC
      `,
      [account_id]
    );

    await connection.end();

    const reservations = rows as ReservationWithItem[];
    res.status(200).json(reservations);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
