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
          l.loan_id,
          l.loan_out_date,
          l.due_date,
          l.return_date,
          l.item_id,
          i.title,
          i.description
        FROM loan l
        JOIN item i ON l.item_id = i.item_id
        WHERE l.account_id = ?
        ORDER BY l.loan_out_date DESC
        `,
        [account_id]
      );
      

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Loan fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
