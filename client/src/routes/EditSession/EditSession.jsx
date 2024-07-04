import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './EditSessionForm.module.scss';
import apiRequest from '../../lib/apiRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSessionForm = ({ session, onClose, onUpdate }) => {
  const [title, setTitle] = useState(session.title);
  const [description, setDescription] = useState(session.description);
  const [endTime, setEndTime] = useState(session.endTime);
  const [selectedPosts, setSelectedPosts] = useState(
    session.posts.map((post) => post.id)
  );
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await apiRequest.get('/sessions/userPostedData');
        if (res.status) {
          setUserPosts(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserPosts();
  }, []);

  const handleEdit = async () => {
    try {
      const res = await apiRequest.put(`/sessions/${session.id}`, {
        title,
        description,
        endTime,
        selectedPosts,
      });
      if (res.status === 200) {
        toast.success('Session updated successfully');
        onUpdate();
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update session');
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
    <div className={styles.editSessionForm}>
      <ToastContainer />
      <h2>Edit Session</h2>
      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>End Time</label>
      <input
        type="datetime-local"
        value={new Date(endTime).toISOString().slice(0, 16)}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <label>Selected Posts</label>
      <div className={styles.postGrid}>
        {session &&
          session?.posts?.map((post) => (
            <div key={post.id} className={styles.postItem}>
              <input
                type="checkbox"
                checked={selectedPosts.includes(post.id)}
                onChange={() => handlePostSelection(post.id)}
              />
              <img src={post?.post?.images[0]} alt={post.title} />
              <span>{post.title}</span>
              <span>${post.price}</span>
            </div>
          ))}
      </div>
      <label>Add More Posts</label>
      <div className={styles.postGrid}>
        {userPosts
          .filter((post) => !selectedPosts.includes(post.id))
          .map((post) => (
            <div key={post.id} className={styles.postItem}>
              <input
                type="checkbox"
                onChange={() => handlePostSelection(post.id)}
              />
              <img src={post?.post?.images[0]} alt={post.title} />
              <span>{post.title}</span>
              <span>${post.price}</span>
            </div>
          ))}
      </div>
      <button onClick={handleEdit}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditSessionForm;
