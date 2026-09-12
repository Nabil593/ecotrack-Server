import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.routes';
import itemRoutes from './routes/item.routes';
import paymentRoutes from './routes/payment.routes';

const app: Application =express();

dotenv.config();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'EcoTrack Server is running smoothly!' });
});

export default app;