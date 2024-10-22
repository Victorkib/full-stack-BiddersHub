import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Slider from 'react-slick';
import styles from './DashboardPage.module.scss';
import apiRequest from '../../lib/apiRequest';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { format } from 'timeago.js'; // Import timeago.js

import moment from 'moment-timezone';

const DashboardPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endTimeDt, setEndTimeDt] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const adjustedEndTime = moment.utc(endTimeDt).subtract(3, 'hours');

  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      updateRemainingTimes();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/sessions/validEndtimeSessions');
      if (res.status) {
        console.log('Valid endtime sessions', res.data);
        setSessions(res.data);
        setEndTimeDt(res.data.endTime);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await apiRequest.put(`/sessions/speedUpSession/${id}`);
      if (res.status) {
        fetchSessions();
        console.log('updatedSessionDt: ', res.data);
        toast.success('Session ended successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSession = (id) => {
    navigate(`/trackSession/${id}`);
  };

  const getRemainingTime = (endTime) => {
    // Parse the endTime in UTC
    const localEndTime = moment.utc(endTime);

    // Subtract 3 hours to adjust for the extra time being added
    const adjustedEndTime = localEndTime.subtract(3, 'hours');

    // Get the current time in Kenya timezone
    const localCurrentTime = moment().tz('Africa/Nairobi');

    // Calculate the time difference
    const timeDifference = adjustedEndTime.diff(localCurrentTime);

    if (timeDifference <= 0) return null;

    const duration = moment.duration(timeDifference);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const updateRemainingTimes = () => {
    setSessions((prevSessions) => {
      return prevSessions
        .map((session) => {
          const remainingTime = getRemainingTime(session.endTime);
          if (remainingTime === null) {
            return { ...session, remainingTime: 'Ended' };
          } else {
            session.remainingTime = remainingTime;
            return session;
          }
        })
        .filter((session) => session.remainingTime !== 'Ended'); // Remove sessions that have ended
    });
  };

  // updateIsSoldStatus(session.id); // Send PUT request when the timer ends
  const updateIsSoldStatus = async (sessionId) => {
    try {
      const res = await apiRequest.put(
        `/sessions/updateIsSoldStatus/${sessionId}`,
        { isSold: true }
      );
      if (res.status) {
        toast.success('Session status updated to Sold');
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update session status');
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className={styles.dashboardMain}>
      <ToastContainer />
      {loading ? (
        <div className={styles.loaderContainer}>
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <div className={styles.sessionsContainer}>
          {sessions.length > 0 ? (
            sessions?.map((session) => (
              <div key={session.id} className={styles.sessionCard}>
                {session?.posts?.length > 1 ? (
                  <Slider {...sliderSettings} className={styles.slider}>
                    {session.posts?.map((post, index) => (
                      <div key={index}>
                        <img
                          src={post?.post?.images[0]}
                          alt={`Post ${index}`}
                          className={styles.sliderImage}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <Slider
                    {...sliderSettings}
                    className={`${styles.slider} ${styles.horizontalSlider}`}
                  >
                    <div>
                      {session.posts[0]?.post?.images?.map((image, index) => (
                        <img
                          src={image}
                          key={index}
                          alt={`image${index}`}
                          className={styles.sliderImage}
                        />
                      ))}
                    </div>
                  </Slider>
                )}

                <div className={styles.sessionDetails}>
                  <div className={styles.sessionInfo}>
                    <h3>{session.title}</h3>
                    <p>
                      {expandedDescriptions[session.id]
                        ? session.description
                        : `${session.description.slice(0, 50)}...`}
                      {session.description.length > 100 && (
                        <button
                          className={styles.expandButton}
                          onClick={() => toggleDescription(session.id)}
                        >
                          {expandedDescriptions[session.id]
                            ? 'Show Less'
                            : 'Show More'}
                        </button>
                      )}
                    </p>

                    <p>Session Ends: {format(adjustedEndTime)}</p>
                    <p>Number of items {session.posts.length}</p>
                    <p>Ends in: {session.remainingTime}</p>
                  </div>
                  <div className={styles.sessionActions}>
                    <button onClick={() => handleTrackSession(session.id)}>
                      Track Session
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(session.id)}
                    >
                      Terminate Session
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.nothing}>
              <h3>There are currently no sessions to display</h3>
              <button>
                <Link to="/liveAuctions/create">Create Session</Link>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
