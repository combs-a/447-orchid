import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

type User = {
  account_id: number;
  card_number: string;
  first_name: string;
  last_name: string;
};

export async function POST(req: Request) {
  try {
    const { cardNumber } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT account_id, card_number, first_name, last_name FROM account WHERE card_number = ?",
      [cardNumber]
    );
    await connection.end();

    const users = rows as User[];

    if (users.length > 0) {
      const user = users[0];
      return NextResponse.json({
        valid: true,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } else {
      return NextResponse.json({ valid: false });
    }
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
