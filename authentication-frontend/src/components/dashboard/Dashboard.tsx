import React from 'react';
import { Box, Typography } from '@mui/material';

import '../../styles/DashboardStyle.scss';
import LogoutButton from '../logout-button';

const Dashboard: React.FC = () => {
    const line1 = "Welcome to the";
    const line2 = "Application !";
  
    return (
      <Box className="dashboard-container">
          <LogoutButton />
        <Typography variant="h4" component="h1">
          <span>{line1.split("").map((char, index) => (
            <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
          ))}</span>
          <br />
          <span className="primary-color">{line2.split("").map((char, index) => (
            <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
          ))}</span>
        </Typography>
      </Box>
    );
  };
  
  export default Dashboard;