import { createSlice } from '@reduxjs/toolkit';

const bidderSliceToken = createSlice({
  name: 'bidderToken',
  initialState: {
    token: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
  },
});
export const { setToken, removeToken } = bidderSliceToken.actions;
export default bidderSliceToken.reducer;
