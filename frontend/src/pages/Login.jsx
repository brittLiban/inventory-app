import { useState } from 'react';
import {
    Container, Box, Typography, TextField, Button, Alert
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';



const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/login', form);
            const res = await api.get('/auth/me');
            onLogin(res.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" align="center">Login</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" label="Email" name="email" onChange={handleChange} />
                    <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} />
                    <Button fullWidth variant="contained" type="submit">Log In</Button>
                    <Button fullWidth onClick={() => navigate('/register')} sx={{ mt: 1 }}>
                        Don't have an account? Register
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
