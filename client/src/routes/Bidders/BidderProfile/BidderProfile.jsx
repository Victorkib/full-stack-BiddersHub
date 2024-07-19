import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './BidderProfile.module.scss';

import CreditWalletPopup from '../Wallet/CreditWalletPopup';
import {
  clearProfile,
  fetchBidderProfileThunk,
} from '../../../Features/bidderToken/bidderDataSlice';
import {
  clearWallet,
  fetchWalletDetailsThunk,
} from '../../../Features/bidderToken/walletDataSlice';

const BidderProfile = () => {
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const dispatch = useDispatch();
  const bidder = useSelector((state) => state.bidder.profile);
  const wallet = useSelector((state) => state.wallet.details);

  useEffect(() => {
    dispatch(fetchBidderProfileThunk());
    dispatch(fetchWalletDetailsThunk());

    return () => {
      dispatch(clearProfile());
      dispatch(clearWallet());
    };
  }, [dispatch]);

  const handleCreditClick = () => {
    setShowCreditPopup(true);
  };

  const handlePopupClose = () => {
    setShowCreditPopup(false);
  };

  // Ensure wallet.transactions exists and is an array before mapping
  const transactionRows =
    wallet.transactions && wallet.transactions.length > 0 ? (
      wallet.transactions.map((transaction) => (
        <tr key={transaction.id}>
          <td>{transaction.name}</td>
          <td>{transaction.description}</td>
          <td>{transaction.type}</td>
          <td>${transaction.amount}</td>
          <td>{new Date(transaction.createdAt).toLocaleString()}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5">No transactions found.</td>
      </tr>
    );

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.card}>
          <img
            src={bidder.icon || '/default-icon.png'}
            alt="Bidder Icon"
            className={styles.icon}
          />
          <h2>{bidder.username}</h2>
          <p>{bidder.email}</p>
          <button className={styles.editBtn}>Edit Profile</button>
        </div>
        <div className={styles.card}>
          <h2>Wallet</h2>
          <p>Balance: ${wallet.balance}</p>
          <p>Bidder: {bidder.username}</p>
          <button className={styles.walletBtn} onClick={handleCreditClick}>
            <i className="fas fa-wallet"></i> Credit Wallet
          </button>
        </div>
      </div>
      <div className={styles.transactionSection}>
        <h2>Transaction History</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>{transactionRows}</tbody>
          </table>
        </div>
      </div>
      {showCreditPopup && (
        <CreditWalletPopup
          show={showCreditPopup}
          onClose={handlePopupClose}
          walletId={wallet.id}
          onCreditSuccess={() => dispatch(fetchWalletDetailsThunk())}
        />
      )}
    </div>
  );
};

export default BidderProfile;
