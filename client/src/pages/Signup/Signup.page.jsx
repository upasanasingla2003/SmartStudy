import React from 'react';
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '@utils';
import { toast } from 'react-toastify';

// 🔐 Zod schema
const schema = z.object({
    first_name: z.string().nonempty('First name is required').min(2, 'Name is too short'),
    last_name: z.string().nonempty('Last name is required').min(2, 'Name is too short'),
    email: z.string().nonempty('Email is required').email('Invalid email'),
    password: z.string().nonempty('Password is required').min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().nonempty('Password is required').min(8, 'Password must be at least 8 characters'),
});

export const Signup = () => {

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {

    try {
      const response = await axiosInstance.post('/register', {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        password: data.password,
      });
  
      if (response?.status === 200) {
        toast.success('Sign up successful!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      
      <Grid
       size={6}
        sx={{
          height: '740px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1532101780307-8f873ece858f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHdhbGxwYXBlciUyMGltYWdlJTIwZm9yJTIwbWFuYWdlJTIwdGhlJTIwc3R1ZHl8ZW58MHx8MHx8fDA%3D)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></Grid>

      <Grid size={6} component={Paper} elevation={6}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component="h1" variant="h4">
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: '600px', mt: 3,display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' }}>
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              {...register('first_name')}
              helperText={errors.first_name?.message}
              error={!!errors.first_name}
            />
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              {...register('last_name')}
              helperText={errors.last_name?.message}
              error={!!errors.last_name}
            />
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              {...register('confirm_password')}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, alignSelf: 'center', justifyContent: 'center'}}
            >
              Sign Up
            </Button>
            <Typography sx={{mt: '15px'}}> Already have an account? <Link to='/login'>Login</Link></Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>

  );
}