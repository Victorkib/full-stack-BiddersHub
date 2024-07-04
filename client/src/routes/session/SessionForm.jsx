import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './session.module.scss';
import apiRequest from '../../lib/apiRequest';

const SessionForm = ({ onSuccess, session = {} }) => {
  const [title, setTitle] = useState(session?.title || '');
  const [description, setDescription] = useState(session?.description || '');
  const [startTime, setStartTime] = useState(session?.startTime || '');
  const [endTime, setEndTime] = useState(session?.endTime || '');
  const [selectedPosts, setSelectedPosts] = useState(
    session?.items?.map((item) => item.postId) || []
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { posts } = location.state || { posts: [] };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className={styles.allBiddingitems}>
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
        <div>
          <label>Select Posts To add To Session:</label>
          <div className={styles.postGrid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postItem}>
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => handlePostSelection(post.id)}
                />
                <img src={post.images[0]} alt={post.title} />
                <span>{post.title}</span>
                <span>${post.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;
