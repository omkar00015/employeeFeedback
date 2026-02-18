import {Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const role = localStorage.getItem("role");
  console.log("User Role:", role);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        {role === 'admin' && <Route path="/admin" element={<AdminDashboard />} />}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;  