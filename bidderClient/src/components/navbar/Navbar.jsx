import { useEffect, useState } from 'react';
import './navbar.scss';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [number, setNumber] = useState('');

  const wallet = useSelector((state) => state.wallet.details);
  const highestBidData = useSelector(
    (state) => state.highestBidDataValue.highestBidData
  );
  const itemBided = useSelector((state) => state.itemBidedDataValue.itemBided);
  console.log('highestBidData: ', highestBidData);
  console.log('itemBided: ', itemBided);

  useEffect(() => {
    if (highestBidData || itemBided) {
      setNumber(1);
    } else {
      setNumber('');
    }
  }, [highestBidData, itemBided]);

  const bidder = useSelector((state) => state.bidder.profile);
  const currentUser = JSON.parse(localStorage.getItem('bidder'));
  console.log('currentUser: ', currentUser);

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <nav>
      <div className="left">
        <Link
          to="#"
          className={location.pathname === '/' ? 'active hmImg' : ' hmImg'}
        >
          <img src="/hammer.jpg" alt="" />
        </Link>
        {currentUser ? (
          <Link
            to="/usersSession"
            className={location.pathname === '/liveAuctions' ? 'active' : ''}
          >
            live-Auctions
          </Link>
        ) : (
          ''
        )}
        {currentUser ? (
          <div className="userInner">
            <Link
              to="/resultNotifications"
              className={`profile ${
                location.pathname === '/resultNotifications' ? 'active' : ''
              }`}
            >
              {number > 0 && <div className="notification">{number}</div>}
              <span>Notifications</span>
            </Link>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={bidder?.profile || '/noavatar.jpg'}
              alt=""
              onClick={handleClick}
            />

            <span onClick={handleClick}>{currentUser?.username}</span>
            <span onClick={handleClick}>Wallet: {wallet?.balance}</span>
            <Link
              to="/bidderProfile"
              className={`profile ${
                location.pathname === '/profile' ? 'active' : ''
              }`}
            >
              {/* {number > 0 && <div className="notification">{number}</div>} */}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              Sign in
            </Link>
            <Link
              to="/register"
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
              to="/usersSession"
              className={location.pathname === '/liveAuctions' ? 'active' : ''}
            >
              liveAuctions
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
