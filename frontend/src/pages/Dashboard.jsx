import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name} ({user.jobTitle})
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => navigate('/inventory')} sx={{ mr: 2 }}>
          Go to Inventory
        </Button>
        <Button variant="outlined" onClick={onLogout}>Logout</Button>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <ul>
          {transactions.map(tx => (
            <li key={tx.id}>
              <strong>{tx.type.toUpperCase()}</strong> — Product #{tx.productId} — Qty: {tx.quantity} {tx.note && `— ${tx.note}`}
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default Dashboard;
