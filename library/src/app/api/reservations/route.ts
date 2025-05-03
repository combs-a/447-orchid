import { NextResponse } from "next/server";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";

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
        i.description,
        i.quantity_available,
        i.reservation_amount
      FROM reservation r
      JOIN item i ON r.item_id = i.item_id
      WHERE r.account_id = ?
      ORDER BY r.reservation_date DESC
      `,
      [account_id]
    );

    return NextResponse.json(rows as ReservationWithItem[]);
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
// POST: for creating a new reservation
export async function POST(req: Request) {
  const { item_id, account_id, reservation_date, reservation_end_date } = await req.json();

  // Validate required fields
  if (!item_id || !account_id || !reservation_date || !reservation_end_date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let connection;
  try {
    // Connect to the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Start a transaction
    await connection.beginTransaction();

    // Insert the reservation into the `reservations` table
    const insertReservationSQL = `
      INSERT INTO reservation (item_id, account_id, reservation_date, reservation_end_date)
      VALUES (?, ?, ?, ?)
    `;
    console.log("Executing SQL:", insertReservationSQL);

    const [reservationResult] = await connection.execute<ResultSetHeader>(
      insertReservationSQL,
      [item_id, account_id, reservation_date, reservation_end_date]
    );

    // update reservation amount in the `item` table
    const updateItemSQL = `
    UPDATE item
    SET reservation_amount = reservation_amount + 1
    WHERE item_id = ${item_id}
  `;
  console.log("Executing SQL:", updateItemSQL);

  const [updateResult] = await connection.execute<ResultSetHeader>(
    updateItemSQL
  );

  if (updateResult.affectedRows === 0) {
    throw new Error("Failed to update reservation amount for the item.");
  }
  
    // Commit the transaction
    await connection.commit();

    return NextResponse.json({ success: true, reservation_id: reservationResult.insertId });
  } catch (err) {
    console.error("Error creating reservation:", err);

    // Rollback the transaction in case of an error
    if (connection) {
      await connection.rollback();
    }

    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}