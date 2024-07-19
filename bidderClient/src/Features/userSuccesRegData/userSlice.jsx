import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
});
export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
