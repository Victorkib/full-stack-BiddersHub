import { createSlice } from '@reduxjs/toolkit';

const uploadSlice = createSlice({
  name: 'uploadSlice',
  initialState: {
    cr12: [],
    auctioneeringLicense: [],
  },
  reducers: {
    addCr12: (state, action) => {
      state.cr12.push(action.payload);
    },
    addAuctioneeringLicense: (state, action) => {
      state.auctioneeringLicense.push(action.payload);
    },
    resetUploads: (state) => {
      state.cr12 = [];
      state.auctioneeringLicense = [];
    },
  },
});

export const { addCr12, addAuctioneeringLicense, resetUploads } =
  uploadSlice.actions;
export default uploadSlice.reducer;
