// walletDataSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRequest from '../../lib/apiRequest';

// Fetch wallet details thunk
export const fetchWalletDetailsThunk = createAsyncThunk(
  'wallet/fetchDetails',
  async (userId) => {
    const response = await apiRequest.get(`/wallet/details/${userId}`);
    console.log('wallet dt logged: ', response.data);
    return response.data;
  }
);

const walletDataSlice = createSlice({
  name: 'wallet',
  initialState: {
    details: { transactions: [] },
    loading: false,
    error: null,
  },
  reducers: {
    setWalletData: (state, action) => {
      state.loading = false;
      state.details = action.payload;
    },
    clearWallet: (state) => {
      state.details = { transactions: [] };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletDetailsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchWalletDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearWallet, setWalletData } = walletDataSlice.actions;
export const walletReducer = walletDataSlice.reducer;
export default walletDataSlice.reducer;
