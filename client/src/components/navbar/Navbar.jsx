import { useContext, useEffect, useState } from 'react';
import './navbar.scss';
import { NavLink, useNavigate, Link } from 'react-router-dom'; // Import NavLink
import { AuthContext } from '../../context/AuthContext';
import { useNotificationStore } from '../../lib/notificationStore';

function Navbar() {
  const [open, setOpen] = useState(false);

  const [validUser, setValidUser] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) fetch();
  }, [currentUser, fetch]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>Actioneers</span>
        </Link>
        <NavLink exact to="/" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/forgotPassword" activeClassName="active">
          Actioneers
        </NavLink>
        {currentUser && (
          <NavLink to="/liveAuctions" activeClassName="active">
            live-Auctions
          </NavLink>
        )}
        {/* {validUser ? <NavLink to="/liveAuctions" activeClassName="active">Live-Auction</NavLink> : ''} */}
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || '/noavatar.jpg'}
              alt=""
              onClick={handleClick}
            />
            <span onClick={handleClick}>{currentUser.username}</span>
            <NavLink to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </NavLink>
          </div>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
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
          <NavLink exact to="/" activeClassName="active">
            Home
          </NavLink>
          {currentUser && (
            <NavLink to="/liveAuctions" activeClassName="active">
              live-Auctions
            </NavLink>
          )}
          <NavLink to="/profile" activeClassName="active">
            Profile
          </NavLink>
          <NavLink to="/agents" activeClassName="active">
            Agents
          </NavLink>
          {!currentUser && (
            <>
              <a href="/login">Sign in</a>
              <a href="/register">Sign up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
