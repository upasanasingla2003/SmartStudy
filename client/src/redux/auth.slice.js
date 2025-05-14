import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { axiosInstance } from '@utils';

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    error: null,
    user_id: '',
    firstName: '',
    lastName: '',
    email: '',
    target: [],
    calender: []
  };

export const auth = createAsyncThunk(
  'login/user',
  async ( { email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user_id = '';
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.target = [];
      state.calender = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(auth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(auth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.user_id = action.payload.id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.target = action.payload.target;
        state.calender = action.payload.calender;
      })
      .addCase(auth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
  },
});

export const { logout } = authSlice.actions;
