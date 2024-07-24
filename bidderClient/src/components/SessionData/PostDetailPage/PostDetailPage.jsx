/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './PostDetailPage.module.scss';
import { AiOutlineWallet } from 'react-icons/ai';
import apiRequest from '../../../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import CreditWalletPopup from '../../../Routes/Bidders/Wallet/CreditWalletPopup';
import { setHighestBidData } from '../../../Features/sessionEndNotifData/highestBidDataSlice';
import { setItemBided } from '../../../Features/sessionEndNotifData/itemBidedSlice';
import moment from 'moment-timezone';

const PostDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(location.state?.post || null);
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidDataValue, setHighestBidDataValue] = useState(null);
  const [newBid, setNewBid] = useState('');
  const [loading, setLoading] = useState(!post);
  const [submitting, setSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showCreditAmountPopup, setShowCreditAmountPopup] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [showCreditPopup, setShowCreditPopup] = useState(false);

  const sessionDetailId = location.state?.sessionDetailId;

  const dispatch = useDispatch();

  const wallet = useSelector((state) => state.wallet.details);
  const bidder = useSelector((state) => state.bidder.profile);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const response = await apiRequest.get(`/wallet/balance/${bidder.id}`);
      setWalletBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance', error);
      toast.error('Failed to fetch wallet balance');
    }
  };

  // Get remaining time function
  const getRemainingTime = (endTime) => {
    if (!endTime) return null;

    const localEndTime = moment.utc(endTime); // End time in UTC
    console.log('localEndTime: ', localEndTime);
    const adjustedEndTime = localEndTime.subtract(3, 'hours'); // Adjust if needed

    console.log('adjustedEndTime: ', adjustedEndTime);
    const localCurrentTime = moment().tz('Africa/Nairobi'); // Current time in Nairobi timezone

    const timeDifference = adjustedEndTime.diff(localCurrentTime);

    if (timeDifference <= 0) return null;

    const duration = moment.duration(timeDifference);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Update remaining time function
  const updateRemainingTime = () => {
    if (endTime) {
      const interval = setInterval(() => {
        const time = getRemainingTime(endTime);
        if (time === null) {
          clearInterval(interval);
          setRemainingTime('Auction Ended'); // Display a message when the auction ends
          dispatch(setHighestBidData(highestBidDataValue));
          dispatch(setItemBided(post));
          toast.success('Auction ended successfully!');
        } else {
          setRemainingTime(time);
        }
      }, 1000); // Update every second

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  };

  // Fetch post data
  const fetchPost = async () => {
    if (!post) {
      setLoading(true);
      try {
        const response = await apiRequest.get(`/posts/${id}`);
        if (response.status) {
          setPost(response.data);
          setEndTime(new Date(response.data.endTime));
          updateRemainingTime();
        }
      } catch (error) {
        console.error('Error fetching post', error);
        toast.error('Failed to fetch post details');
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch session end time
  const fetchSessionEndTime = async () => {
    try {
      const response = await apiRequest.get(
        `/sessions/indiSessBidders/${sessionDetailId}`
      );
      const session = response.data;
      if (session) {
        setEndTime(new Date(session.endTime));
        updateRemainingTime();
      } else {
        console.error('Session not found for the post');
        toast.error('Session not found for the post');
      }
    } catch (error) {
      console.error('Error fetching session end time', error);
      toast.error('Failed to fetch session end time');
    }
  };

  // Fetch highest bid
  const fetchHighestBid = async () => {
    try {
      const response = await apiRequest.get(
        `/bidders/highest-bid?itemId=${post.id}`
      );
      setHighestBid(response.data);
      setHighestBidDataValue(response.data);
    } catch (error) {
      console.error('Error fetching highest bid', error);
      toast.error('Failed to fetch highest bid');
    }
  };

  useEffect(() => {
    fetchPost();
    fetchSessionEndTime();
    fetchHighestBid();
    fetchWalletBalance();

    const intervalId = setInterval(() => {
      fetchHighestBid();
    }, 5000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [id, post, sessionDetailId, navigate]); // Dependency array

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    // Check if wallet balance is sufficient
    if (walletBalance < post?.price) {
      setShowCreditAmountPopup(true);
      return;
    }

    // Validate bid amount
    if (highestBid?.amount === 0 || !highestBid) {
      // Validate against base price if no bids yet
      if (parseFloat(newBid) < post.basePrice) {
        setError(
          `Bid amount must be at least the base price ($${post.basePrice?.toLocaleString()})`
        );
        toast.error(
          `Bid amount must be at least the base price ($${post.basePrice?.toLocaleString()})`
        );
        return;
      }
    } else {
      // Validate against highest bid if bids exist
      if (parseFloat(newBid) <= highestBid.amount) {
        setError(
          `Bid amount must be higher than the current highest bid ($${highestBid.amount?.toLocaleString()})`
        );
        toast.error(
          `Bid amount must be higher than the current highest bid ($${highestBid.amount?.toLocaleString()})`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await apiRequest.post(`/bidders/postBid`, {
        itemId: post.id,
        amount: newBid,
      });
      toast.success('Bid placed successfully!');
      setHighestBid(response.data);
      setNewBid('');
      setError('');
    } catch (error) {
      console.error('Error placing bid', error);
      toast.error('Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '0';
    return amount.toLocaleString();
  };

  if (loading || !post) {
    return (
      <div className={styles.loader}>
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className={styles.postDetailMain}>
      <ToastContainer />
      <div className={styles.imageSlider}>
        {post.images.map((img, index) => (
          <img
            src={img}
            alt={`Image ${index}`}
            key={index}
            className={styles.postImage}
          />
        ))}
      </div>
      <div className={styles.postDetails}>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <p>
          <strong>City:</strong> {post.city}
        </p>
        <p>
          <strong>Auctioneer:</strong> {post.userId.username}
        </p>
        <p>
          <strong>Session Ends:</strong> {new Date(endTime).toLocaleString()}
        </p>
        <p>
          <strong>Remaining Time:</strong> {remainingTime}
        </p>
        <p>
          <strong>Highest Bid:</strong> $
          {highestBid ? formatAmount(highestBid.amount) : 'No bids yet'}
        </p>
        <p>
          <strong>Start Bidding Price:</strong> ${formatAmount(post.basePrice)}
        </p>
      </div>
      <div className={styles.bidSection}>
        <h2>Place Your Bid</h2>
        <form onSubmit={handleBidSubmit}>
          <input
            type="number"
            value={newBid}
            onChange={(e) => setNewBid(e.target.value)}
            placeholder="Enter your bid"
            min={post.basePrice}
            step="0.01"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Placing Bid...' : 'Place Bid'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
      <div className={styles.walletSection}>
        <AiOutlineWallet className={styles.walletIcon} />
        <p>Wallet Balance: ${walletBalance}</p>
        <button onClick={() => setShowCreditPopup(true)}>Credit Wallet</button>
      </div>
      {showCreditPopup && (
        <CreditWalletPopup
          show={showCreditPopup}
          onClose={() => setShowCreditPopup(false)}
          walletId={wallet.id}
          amount={creditAmount}
          onCreditSuccess={() => fetchWalletBalance()}
        />
      )}
      {showCreditAmountPopup && (
        <AmountPopup
          amount={creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
          onSubmit={async () => {
            try {
              await apiRequest.post('/wallet/credit', {
                bidderId: bidder.id,
                amount: creditAmount,
              });
              toast.success('Wallet credited successfully!');
              fetchWalletBalance(); // Refresh wallet balance
              setShowCreditAmountPopup(false);
            } catch (error) {
              console.error('Error crediting wallet', error);
              toast.error('Failed to credit wallet');
            }
          }}
          onCancel={() => setShowCreditAmountPopup(false)}
        />
      )}
    </div>
  );
};

// AmountPopup Component
const AmountPopup = ({ amount, onChange, onSubmit, onCancel }) => (
  <div className={styles.amountPopup}>
    <label>Credit Wallet</label>
    <input
      type="number"
      value={amount}
      onChange={onChange}
      placeholder="Enter amount to credit"
      className={styles.amountInput}
    />
    <div className={styles.amountBtn}>
      <button type="button" onClick={onCancel} className={styles.amountButton}>
        <span>Cancel</span>
      </button>
      <button type="button" onClick={onSubmit} className={styles.amountButton}>
        <span>→</span>
      </button>
    </div>
  </div>
);

export default PostDetailPage;
