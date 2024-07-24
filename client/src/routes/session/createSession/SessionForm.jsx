import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './session.module.scss';
import apiRequest from '../../../lib/apiRequest';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

const SessionForm = ({ onSuccess, session = {} }) => {
  const [title, setTitle] = useState(session?.title || '');
  const [description, setDescription] = useState(session?.description || '');
  const [startTime, setStartTime] = useState(session?.startTime || '');
  const [endTime, setEndTime] = useState(session?.endTime || '');
  const [selectedPosts, setSelectedPosts] = useState(
    session?.items?.map((item) => item.postId) || []
  );
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postSelectedError, setPostSelectedError] = useState(false);

  const navigate = useNavigate();

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/sessions/userPostedData');
      console.log('userPostedData: ', res.data);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch the user posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPosts.length === 0) {
      setPostSelectedError(true);
      toast.error('Please select at least one product to add to the session.');
      return;
    }

    try {
      const payload = { title, description, startTime, endTime, selectedPosts };
      if (session?.id) {
        await apiRequest.put(`/sessions/${session.id}`, payload);
      } else {
        await apiRequest.post('/sessions', payload);
      }

      navigate('/liveAuctions');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create the session.');
    }
  };

  const handlePostSelection = (postId) => {
    setSelectedPosts((prevPosts) => {
      if (prevPosts.includes(postId)) {
        return prevPosts.filter((id) => id !== postId);
      } else {
        return [...prevPosts, postId];
      }
    });
    setPostSelectedError(false); // Reset error when a post is selected
  };

  // Filter out posts where isSold is true
  const availablePosts = posts.filter((post) => !post.isSold);

  return (
    <div className={styles.container}>
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
        <>
          {availablePosts.length > 0 ? (
            <>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                  <label>Session Title:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Session Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Session Start Time:</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Session End Time:</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit">Submit</button>
                </div>
              </form>
              <div className={styles.postsContainer}>
                <label>Select Products To add To Session:</label>
                {postSelectedError && (
                  <p className={styles.error}>
                    Please select at least one product.
                  </p>
                )}
                <div className={styles.postGrid}>
                  {availablePosts.map((post) => (
                    <div key={post.id} className={styles.postItem}>
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handlePostSelection(post.id)}
                      />
                      <div className={styles.imgContainer}>
                        <img src={post.images[0]} alt={post.title} />
                      </div>
                      <span>{post.title}</span>
                      <span>BP: ${post.basePrice}</span>
                      <span>Dep: ${post.deposit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.nothing}>
              <h3>
                There are currently no products available to Create Session
              </h3>
              <button>
                <Link to="/add">Add Product</Link>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionForm;
