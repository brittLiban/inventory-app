// server.js
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/sequelize.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import productRoutes from './routes/product.js';
import transactionRoutes from './routes/transaction.js';



dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // allow cookies to be sent
}));

app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(3001, () => {
  console.log('🚀 Server running on port 3001');
});