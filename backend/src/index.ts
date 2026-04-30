import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes       from './routes/authRoutes';
import userRoutes       from './routes/userRoutes';
import permissionRoutes from './routes/permissionRoutes';

dotenv.config();

const app  = express();
const PORT = process.env['PORT'] ?? 5000;

app.use(cors({
  origin: process.env['CLIENT_ORIGIN'] ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/permissions', permissionRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});
