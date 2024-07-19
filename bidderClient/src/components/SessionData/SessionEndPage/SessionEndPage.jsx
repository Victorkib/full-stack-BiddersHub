import Fireworks from '../Fireworks/Fireworks';
import './SessionEndPage.scss';
const SessionEndPage = ({ winners }) => {
  console.log(winners);
  return (
    <div className="sessionEndPage">
      <Fireworks className="fireworks" />
      <div className="holderOfBoth">
        <div className="Secondfireworks">
          {winners &&
            winners?.map((winner, index) => (
              <div key={index} className="innerDiv">
                {winner.username ? <h1>Congratulations!!</h1> : ''}

                {winner.username ? (
                  <p>
                    <strong>{winner.username} </strong> won {winner.postTitle}{' '}
                    with a bid of
                    <i>
                      <strong>${winner.amount}</strong>{' '}
                    </i>
                  </p>
                ) : (
                  <p>No Winners At this Time</p>
                )}
              </div>
            ))}
        </div>
        <div className="emailSent">
          <h5>An email has been sent for further communication</h5>
        </div>
      </div>
    </div>
  );
};

export default SessionEndPage;
