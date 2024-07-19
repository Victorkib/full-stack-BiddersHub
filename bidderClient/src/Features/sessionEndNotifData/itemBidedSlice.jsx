import { createSlice } from '@reduxjs/toolkit';

const itemBidedSlice = createSlice({
  name: 'itemBided',
  initialState: {
    itemBided: null,
  },
  reducers: {
    setItemBided: (state, action) => {
      state.itemBided = action.payload;
    },
    clearItemBided: (state) => {
      state.itemBided = null;
    },
  },
});
export const { setItemBided, clearItemBided } = itemBidedSlice.actions;
export default itemBidedSlice.reducer;
