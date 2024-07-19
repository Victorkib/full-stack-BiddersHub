import { useNavigate } from 'react-router-dom';
import './ResultOfSession.scss';

const ResultNotifications = () => {
  const navigate = useNavigate();
  const handleWiningClick = () => {
    navigate('/wins');
  };
  const handleParticipationClick = () => {
    navigate('/participation');
  };
  return (
    <div className="ResultOfSession">
      <div className="cardContainer">
        <div className="card">
          <h2>Winnings</h2>
          <p>
            Explore the items you{`'`}ve won through bidding. Click the button
            to see your winnings in detail.
          </p>
          <button className="cardButton" onClick={handleWiningClick}>
            View Winnings
          </button>
        </div>
        <div className="card">
          <h2>Participations</h2>
          <p>
            Check out all the auctions you{`'`}ve participated in. Click the
            button to see your participation history.
          </p>
          <button className="cardButton" onClick={handleParticipationClick}>
            View Participations
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultNotifications;
