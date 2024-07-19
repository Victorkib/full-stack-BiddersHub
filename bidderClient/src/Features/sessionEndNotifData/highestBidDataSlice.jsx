import { createSlice } from '@reduxjs/toolkit';

const highestBidDataSlice = createSlice({
  name: 'highestBidData',
  initialState: {
    highestBidData: null,
  },
  reducers: {
    setHighestBidData: (state, action) => {
      state.highestBidData = action.payload;
    },
    resetHighestBidData: (state) => {
      state.highestBidData = null;
    },
  },
});
export const { setHighestBidData, resetHighestBidData } =
  highestBidDataSlice.actions;
export default highestBidDataSlice.reducer;
