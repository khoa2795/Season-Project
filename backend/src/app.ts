import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import glassesRouter from './routes/glasses.js';

// Load environment variables from the parent directory
dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3001;

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('TypeScript Express Backend is running!');
});

// API Routes
app.use('/api/glasses', glassesRouter);

export default app;