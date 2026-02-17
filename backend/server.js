import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import User from './models/User.js';
import { authMiddleware, adminMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 5000;  

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("DB connected"))
        .catch(err => console.log(err));
};
  
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();