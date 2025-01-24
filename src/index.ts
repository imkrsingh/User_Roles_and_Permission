import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';

const app = express();
dotenv.config();

connectDB();
app.use(express.json());

// Middleware to parse JSON requests
app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with TypeScript!');
});

app.get('/about', (req: Request, res: Response) => {
  res.send('Hello This is About Page<<<<.');
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
