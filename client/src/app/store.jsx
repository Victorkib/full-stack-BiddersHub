import { configureStore } from '@reduxjs/toolkit';
import uploadSlice from '../Features/docSlice/docUrlSlice';

const store = configureStore({
  reducer: {
    uploads: uploadSlice,
  },
});

export default store;
