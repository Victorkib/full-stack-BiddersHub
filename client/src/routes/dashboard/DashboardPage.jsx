import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.scss';
import apiRequest from '../../lib/apiRequest';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardPage = () => {
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
    fetchUserPosts();
    const interval = setInterval(() => {
      updateRemainingTimes();
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/sessions/validEndtimeSessions');
      if (res.status) {
        console.log(res.data);
        setSessions(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/sessions/userPostedData');
      console.log(res.data);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch user posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await apiRequest.delete(`/sessions/${id}`);
      if (res.status) {
        fetchSessions();
        toast.success('Session deleted successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete Item in session');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = () => {
    navigate('/liveAuctions/create', {
      state: { posts },
    });
  };

  const getRemainingTime = (endTime) => {
    const timeDifference = new Date(endTime) - new Date();
    if (timeDifference <= 0) return null;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const updateRemainingTimes = () => {
    setSessions((prevSessions) => {
      return prevSessions.filter((session) => {
        const remainingTime = getRemainingTime(session.endTime);
        if (remainingTime === null) {
          return false;
        } else {
          session.remainingTime = remainingTime;
          return true;
        }
      });
    });
  };

  return (
    <div className={styles.dashboardMain}>
      <ToastContainer />
      <div className={styles.dshcontainer}>
        <h2>Dashboard</h2>
        <button onClick={handleCreateSession}>Create New Session</button>
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
          <div className={styles.holderOfSessionList}>
            <ul className={styles.sessionList}>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <li key={session.id} className={styles.sessionItem}>
                    <div className={styles.mainSessionArea}>
                      <div className={styles.firstSessionArea}>
                        {session.postImages.length > 0 && (
                          <img
                            src={session.postImages[0]}
                            alt="Session Post"
                            className={styles.sessionImage}
                          />
                        )}
                      </div>
                      <div className={styles.secondSessionArea}>
                        {session &&
                          session.posts?.map((po) => (
                            <div className="div" key={po.id}>
                              <h4>
                                <Link to={`/${po.post.id}`}>
                                  {session.title}
                                  {'->'}
                                </Link>
                              </h4>
                            </div>
                          ))}
                        <p>Desc: {session.description}</p>
                        {session &&
                          session.posts?.map((po) => (
                            <div className="div" key={po.id}>
                              <h5>Base Price: {po.post.price}</h5>
                            </div>
                          ))}
                        <hr />
                        <h5>Current Highest Bid:</h5>
                        <h5>Ends in: {session.remainingTime}</h5>
                        <button onClick={() => handleDelete(session.id)}>
                          Terminate Session
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="nothing">
                  <p>There are none to display</p>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
