import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@utils/axiosInterceptor';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logout } from '@redux';
import { IconButton } from '@mui/material';

export const Navbar = () => {
  const navigate = useNavigate;

    const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout())
    try {
          const response = await axiosInstance.get('/logout');
      
          if (response?.status === 200) {
            toast.success('User Logout Successfully');
            navigate('/login');
          }
        } catch (error) {
          console.error('Registration error:', error);
        }
    
  };

  return (
    <AppBar position="static" sx={{backgroundColor: '#42a5f5'}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box display="flex" alignItems="center">
            <IconButton 
                title="SmartStudy Logo" 
                onClick={() => navigate('/calender')}
                sx={{color: 'black', borderRadius: '10px', cursor: 'pointer'}}
            >
                SmartStudy
            </IconButton>
        </Box>

        {/* Logout Button */}
        <Button onClick={handleLogout} sx={{ color: 'white', backgroundColor: 'black' }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
