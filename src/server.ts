import express, { Request, Response } from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "TypeScript backend is running successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});