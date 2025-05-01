// app/api/staff/item-upload/route.ts

import { NextResponse } from "next/server";
import mysql, { ResultSetHeader } from "mysql2/promise";

export async function POST(req: Request) {
    try {
      const {
        title,
        description,
        item_type_id,
        genre_id,
        ISBN,
        publication_year,
        publication_date,
        publisher,
        issue_number,
        explicit,
        rating_id,
        total_quantity,
        quantity_available,
        reservation_amount,
      } = await req.json();
  
      // Validate required fields
      if (!title || !description || !item_type_id || !genre_id || !publication_year || !publication_date || !publisher || !total_quantity || !quantity_available || !reservation_amount) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const totalQty = parseInt(total_quantity);
      const availableQty = parseInt(quantity_available);
      const reservationAmt = parseInt(reservation_amount);
  
      if (isNaN(totalQty) || totalQty < 0 || isNaN(availableQty) || availableQty < 0 || isNaN(reservationAmt) || reservationAmt < 0) {
        return NextResponse.json({ error: "Invalid quantities" }, { status: 400 });
      }
  
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
  
      console.log("Uploading item with:", {
        title,
        description,
        item_type_id,
        genre_id,
        ISBN,
        publication_year,
        publication_date,
        publisher,
        issue_number,
        explicit,
        rating_id,
        total_quantity: totalQty,
        quantity_available: availableQty,
        reservation_amount: reservationAmt,
      });
  
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO item (
          title, description, item_type_id, genre_id, ISBN, publication_year, publication_date,
          publisher, issue_number, explicit, rating_id, total_quantity, quantity_available, reservation_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          item_type_id,
          genre_id,
          ISBN || null,
          publication_year,
          publication_date,
          publisher,
          issue_number || null,
          explicit || null,
          rating_id || null,
          totalQty,
          availableQty,
          reservationAmt,
        ]
      );
  
      await connection.end();
  
      return NextResponse.json({ success: true, item_id: result.insertId });
    } catch (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  