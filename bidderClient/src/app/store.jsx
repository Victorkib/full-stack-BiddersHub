import { configureStore } from '@reduxjs/toolkit';
import uploadSlice from '../Features/docSlice/docUrlSlice';
import bidderSliceToken from '../Features/bidderToken/bidderTokenSlice';
import userSlice from '../Features/userSuccesRegData/userSlice';
import bidderWalletSlice from '../Features/bidderToken/bidderWalletSlice';
import bidderDataReducer from '../Features/bidderToken/bidderDataSlice';
import walletDataReducer from '../Features/bidderToken/walletDataSlice';
import highestBidDataSlice from '../Features/sessionEndNotifData/highestBidDataSlice';
import itemBidedSlice from '../Features/sessionEndNotifData/itemBidedSlice';

const store = configureStore({
  reducer: {
    uploads: uploadSlice,
    bidderToken: bidderSliceToken,
    userData: userSlice,
    bidderWallet: bidderWalletSlice,
    bidder: bidderDataReducer,
    wallet: walletDataReducer,
    highestBidDataValue: highestBidDataSlice,
    itemBidedDataValue: itemBidedSlice,
  },
});

export default store;
