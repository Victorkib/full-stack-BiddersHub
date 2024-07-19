import { useContext, useEffect, useState } from 'react';
import './navbar.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import Link and useLocation
import { AuthContext } from '../../context/AuthContext';
import { useNotificationStore } from '../../lib/notificationStore';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <nav>
      <div className="left">
        <Link
          to="/"
          className={location.pathname === '/' ? 'active hmImg' : ' hmImg'}
        >
          <img src="/logo.png" alt="" />
        </Link>

        {currentUser && (
          <Link
            to="/liveAuctions"
            className={location.pathname === '/liveAuctions' ? 'active' : ''}
          >
            Live-Sessions
          </Link>
        )}
        {currentUser && (
          <Link
            to="/liveAuctions/create"
            className={
              location.pathname === '/liveAuctions/create' ? 'active' : ''
            }
          >
            CreateSession
          </Link>
        )}
        {currentUser && (
          <Link
            to="/sessionsHistory"
            className={location.pathname === '/sessionsHistory' ? 'active' : ''}
          >
            History
          </Link>
        )}
        {currentUser && (
          <Link
            to="/products"
            className={location.pathname === '/products' ? 'active' : ''}
          >
            Products
          </Link>
        )}
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || '/noavatar.jpg'}
              alt=""
              onClick={handleClick}
            />
            {/* <span onClick={handleClick}>{currentUser.username}</span> */}
            <Link
              to="/profile"
              className={`profile ${
                location.pathname === '/profile' ? 'active' : ''
              }`}
            >
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/loginPopup"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              Sign in
            </Link>
            <Link
              to="/popup"
              className={
                location.pathname === '/register'
                  ? 'active register'
                  : 'register'
              }
            >
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? 'menu active' : 'menu'}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          {currentUser && (
            <Link
              to="/liveAuctions"
              className={location.pathname === '/liveAuctions' ? 'active' : ''}
            >
              liveAuctions
            </Link>
          )}

          {currentUser && (
            <Link
              to="/sessionsHistory"
              className={location.pathname === '/usersSession' ? 'active' : ''}
            >
              History
            </Link>
          )}
          <Link
            to="/profile"
            className={`profile ${
              location.pathname === '/profile' ? 'active' : ''
            }`}
          >
            UserProfile
          </Link>
          {!currentUser && (
            <>
              <Link
                to="/login"
                className={location.pathname === '/login' ? 'active' : ''}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className={location.pathname === '/register' ? 'active' : ''}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
