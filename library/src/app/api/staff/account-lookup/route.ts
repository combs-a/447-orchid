// app/api/staff/account-lookup/route.ts

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const card = searchParams.get("card");

  if (!card) {
    return NextResponse.json({ error: "Missing card number" }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      "SELECT * FROM account WHERE card_number = ?",
      [card]
    );

    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
