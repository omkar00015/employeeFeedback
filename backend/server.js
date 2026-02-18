import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import User from './models/User.js';
import Assignment from './models/Assignment.js';
import Review from './models/Review.js';
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

// Routes
/*The below post method registers employee to the application
  First logged in User acts as Admin by default
  Rest other act as Employees
 */
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const isAdminPresent = await User.findOne({ role: 'admin' });
    const role = isAdminPresent ? 'employee' : 'admin';
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: encryptedPassword, role });
    res.status(201).json({ message: `User registered successfully with role ${role}` });
});

/* Post call to check the credentials of the user to access the application */
app.post('/login', async (req, res) => {
  try {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }  
}); 

/* Get call to retrieve all employees */
app.get("/employees", authMiddleware, adminMiddleware, async (req, res) => {
  try {
  const users = await User.find({ role: "employee" });
  res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

/* Update employee details */
app.put('/employees/:id',authMiddleware, adminMiddleware, async (req, res) => {
  try {
  const { name, email, designation } = req.body;
  const updatedEmployee = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, designation },
    { new: true, runValidators: true }
  );
  if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
  res.json(updatedEmployee);
} catch (error) {
  res.status(500).json({ message: 'Error updating employee', error: error.message });
}
});

/* Remove an employee */
app.delete('/employees/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
  const deletedEmployee = await User.findByIdAndDelete(req.params.id);
  if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
  res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  } 
});

/* Assign a reviewer to an employee's review */
app.post('/assignments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { reviewId, reviewerId } = req.body;
    const existing = await Assignment.findOne({ review: reviewId, reviewer: reviewerId });
    if (existing) {
      return res.status(400).json({ message: 'Reviewer already assigned to this review' });
    }    
    const assignment = await Assignment.create({
      review: reviewId,
      reviewer: reviewerId,
      isSubmitted: false
    });    
    res.status(201).json({ message: 'Reviewer assigned successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning reviewer', error: error.message });
  }
});

// Create a review for an employee
app.post('/reviews', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { employeeId, title, description } = req.body;    
    const review = await Review.create({
      employee: employeeId,
      title: title || 'Performance Review',
      description: description || '',
      status: 'open'
    });    
    res.status(201).json({ message: 'Review created', review });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();