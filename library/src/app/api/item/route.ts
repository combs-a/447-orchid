import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

type Item = {
    item_id: number;
    item_type_name: string;
    title: string;
    description: string;
    genre_name: number;
    isbn: string;
    publication_year: number;
    publication_date: string;
    publisher: string;
    issue_number: number | null;
    explicit: boolean;
    rating_name: number | null;
    total_quantity: number;
    quantity_available: number;
    reservation_amount: number;
    contributor_f_name: string | null;
    contributor_l_name: string | null;
    contributor_role_name: string | null;
  };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const item_id = searchParams.get('item_id');
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'All';
  const sort = searchParams.get('sort') || 'A-Z';
  // Advanced search parameters:
  const author = searchParams.get('author') || '';
  const releaseYear = searchParams.get('releaseYear') || '';
  const isbn = searchParams.get('isbn') || '';
  const issueNumber = searchParams.get('issueNumber') || '';
  const genreParam = searchParams.get('genre') || '';
  const ageRating = searchParams.get('ageRating') || '';


  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    let query = `
  SELECT
    i.item_id,
    it.item_type_name,
    i.title,
    i.description,
    g.genre_name,
    i.isbn,
    i.publication_year,
    i.publication_date,
    i.publisher,
    i.issue_number,
    i.explicit,
    ra.rating_name,
    i.total_quantity,
    i.quantity_available,
    i.reservation_amount,
    co.first_name AS contributor_f_name,
    co.last_name AS contributor_l_name,
    r.role_name AS contributor_role_name
  FROM item i
  LEFT JOIN item_type it ON i.item_type_id = it.item_type_id
  LEFT JOIN rating ra ON i.rating_id = ra.rating_id
  LEFT JOIN genre g ON i.genre_id = g.genre_id
  LEFT JOIN contribution c ON i.item_id = c.item_id
  LEFT JOIN contributor co ON c.contributor_id = co.contributor_id
  LEFT JOIN contribution_role r ON c.role_id = r.role_id
`;

const params: (string | number)[] = [];

if (item_id) {
  query += ` WHERE i.item_id = ?`;
  params.push(item_id);
} else {
  query += ` WHERE i.title LIKE ?`;
  params.push(`%${search}%`);
// sets the filter to the default value of 'All' if no filter is selecte, then appends
// the currently selected filter to the query if it is not 'All'
  if (filter !== 'All') {
    query += ` AND it.item_type_name = ?`;
    params.push(filter);
  }

   // Append advanced filters if provided
   // object Map of advanced filters
   const advancedFilters = [
    { param: author, clause: "(co.first_name LIKE ? OR co.last_name LIKE ?)", values: [`%${author}%`, `%${author}%`] },
    { param: releaseYear, clause: "i.publication_year = ?", values: [releaseYear] },
    { param: isbn, clause: "i.isbn LIKE ?", values: [`%${isbn}%`] },
    { param: issueNumber, clause: "i.issue_number = ?", values: [issueNumber] },
    { param: genreParam, clause: "g.genre_name LIKE ?", values: [`%${genreParam}%`] },
    { param: ageRating, clause: "ra.rating_name = ?", values: [ageRating] }
  ];
  // Loop over advanced filters and append if the parameter is provided
  advancedFilters.forEach(filterItem => {
    filterItem.param && (query += ` AND ${filterItem.clause}`, params.push(...filterItem.values));
  });

  // avoids duplicates in the result set
  query += `
    GROUP BY i.item_id
  `;
//handles the sorting of the results based on the selected sort option 
// converted to an object map
const sortMap: { [key: string]: string } = {
  "A-Z": " ORDER BY i.title ASC",
  "Z-A": " ORDER BY i.title DESC",
  "Newest": " ORDER BY i.publication_year DESC",
  "Oldest": " ORDER BY i.publication_year ASC"
};
query += sortMap[sort] || "";
}
    

    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    return NextResponse.json(rows as Item[]);
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}