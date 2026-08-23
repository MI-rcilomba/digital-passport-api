import express from 'express';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import blockchainRoutes from './routes/blockchainRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', blockchainRoutes);
app.use(errorMiddleware);

export default app;
