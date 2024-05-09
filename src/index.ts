import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = (process.env.PORT ?? 3000).toString();
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
  res.sendFile(publicDirectory);
});

app.get('/api', (_req: Request, res: Response) =>
  res.json({ message: path.join(publicDirectory, 'index.html') }),
);

// Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `${platform.charAt(0).toUpperCase() + platform.slice(1)} is running on http://localhost:${PORT}`,
  );
});
