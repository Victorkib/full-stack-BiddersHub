/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment-timezone';
import styles from './PostDetailPage.module.scss';
import { AiOutlineWallet } from 'react-icons/ai';
import apiRequest from '../../../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
// import PostDetailCreditWalletPopup from '../../../Routes/Bidders/Wallet/PostDetailsCreditWallet';
import CreditWalletPopup from '../../../Routes/Bidders/Wallet/CreditWalletPopup';
import { setHighestBidData } from '../../../Features/sessionEndNotifData/highestBidDataSlice';
import { setItemBided } from '../../../Features/sessionEndNotifData/itemBidedSlice';

const PostDetailPage = () => {
  const { id } = useParams();
  // console.log('postId: ', id);
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
  // console.log('bidder: ', bidder);

  const fetchWalletBalance = async () => {
    try {
      const response = await apiRequest.get(`/wallet/balance/${bidder.id}`);
      console.log(response.data);
      setWalletBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance', error);
      // toast.error('Failed to fetch wallet balance');
    }
  };

  const updateRemainingTime = (endTime) => {
    const interval = setInterval(async () => {
      // Subtract 3 hours from endTime using moment
      const adjustedEndTime = moment(endTime).subtract(3, 'hours');
      const currentTime = moment();
      const timeDifference = adjustedEndTime.diff(currentTime);

      if (timeDifference <= 0) {
        clearInterval(interval); // Stop the interval

        try {
          const res = await apiRequest.put(`/posts/updateIsSold/${id}`, {
            data: {
              isSold: true,
            },
          });
          if (res.status) {
            console.log('Post status updated:', res.data);
          }
        } catch (error) {
          console.log('Error occurred updating isSold status:', error);
        }

        setRemainingTime('Auction Ended'); // Optional: Display a message
        console.log('highestBidDataToDispatch:', highestBidDataValue);
        console.log('postToDispatch:', post);
        dispatch(setHighestBidData(highestBidDataValue));
        dispatch(setItemBided(post));
        toast.success('Auction ended successfully!');
        // Optionally navigate after a delay
        // setTimeout(() => {
        //   navigate('/usersSession');
        // }, 1000);
      } else {
        const duration = moment.duration(timeDifference);
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000); // Update every second

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!post) {
        setLoading(true);
        try {
          const response = await apiRequest.get(`/posts/${id}`);
          if (response.status) {
            console.log('postDt: ', response.data);
            setPost(response.data);
          }
        } catch (error) {
          console.error('Error fetching post', error);
          toast.error('Failed to fetch post details');
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchSessionEndTime = async () => {
      try {
        const response = await apiRequest.get(
          `/sessions/indiSessBidders/${sessionDetailId}`
        );
        const session = response.data;
        if (session) {
          setEndTime(new Date(session.endTime));
          updateRemainingTime(new Date(session.endTime));
        } else {
          console.error('Session not found for the post');
          toast.error('Session not found for the post');
        }
      } catch (error) {
        console.error('Error fetching session end time', error);
        toast.error('Failed to fetch session end time');
      }
    };

    const fetchHighestBid = async () => {
      try {
        const response = await apiRequest.get(
          `/bidders/highest-bid?itemId=${post.id}`
        );
        console.log('resOfHighestBidFunc: ', response.data);
        setHighestBid(response.data);
        setHighestBidDataValue(response.data);
      } catch (error) {
        console.error('Error fetching highest bid', error);
        toast.error('Failed to fetch highest bid');
      }
    };

    fetchPost();
    fetchSessionEndTime();
    fetchHighestBid();
    fetchWalletBalance();

    // Set up an interval to fetch the highest bid every 5 seconds
    const intervalId = setInterval(() => {
      fetchHighestBid();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
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
            min="0"
            required
            className={styles.bidInput}
          />
          <button
            type="submit"
            disabled={submitting}
            className={styles.bidButton}
          >
            {submitting ? 'Placing Bid...' : 'Place Bid'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
      <div className={styles.walletSection}>
        <AiOutlineWallet
          className={styles.walletIcon}
          onClick={() => setShowCreditPopup(true)}
        />
        <CreditWalletPopup
          show={showCreditPopup}
          onClose={() => setShowCreditPopup(false)}
          walletId={wallet.id}
          amount={creditAmount}
          onCreditSuccess={() => fetchWalletBalance()}
        />
        <p className={styles.walletBalance}>
          Wallet Balance: ${formatAmount(walletBalance)}
        </p>
      </div>
      {showCreditAmountPopup && (
        <AmountPopup
          amount={creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
          onSubmit={() => {
            setShowCreditAmountPopup(false);
            setShowCreditPopup(true);
          }}
          onCancel={() => setShowCreditAmountPopup(false)}
        />
      )}
    </div>
  );
};

export default PostDetailPage;

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
