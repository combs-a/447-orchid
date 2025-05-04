import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  const { reservation_id } = await req.json();

  if (!reservation_id) {
    return NextResponse.json({ error: "Missing reservation_id" }, { status: 400 });
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
    await connection.execute(
      `UPDATE item SET reservation_amount = reservation_amount - 1 
      WHERE item_id = (SELECT item_id FROM reservation WHERE reservation_id = ?)`,
      [reservation_id]
    );
    
    await connection.execute(
      `DELETE FROM reservation WHERE reservation_id = ?`,
      [reservation_id]
    );
    
    // Update the reservation_amount in the item table
    


    await connection.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel reservation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
