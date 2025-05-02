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
        contributor_first_name,
        contributor_last_name,
        contributor_middle_initial,
        contribution_role_id,
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
        contributor_first_name,
        contributor_last_name,
        contributor_middle_initial,
        contribution_role_id,
      });
  
      try {
        // Create transaction to roll back if any record isn't uploaded successfully
        await connection.beginTransaction();

        // Upload item
        const [itemResult] = await connection.execute<ResultSetHeader>(
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
        const itemId = itemResult.insertId;

        // Upload contributor
        const [contributorResult] = await connection.execute<ResultSetHeader>(
          `INSERT INTO contributor (
            first_name, last_name, middle_initial
          ) VALUES (?, ?, ?)`,
          [
            contributor_first_name,
            contributor_last_name,
            contributor_middle_initial || null,
          ]
        );
        const contributorId = contributorResult.insertId;

        // Insert contribution
        await connection.execute(
          `INSERT INTO contribution (
            item_id, contributor_id, role_id
          ) VALUES (?, ?, ?)`,
          [
            itemId,
            contributorId,
            contribution_role_id,
          ]
        );

        await connection.commit();
        await connection.end();
  
        return NextResponse.json({ success: true, item_id: itemResult.insertId });
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        await connection.end();

        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    } catch (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  