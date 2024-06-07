import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = (process.env.PORT ?? 5000).toString();
const platform: string = process.platform;
let __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));

if (platform === 'win32') {
  __dirname = __dirname.substring(1);
}

const publicDirectory = path.join(__dirname, 'public');

// Enable CORS and serve static files
app.use(cors());
app.use(express.static(publicDirectory));

// Define routes
app.get('/', (_req, res) => {
  const isDevelopment: boolean = String(process.env.NODE_ENV) === 'development';

  if (isDevelopment) {
    res.redirect(String(process.env.VITE_FRONTEND_URL));
    return;
  }

  res.sendFile(publicDirectory);
});

app.get('/api', (_req: Request, res: Response) =>
  res.json({ message: path.join(publicDirectory, 'index.html') }),
);

app.get('/api/users', (_req: Request, res: Response) =>
  res.json([
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@gmail.com',
      password: 'john123',
      created_at: new Date('2014-12-14'),
      updated_at: new Date('2014-12-25'),
    },
  ]),
);

import PostgreSQL from 'pg-pool';
app.get('/api/v1/users', (req: Request, res: Response) => {
  void (async () => {
    const selectedColumns: string[] = [
      'id',
      'first_name',
      'last_name',
      'email',
      'gender',
    ];

    const { page = '1', limit = '100', search = '' } = req.query;

    const pool = new PostgreSQL({ connectionString: process.env.DATABASE_URL });

    const client = await pool.connect();

    const searchCondition =
      search !== ''
        ? `WHERE search_vector @@ websearch_to_tsquery('english', $1)`
        : '';

    const queryString = `
        SELECT (
          SELECT COUNT(*)
          FROM users ${searchCondition}
        ) AS total_rows,
        (
          SELECT json_agg(rows)
          FROM (
            SELECT ${selectedColumns.join(', ')} 
            FROM "users" 
            ${searchCondition} 
            ORDER BY id 
            ${search !== '' ? `OFFSET $2 LIMIT $3` : `OFFSET $1 LIMIT $2`}
          ) as rows
        ) AS rows;
      `;

    const offset = Math.max((Number(page) - 1) * Number(limit), 0);

    const searchParams =
      search !== '' ? [search, offset, Number(limit)] : [offset, Number(limit)];

    try {
      const result = await client.query(queryString, searchParams);

      res.json(result.rows);

      //==========LOG==========//
      /* prettier-ignore */ const finalQuery = search !== '' ? queryString .replace('$1', `'${String(searchParams[0])}'`) .replace('$2', String(searchParams[1])) .replace('$3', String(searchParams[2])) : queryString .replace('$1', String(searchParams[0])) .replace('$2', String(searchParams[1]));
      /* prettier-ignore */ ((log = req.query)=>{console.log(["string","number"].includes(typeof log)?log:JSON.stringify(log,null,4));})();
      /* prettier-ignore */ console.log('Query:', finalQuery);
      /* prettier-ignore */ ((log = result.rows)=>{console.log(["string","number"].includes(typeof log)?log:JSON.stringify(log,null,4));})();
      //==========LOG==========//
    } catch (queryErr) {
      console.error(queryErr);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  })();
});

// Start server
app.listen(PORT, () => {
  console.log(
    `${platform.charAt(0).toUpperCase() + platform.slice(1)} is running on http://localhost:${PORT}`,
  );
});
