import React, { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '@redux';

// 🔐 Zod schema
const schema = z.object({
    email: z.string().nonempty('Email is required').email('Invalid email'),
    password: z.string().nonempty('Password is required').min(8, 'Password must be at least 8 characters'),
});

export const Login = () => {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state)=> state.auth)
    const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(()=>{
    if(isAuthenticated){
        navigate('/calender')
        
    }
  }, [isAuthenticated])

  const onSubmit = async(data) => {
    console.log('Form Data:', data);
    dispatch(auth(data))
    // if(result.isAuthenticated){
    //     navigate('/calender')
    // }
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
            my: 20,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography component="h1" variant="h4">
            Login
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: '600px', mt: 3,display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' }}>
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
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, alignSelf: 'center', justifyContent: 'center'}}
            >
              Login
            </Button>
            <Typography sx={{mt: '15px'}}> Don't have an account? <Link to='/signup'>SignUp</Link> </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>

  );
}