import 'dotenv/config';
import express from 'express';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import petRoutes from './src/routes/petRoutes.js';
import cors from 'cors';

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Pet Management API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});