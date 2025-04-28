import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

type Item = {
  item_id: number;
  item_type_id: number;
  title: string;
  description: string;
  genre_id: number;
  isbn: string;
  publication_year: number;
  publication_date: string;
  publisher: string;
  issue_number: number | null;
  explicit: boolean;
  rating_id: number | null;
  total_quantity: number;
  quantity_available: number;
  reservation_amount: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const item_id = searchParams.get('item_id');
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'All';
  const sort = searchParams.get('sort') || 'A-Z';

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    let query = `
      SELECT
        i.item_id,
        i.item_type_id,
        i.title,
        i.description,
        g.genre_id,
        i.isbn,
        i.publication_year,
        i.publication_date,
        i.publisher,
        i.issue_number,
        i.explicit,
        ra.rating_id,
        i.total_quantity,
        i.quantity_available,
        i.reservation_amount
      FROM item i
      LEFT JOIN rating ra ON i.rating_id = ra.rating_id
      LEFT JOIN genre g ON i.genre_id = g.genre_id
      LEFT JOIN item_type it ON i.item_type_id = it.item_type_id
    `;
    const params: (string | number)[] = [];

    if (item_id) {
      query += ` WHERE i.item_id = ?`;
      params.push(item_id);
    } else {
      query += ` WHERE i.title LIKE ?`;
      params.push(`%${search}%`);

      if (filter !== 'All') {
        query += ` AND i.item_type_id = ?`;
        if (filter === 'Book') params.push(1); 
        else if (filter === 'DVD') params.push(2); 
        else if (filter === 'CD') params.push(3); 
        else if (filter === 'Magazine') params.push(4); 
        else {
            // If the filter value is invalid, return an error response
            return NextResponse.json({ error: 'Invalid filter value' }, { status: 400 });
        }
    }

      if (sort === 'A-Z') {
        query += ` ORDER BY i.title ASC`;
      } else if (sort === 'Z-A') {
        query += ` ORDER BY i.title DESC`;
      } else if (sort === 'Newest') {
        query += ` ORDER BY i.publication_year DESC`;
      } else if (sort === 'Oldest') {
        query += ` ORDER BY i.publication_year ASC`;
      }
    }

    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    return NextResponse.json(rows as Item[]);
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}