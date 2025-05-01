import { NextResponse } from "next/server";
import mysql, { ResultSetHeader } from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { account_id, address, phone_number, first_name, last_name } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE account SET address = ?, phone_number = ?, first_name = ?, last_name = ? WHERE account_id = ?`,
      [address, phone_number, first_name, last_name, account_id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      console.warn("No rows were updated — possibly invalid account_id");
      return NextResponse.json({ success: false, message: "No changes made." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB update error:", error);
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { account_id } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [result] = await connection.execute<ResultSetHeader>(
      `DELETE FROM account WHERE account_id = ?`,
      [account_id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Account not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB delete error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
