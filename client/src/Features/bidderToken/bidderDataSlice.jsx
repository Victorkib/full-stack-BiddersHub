import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRequest from '../../lib/apiRequest';

// Fetch bidder profile thunk
export const fetchBidderProfileThunk = createAsyncThunk(
  'bidder/fetchProfile',
  async () => {
    const response = await apiRequest.get('/bidder/profile');
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

export const { clearProfile } = bidderDataSlice.actions;
export const bidderReducer = bidderDataSlice.reducer;
export default bidderDataSlice.reducer; // Export default reducer
