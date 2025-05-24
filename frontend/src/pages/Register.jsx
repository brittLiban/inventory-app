import { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Alert
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', jobTitle: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      const res = await api.get('/auth/me');
      onLogin(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" align="center">Register</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Job Title" name="jobTitle" onChange={handleChange} />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Create Account</Button>
          <Button fullWidth onClick={() => navigate('/login')} sx={{ mt: 1 }}>Back to Login</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
