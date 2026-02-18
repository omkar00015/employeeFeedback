import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [designation, setDesignation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [openReviewerDialog, setOpenReviewerDialog] = useState(false);
  const [selectedEmployeeForReview, setSelectedEmployeeForReview] = useState(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const navigate = useNavigate();

  // fetch employees when component loads
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`, {
        headers: { Authorization: token }
      });
      setEmployees(response.data);
    } catch (error) {
      setErrorMsg('Failed to load employees');
      console.error(error);
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setDesignation(employee.designation || '');
    setOpenDialog(true);
    setErrorMsg('');
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/employees/${id}`, {
        headers: { Authorization: token }
      });
      setSuccessMsg('Employee deleted successfully!');
      loadEmployees();
      setTimeout(() => setSuccessMsg(''), 3000);   
    } catch (error) {
      setErrorMsg('Failed to delete employee');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
    setDesignation('');
  };

  const handleUpdateDesignation = async () => {
    if (!designation.trim()) {
      setErrorMsg('Designation cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/employees/${selectedEmployee._id}`,
        { 
          name: selectedEmployee.name,
          email: selectedEmployee.email,
          designation: designation 
        },
        { headers: { Authorization: token } }
      );

      setSuccessMsg('Designation updated successfully!');
      handleCloseDialog();
      loadEmployees();

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg('Failed to update designation');
    }
  };

  const handleAddReviewer = (employee) => {
    setSelectedEmployeeForReview(employee);
    setReviewTitle(`Performance Review - ${employee.name}`);
    setSelectedReviewerId('');
    setOpenReviewerDialog(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

    const handleCloseReviewerDialog = () => {
    setOpenReviewerDialog(false);
    setSelectedEmployeeForReview(null);
    setReviewTitle('');
    setSelectedReviewerId('');
  };

  const handleAssignReviewer = async () => {
    if (!selectedReviewerId) {
      setErrorMsg('Please select a reviewer');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const reviewResponse = await axios.post(`${import.meta.env.VITE_API_URL}/reviews`,
        {
          employeeId: selectedEmployeeForReview._id,
          title: reviewTitle,
          description: ''
        },
        { headers: { Authorization: token } }
      );
      await axios.post(`${import.meta.env.VITE_API_URL}/assignments`,
        {
          reviewId: reviewResponse.data.review._id,
          reviewerId: selectedReviewerId
        },
        { headers: { Authorization: token } }
      );

      setSuccessMsg('Reviewer assigned successfully!');
      handleCloseReviewerDialog();
      setTimeout(() => setSuccessMsg(''), 3000);

    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to assign reviewer');
    }
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Admin Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Designation</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp._id} hover>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.designation || 'Not assigned'}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEditClick(emp)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteEmployee(emp._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleAddReviewer(emp)}
                    >
                      Add Reviewer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup to Edit Employee Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Employee Designation</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Employee: {selectedEmployee?.name}
            </Typography>
            <TextField
              fullWidth
              label="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              margin="normal"
              placeholder="Enter Designation"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateDesignation} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {/* Popup to add reviewer */}
      <Dialog open={openReviewerDialog} onClose={handleCloseReviewerDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Reviewer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Employee to be reviewed:</strong> {selectedEmployeeForReview?.name}
            </Typography>           
            <TextField
              fullWidth
              label="Review Title"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Select Reviewer"
              placeholder="Select Reviewer"
              value={selectedReviewerId}
              onChange={(e) => setSelectedReviewerId(e.target.value)}
              margin="normal"
            >
              {employees
                .filter(emp => emp._id !== selectedEmployeeForReview?._id)
                .map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.email})
                  </option>
                ))
              }
            </TextField>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Note: The selected employee will be assigned to review {selectedEmployeeForReview?.name}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewerDialog}>Cancel</Button>
          <Button onClick={handleAssignReviewer} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
