import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  const { loan_id } = await req.json();

  if (!loan_id) {
    return NextResponse.json({ error: "Missing loan_id" }, { status: 400 });
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

    // Update the loan’s return_date to today
    await connection.execute(
      `UPDATE loan SET return_date = CURDATE() WHERE loan_id = ?`,
      [loan_id]
    );

    // Update the item’s quantity_available by incrementing it by 1
    await connection.execute(
      `UPDATE item SET quantity_available = quantity_available + 1 
      WHERE item_id = (SELECT item_id FROM loan WHERE loan_id = ?)`,
      [loan_id]
    );

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Return loan error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
