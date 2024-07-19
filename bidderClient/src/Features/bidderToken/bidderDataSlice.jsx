// bidderDataSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRequest from '../../lib/apiRequest';

// Fetch bidder profile thunk
export const fetchBidderProfileThunk = createAsyncThunk(
  'bidder/fetchProfile',
  async (userId) => {
    const response = await apiRequest.get(`/bidders/bidderProfile/${userId}`);
    console.log('bidder dt logged', response.data);
    return response.data;
  }
);

const bidderDataSlice = createSlice({
  name: 'bidder',
  initialState: {
    profile: {},
    loading: false,
    error: null,
  },
  reducers: {
    setBidderData: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidderProfileThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBidderProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchBidderProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProfile, setBidderData } = bidderDataSlice.actions;
export const bidderReducer = bidderDataSlice.reducer;
export default bidderDataSlice.reducer;
