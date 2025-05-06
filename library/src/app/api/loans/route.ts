import { NextResponse } from "next/server";
import mysql, { RowDataPacket,ResultSetHeader } from "mysql2/promise";

type LoanWithItem = {
  loan_id: number;
  loan_out_date: string;
  due_date: string;
  return_date: string | null;
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
};
// GET: for retreiving all loans for a specific account
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
        i.description,
        i.quantity_available
      FROM loan l
      JOIN item i ON l.item_id = i.item_id
      WHERE l.account_id = ?
      ORDER BY l.loan_out_date DESC
      `,
      [account_id]
    );

    return NextResponse.json(rows as LoanWithItem[]);
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const account_id = searchParams.get("account_id"); // Retrieve account_id from query parameters

  const { item_id, loan_out_date, due_date } = await req.json(); // Other fields from the request body

  // Validate required fields
  if (!item_id || !account_id || !loan_out_date || !due_date) {
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

    // Log the SQL command for inserting the loan
    const insertLoanSQL = `
      INSERT INTO loan (item_id, account_id, loan_out_date, due_date)
      VALUES (${item_id}, ${account_id}, '${loan_out_date}', '${due_date}')
    `;
    console.log("Executing SQL:", insertLoanSQL);

    // Insert the loan into the `loan` table
    const [loanResult] = await connection.execute<ResultSetHeader>(
      insertLoanSQL
    );

    // Log the SQL command for updating the quantity
    const updateItemSQL = `
      UPDATE item
      SET quantity_available = quantity_available - 1
      WHERE item_id = ${item_id} AND quantity_available > 0
    `;
    console.log("Executing SQL:", updateItemSQL);

    // Update the `quantity_available` in the `item` table
    const [updateResult] = await connection.execute<ResultSetHeader>(
      updateItemSQL
    );

    // Check if the quantity was updated
    if (updateResult.affectedRows === 0) {
      throw new Error("Item is not available for loan.");
    }

    // Commit the transaction
    await connection.commit();

    return NextResponse.json({ success: true, loan_id: loanResult.insertId });
  } catch (err) {
    console.error("Error creating loan:", err);

    // Rollback the transaction in case of an error
    if (connection) {
      await connection.rollback();
    }

    return NextResponse.json(
      { error: "Failed to create loan" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
