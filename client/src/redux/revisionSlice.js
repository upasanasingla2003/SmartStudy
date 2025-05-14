import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { axiosInstance } from '@utils';

const initialState = {
  revisions : [],
  revisionIsLoading: false,
  error: null,
  };

export const getRevision = createAsyncThunk(
  'revision',
  async ( { date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/revision?date=${date}`);
      if (response.status === 200) {
        console.log(response.data)
        return response.data;
      }
    } catch (error) {
    }
  },
);

export const revisionSlice = createSlice({
  name: 'revision',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getRevision.pending, (state) => {
        state.revisionIsLoading = true;
        state.error = null;
      })
      .addCase(getRevision.fulfilled, (state, action) => {
        state.revisionIsLoading = false;
        state.error = null;
        state.revisions = action.payload.revision
        console.log(state.revisions);
      })
      .addCase(getRevision.rejected, (state, action) => {
        state.revisionIsLoading = false;
        state.error = action.payload;
      })
  },
});
