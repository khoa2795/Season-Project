import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import eyeglassesRouter from "./routes/eyeglasses.js";
import sunglassesRouter from "./routes/sunglasses.js";

// Load environment variables from the parent directory
dotenv.config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('TypeScript Express Backend is running!');
});

app.use("/api/eyeglasses", eyeglassesRouter);
app.use("/api/sunglasses", sunglassesRouter);

export default app;
