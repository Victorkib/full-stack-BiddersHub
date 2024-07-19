import { createSlice } from '@reduxjs/toolkit';

const bidderWalletSlice = createSlice({
  name: 'bidderWalletSlice',
  initialState: {
    wallet: null,
  },
  reducers: {
    addWallet: (state, action) => {
      state.wallet = action.payload;
    },
    removeWallet: (state) => {
      state.wallet = null;
    },
  },
});
export const { addWallet, removeWallet } = bidderWalletSlice.actions;
export default bidderWalletSlice.reducer;
