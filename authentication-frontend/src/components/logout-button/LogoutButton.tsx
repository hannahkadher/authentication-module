import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return <Button className="logout-button" onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;