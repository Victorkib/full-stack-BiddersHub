import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiRequest from '../../../lib/apiRequest';
import styles from './SessionListPage.module.scss';

const SessionListPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      updateRemainingTimes();
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get('/sessions/validEndtimeSessions');
      console.log('valid Endtime sessions: ', response.data);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions: ', error);
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    const biddersToken = localStorage.getItem('biddersToken');
    if (!biddersToken) {
      navigate('/biddersRegister');
    }
  }, [navigate]);

  //  useEffect(() => {
  //    const biddersToken = document.cookie.replace(
  //      /(?:(?:^|.*;\s*)biddersToken\s*\=\s*([^;]*).*$)|^.*$/,
  //      '$1'
  //    );
  //    if (!biddersToken) {
  //      navigate('/biddersRegister');
  //    }
  //  }, [navigate]);

  return (
    <div className={styles.sessionListMain}>
      <ToastContainer />
      <h1>Available Sessions</h1>
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
        <ul className={styles.sessionList}>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <li key={session.id} className={styles.sessionItem}>
                <div className={styles.mainSessionArea}>
                  <div className={styles.firstSessionArea}>
                    {session.postImages.length > 0 && (
                      <Link to={`/sessions/${session.id}`}>
                        <img
                          src={session.postImages[0]}
                          alt="Session Post"
                          className={styles.sessionImage}
                        />
                      </Link>
                    )}
                  </div>
                  <div className={styles.secondSessionArea}>
                    <h2>
                      <Link to={`/sessions/${session.id}`}>
                        {session.title}
                      </Link>
                    </h2>
                    <p>Desc: {session.description}</p>
                    <hr />
                    <h5>Ends in: {session.remainingTime}</h5>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className={styles.nothing}>
              <p>There are no sessions to display</p>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default SessionListPage;
