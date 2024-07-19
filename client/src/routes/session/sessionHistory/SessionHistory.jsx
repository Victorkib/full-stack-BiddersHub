import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiRequest from '../../../lib/apiRequest';
import './SessionHistory.scss';
import { ThreeDots } from 'react-loader-spinner';

const SessionsHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllSessionHistory = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get('/sessions');
        if (res.status === 200) {
          console.log('sessions: ', res.data);
          setSessions(res.data);
        } else {
          console.error('Failed to fetch sessions:', res.statusText);
          // Handle error or show a notification to the user
        }
      } catch (error) {
        console.error('Error fetching sessions:', error.message);
        // Handle error or show a notification to the user
      } finally {
        setLoading(false);
      }
    };

    fetchAllSessionHistory();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader">
          <ThreeDots
            className="threeDots"
            color="#00BFFF"
            height={80}
            width={80}
          />
        </div>
      ) : (
        <div className="sessionsHistory">
          <h2>Past Sessions History</h2>
          <div className="sessionsTable">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div className="sessionCard" key={session.id}>
                  <h3>{session.title}</h3>
                  <p>{session.description}</p>
                  <p>
                    <strong>Started :</strong>{' '}
                    {new Date(session.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Ended :</strong>{' '}
                    {new Date(session.endTime).toLocaleString()}
                  </p>
                  <Link
                    to={`/seePastSessionMore/${session.id}`}
                    className="seeMoreButton"
                  >
                    See More
                  </Link>
                </div>
              ))
            ) : (
              <p>No sessions found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SessionsHistory;
