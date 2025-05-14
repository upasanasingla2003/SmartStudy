import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { axiosInstance } from '@utils';

const initialState = {
  schedules : [],
  scheduleIsLoading: false,
  error: null,
  };

export const getSchedule = createAsyncThunk(
  'schedule',
  async ( { date }, { rejectWithValue }) => {
    console.log(date)
    try {
      const response = await axiosInstance.get(`/schedule?date=${date}`);

      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      }
    } catch (error) {
    }
  },
);

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getSchedule.pending, (state) => {
        state.scheduleIsLoading = true;
        state.error = null;
      })
      .addCase(getSchedule.fulfilled, (state, action) => {
        state.scheduleIsLoading = false;
        state.error = null;
        state.schedules = action.payload.schedule
      })
      .addCase(getSchedule.rejected, (state, action) => {
        state.scheduleIsLoading = false;
        state.error = action.payload;
      })
  },
});
