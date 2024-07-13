import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const LogoutButton = ({ style, text }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions such as clearing localStorage or cookies
    localStorage.clear();
    // Redirect to login page
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout} style={style}>
      {text || 'Logout'}
    </Button>
  );
};

export default LogoutButton;
