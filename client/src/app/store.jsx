import { configureStore } from '@reduxjs/toolkit';
import uploadSlice from '../Features/docSlice/docUrlSlice';
import bidderSliceToken from '../Features/bidderToken/bidderTokenSlice';

const store = configureStore({
  reducer: {
    uploads: uploadSlice,
    bidderToken: bidderSliceToken,
  },
});

export default store;
