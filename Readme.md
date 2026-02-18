# Employee Feedback System
A full-stack web application for managing employee performance reviews and feedback. Built with React, Node.js, Express, and MongoDB.

## Installation & Setup
### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Add the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Start the backend server
node server.js
```
**Backend runs on:** `http://localhost:5000`

### Frontend Setup
Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
# Add the following variable:
VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```
**Frontend runs on:** `http://localhost:5173` (or the port Vite assigns)

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Employee?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```
## Current Implementation
### Admin
- First user to register
- Can view all employees
- Can edit employee designations
- Can delete employees
- Can create reviews and assign reviewers

