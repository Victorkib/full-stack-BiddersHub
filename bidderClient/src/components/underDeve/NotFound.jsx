import { Link } from 'react-router-dom';
import './NotFound.scss';

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">Welcome</h1>
        {/* <p className="notfound-message">
          Oops! The page you are looking for does not exist.
        </p> */}
        <Link to="/usersSession" className="notfound-button">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
