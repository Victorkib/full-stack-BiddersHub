import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './BidderProfile.module.scss';
import CreditWalletPopup from '../Wallet/CreditWalletPopup';
import {
  clearProfile,
  fetchBidderProfileThunk,
  setBidderData,
} from '../../../Features/bidderToken/bidderDataSlice';
import {
  clearWallet,
  fetchWalletDetailsThunk,
  setWalletData,
} from '../../../Features/bidderToken/walletDataSlice';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import apiRequest from '../../../lib/apiRequest';
import { removeToken } from '../../../Features/bidderToken/bidderTokenSlice';
import { removeWallet } from '../../../Features/bidderToken/bidderWalletSlice';
import UploadWidget from '../../../components/uploadWidget/UploadWidget';

const BidderProfile = () => {
  const [showCreditInput, setShowCreditInput] = useState(false);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [avatar, setAvatar] = useState([]); // State for avatar
  const [uploading, setUploading] = useState(false); // State for upload loading
  const [amount, setAmount] = useState('');

  const dispatch = useDispatch();
  const bidder = useSelector((state) => state.bidder.profile);
  const wallet = useSelector((state) => state.wallet.details);
  const userId = JSON.parse(localStorage.getItem('bidder')); // Retrieve user ID from localStorage

  useEffect(() => {
    const fetchData = async () => {
      // if (userId) {
      //   await dispatch(fetchBidderProfileThunk(userId.id));
      //   await dispatch(fetchWalletDetailsThunk(userId.id));
      // }
      const fetchBidderData = async () => {
        setLoading(true);

        try {
          const res = await apiRequest.get(
            `/bidders/bidderProfile/${userId.id}`
          );
          if (res.status) {
            console.log(res.data);
            dispatch(setBidderData(res.data));
          } else {
            console.log('error occurred', res.data.error);
          }
        } catch (error) {
          toast.error('Error updating profile');
        } finally {
          setLoading(false);
        }
      };

      const fetchWalletData = async () => {
        setLoading(true);
        try {
          const res = await apiRequest.get(`/wallet/details/${userId.id}`);
          if (res.status) {
            console.log(res.data);
            dispatch(setWalletData(res.data));
          } else {
            console.log('error occurred', res.data.error);
          }
        } catch (error) {
          console.log('error:', error.response.data.error);
          toast.error('Error updating profile');
        } finally {
          setLoading(false);
        }
      };

      fetchBidderData();
      fetchWalletData();

      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();

    // return () => {
    //   dispatch(clearProfile());
    //   dispatch(clearWallet());
    // };
  }, []);

  // Function to handle profile picture update
  const handleProfileUpdate = async () => {
    setUploading(true);
    try {
      const res = await apiRequest.put(
        `/bidders/updateProfilePic/${userId.id}`,
        {
          profile: avatar[0],
        }
      );
      if (res.status) {
        console.log(res.data);
        dispatch(fetchBidderProfileThunk(userId.id)); // Refresh profile data
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (avatar.length > 0) {
      handleProfileUpdate();
    }
  }, [avatar.length]); // Trigger profile update when avatar state changes

  const handleCreditClick = () => {
    setShowCreditInput(true);
  };

  const handleInputSubmit = () => {
    if (amount) {
      setShowCreditPopup(true);
      setShowCreditInput(false);
    } else {
      toast.error('Please enter an amount');
    }
  };

  const handlePopupClose = () => {
    setShowCreditPopup(false);
    setAmount('');
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get('/bidders/logout');
      if (res.status) {
        dispatch(removeToken());
        dispatch(removeWallet());

        dispatch(clearProfile());
        dispatch(clearWallet());
        localStorage.removeItem('biddersToken');
        localStorage.removeItem('bidder');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Error logging out');
    } finally {
      setLoading(false);
    }
  };

  const transactionRows =
    wallet.transactions && wallet.transactions.length > 0 ? (
      wallet.transactions.map((transaction, index) => (
        <tr key={transaction.id}>
          <td>{index + 1}</td>
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
    <>
      <ToastContainer />
      {loading ? (
        <div className={styles.loader}>
          <ThreeDots
            className={styles.threeDots}
            color="#00BFFF"
            height={80}
            width={80}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.profileSection}>
            <div className={styles.card}>
              <img
                src={avatar[0] || bidder.profile || '/noavatar.jpg'}
                alt="Bidder Icon"
                className={styles.icon}
              />
              <h2>{bidder.username}</h2>
              <p>{bidder.email}</p>
              <button className={styles.editBtn} onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
              {uploading ? (
                <div className={styles.UploadLoader}>
                  <ThreeDots
                    className={styles.threeDots}
                    color="#00BFFF"
                    height={80}
                    width={80}
                  />
                </div>
              ) : (
                <UploadWidget
                  uwConfig={{
                    cloudName: 'victorkib',
                    uploadPreset: 'houseManagement',
                    multiple: false,
                    maxImageFileSize: 2000000,
                    folder: 'avatars',
                  }}
                  setState={setAvatar}
                  setLoading={setUploading} // Pass setLoading to manage loading state in UploadWidget
                />
              )}
            </div>

            <div className={styles.leftCard}>
              <h2>Wallet</h2>
              <p>Balance: ${wallet.balance}</p>
              <p>Bidder: {bidder.username}</p>
              <button className={styles.walletBtn} onClick={handleCreditClick}>
                <i className="fas fa-wallet"></i> Credit Wallet
              </button>

              {showCreditInput && (
                <div className={styles.creditInputContainer}>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={styles.creditInput}
                  />
                  <button
                    className={styles.arrowBtn}
                    onClick={handleInputSubmit}
                  >
                    →
                  </button>
                </div>
              )}
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
              amount={amount} // Pass amount as prop
              onCreditSuccess={() =>
                dispatch(fetchWalletDetailsThunk(userId.id))
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default BidderProfile;
