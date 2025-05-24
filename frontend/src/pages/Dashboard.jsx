import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h4">Welcome, {user.name} ({user.jobTitle})</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/inventory')}>
        Go to Inventory
      </Button>
      <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
