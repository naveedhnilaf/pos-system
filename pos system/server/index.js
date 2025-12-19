import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connection.js';
import authRoutes from './Routes/auth.js';
import categoryRoutes from './Routes/Category.js';
import supplierRoutes from './Routes/Supplier.js';
import productRoutes from './Routes/Product.js';
import userRoutes from './Routes/User.js';
import orderRoutes from './Routes/Order.js';
import { connectOracle } from './db/oracle.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

//connect to oracle
await connectOracle();


// Test route
app.get('/', (req, res) => {
  res.send('POS System API is running');
});

// Auth routes
app.use('/api/auth', authRoutes);

// Category routes
app.use('/api/categories', categoryRoutes);

// Supplier routes
app.use('/api/suppliers', supplierRoutes);

// Product routes
app.use('/api/products', productRoutes);

// User routes
app.use('/api/users', userRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});