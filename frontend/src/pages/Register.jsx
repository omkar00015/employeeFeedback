import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setIsError(true);
            return;
        }      
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { 
              name, 
              email, 
              password 
            });        
            setMessage(response.data.message || "Registration successful!");
            setIsError(false);
            setTimeout(() => {
              navigate("/login");
            }, 1500);
            
        } catch(err) {
            setMessage(err.response?.data?.message || "Registration failed");
            setIsError(true);
        }  
    };

    return (
        <Container maxWidth="sm">
          <Box sx={{ 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
              <Typography variant="h4" align="center" sx={{ mb: 3 }}>
                Create Employee Account
              </Typography>
                           
              {message && (
                <Alert severity={isError ? "error" : "success"} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
             <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  type="text"
                  label="Employee Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  margin="normal"
                  autoComplete="name"
                />                
                <TextField
                  fullWidth
                  type="email"
                  label="Employee Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  margin="normal"
                  autoComplete="email"
                />                
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  margin="normal"
                  autoComplete="new-password"
                />               
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  margin="normal"
                  autoComplete="new-password"
                  error={confirmPassword !== "" && password !== confirmPassword}
                  helperText={confirmPassword !== "" && password !== confirmPassword ? "Passwords do not match" : ""}
                />               
                <Button
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  Register
                </Button>
              </form>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link to="/login" style={{color: '#1976d2' }}>
                  Login here
                </Link>
              </Typography>
            </Paper>
          </Box>
        </Container>
    );
};

export default Register;
