import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const card = searchParams.get("card");

  if (!card) {
    return NextResponse.json({ error: "Missing card number" }, { status: 400 });
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
      "SELECT * FROM account WHERE card_number = ?",
      [card]
    );

    const account = rows[0] as Account | undefined;

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
