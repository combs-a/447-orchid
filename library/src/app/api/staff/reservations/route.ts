import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const account_id = searchParams.get("account_id");
  
    if (!account_id) {
      return NextResponse.json({ error: "Missing account ID" }, { status: 400 });
    }
  let connection;
  try {
    connection = await mysql.createConnection({
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
          i.description
        FROM reservation r
        JOIN item i ON r.item_id = i.item_id
        WHERE r.account_id = ?
        ORDER BY r.reservation_date DESC
        `,
        [account_id]
      );
      

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Reservation fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
