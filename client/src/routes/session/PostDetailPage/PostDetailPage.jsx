import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiRequest from '../../../lib/apiRequest';
import styles from './PostDetailPage.module.scss';
import SessionEndPage from '../SessionEndPage/SessionEndPage'; // Adjust the path as needed

const PostDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(location.state?.post || null);
  const [title, setTitle] = useState(location.state?.title || '');
  const [image, setImage] = useState(location.state?.image || '');
  const [highestBid, setHighestBid] = useState(null);
  const [newBid, setNewBid] = useState('');
  const [loading, setLoading] = useState(!post);
  const [submitting, setSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState('');

  const sessionDetailId = location.state?.sessionDetailId; // Get sessionDetailId from location state

  useEffect(() => {
    const fetchPost = async () => {
      if (!post) {
        setLoading(true);
        try {
          const response = await apiRequest.get(`/api/posts/${id}`);
          setPost(response.data);
          setTitle(response.data.title);
          setImage(response.data.images[0]); // Assuming the first image is the main one if not provided in state
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
        const response = await apiRequest.get(`/sessions/${sessionDetailId}`); // Fetch session using sessionDetailId
        console.log('valid endtime:', response.data);
        const session = response.data;
        if (session) {
          setEndTime(new Date(session.endTime));
          updateRemainingTime(new Date(session.endTime)); // Update remaining time immediately after fetching end time
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
          `/bidders/highest-bid?itemId=${id}&img=${image}`
        );
        console.log('Highest bid: ', response.data);
        setHighestBid(response.data);
      } catch (error) {
        console.error('Error fetching highest bid', error);
        toast.error('Failed to fetch highest bid');
      }
    };

    const updateRemainingTime = (endTime) => {
      const interval = setInterval(() => {
        const timeDifference = endTime - new Date();
        if (timeDifference <= 0) {
          setRemainingTime(null);
          clearInterval(interval);
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

    fetchPost();
    fetchSessionEndTime();
    fetchHighestBid();

    return () => {}; // No cleanup needed on component unmount
  }, [id, post, sessionDetailId]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(newBid) <= highestBid?.amount) {
      setError(
        `Bid amount must be higher than current highest bid ($${highestBid?.amount?.toLocaleString()})`
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest.post(`/bidders/postBid`, {
        itemId: id,
        itemImage: image,
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

  if (!remainingTime) {
    return (
      <SessionEndPage
        winners={[
          {
            username: highestBid?.bidder?.username,
            postTitle: title,
            amount: formatAmount(highestBid?.amount),
          },
        ]}
      />
    );
  }

  return (
    <div className={styles.postDetailMain}>
      <ToastContainer />
      <h1>{title}</h1>
      <img src={image} alt={title} className={styles.postImage} />
      <p>{post.description}</p>
      <p>
        Current Highest Bid: $
        {highestBid ? formatAmount(highestBid.amount) : 'No bids yet'}
      </p>
      {highestBid?.bidder && (
        <h5>Bid Holder: {highestBid?.bidder?.username}</h5>
      )}
      <p>Ends in: {remainingTime}</p>
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
  );
};

export default PostDetailPage;
