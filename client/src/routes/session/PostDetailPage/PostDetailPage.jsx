import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiRequest from '../../../lib/apiRequest';
import styles from './PostDetailPage.module.scss';
import { AiOutlineWallet } from 'react-icons/ai';
import CreditWalletPopup from '../../Bidders/Wallet/CreditWalletPopup';

const PostDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(location.state?.post || null);
  const [highestBid, setHighestBid] = useState(null);
  const [newBid, setNewBid] = useState('');
  const [loading, setLoading] = useState(!post);
  const [submitting, setSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showCreditPopup, setShowCreditPopup] = useState(false);

  const sessionDetailId = location.state?.sessionDetailId;

  const fetchWalletBalance = async () => {
    const bidderId = localStorage.getItem('bidderId');
    try {
      const response = await apiRequest.get(`/wallet/balance/${bidderId}`);
      console.log(response.data.balance);
      setWalletBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance', error);
      toast.error('Failed to fetch wallet balance');
    }
  };

  const updateRemainingTime = (endTime) => {
    const interval = setInterval(() => {
      const timeDifference = endTime - new Date();
      if (timeDifference <= 0) {
        setRemainingTime(null);
        clearInterval(interval);
        navigate(`/session-end/${sessionDetailId}`);
      } else {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000); // Update every second

    // Clear interval on component unmount
    return () => clearInterval(interval);
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!post) {
        setLoading(true);
        try {
          const response = await apiRequest.get(`/posts/${id}`);
          setPost(response.data);
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
        const response = await apiRequest.get(`/sessions/${sessionDetailId}`);
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
          `/bidders/highest-bid?itemId=${id}`
        );
        console.log('Highest bid: ', response.data);
        setHighestBid(response.data);
      } catch (error) {
        console.error('Error fetching highest bid', error);
        toast.error('Failed to fetch highest bid');
      }
    };

    fetchPost();
    fetchSessionEndTime();
    fetchHighestBid();
    fetchWalletBalance();

    return () => {}; // No cleanup needed on component unmount
  }, [id, post, sessionDetailId, navigate]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    // Validate bid amount against highest bid
    if (parseFloat(newBid) <= highestBid?.amount) {
      setError(
        `Bid amount must be higher than current highest bid ($${highestBid?.amount?.toLocaleString()})`
      );
      return;
    }

    // Check if wallet balance is sufficient
    if (walletBalance < post?.price) {
      setError(
        `Insufficient wallet balance. Your balance is $${walletBalance}`
      );
      setShowCreditPopup(true); // Show credit popup
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest.post(`/bidders/postBid`, {
        itemId: id,
        amount: newBid,
      });
      console.log('bid res: ', response.data);
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
          <strong>Base Price:</strong> ${formatAmount(post.price)}
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
          walletId={localStorage.getItem('walletId')}
          onCreditSuccess={() => {
            fetchWalletBalance(); // Refresh the wallet balance after a successful credit
          }}
        />
        <p className={styles.walletBalance}>
          Wallet Balance: ${formatAmount(walletBalance)}
        </p>
      </div>
    </div>
  );
};

export default PostDetailPage;
