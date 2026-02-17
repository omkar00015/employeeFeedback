import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const isAdminPresent = await User.findOne({ role: 'admin' });
    const role = isAdminPresent ? 'employee' : 'admin';
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: encryptedPassword, role });
    res.status(201).json({ message: `User registered successfully with role ${role}` });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });  
});


  
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();