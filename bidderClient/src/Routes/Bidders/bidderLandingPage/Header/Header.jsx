// Header.jsx

import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-card">
          <img src="/Mybg.png" alt="Auction" className="header-image" />
        </div>
      </div>
      <div className="header-right">
        <div className="header-card">
          <h2>Welcome to Our Auction Platform</h2>
          <p>
            Discover amazing items and bid on your favorites. Our platform
            provides a seamless and exciting auction experience. Start bidding
            now and grab the best deals!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
