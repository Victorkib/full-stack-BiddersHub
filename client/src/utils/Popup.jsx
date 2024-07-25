// Popup.jsx
import { useNavigate } from 'react-router-dom';
import React from 'react';
import styles from './Popup.module.scss';

const Popup = ({ onClose }) => {
  const navigate = useNavigate();
  const handleAuctionClick = () => {
    // Navigate to the current register page (replace with your actual route)
    navigate('/register');
    onClose(); // Close the popup after navigation
  };

  return (
    <div className={styles.popup}>
      <div className={styles.card}>
        <h2>Auctioneer</h2>
        <p>Actioneering: We make it happen, rain or shine.</p>
        <button onClick={handleAuctionClick}>Go to Register Page</button>
      </div>
      <div className={styles.card}>
        <h2>Bid</h2>
        <p>A brief description about bidding.</p>
        <span className={styles.link}>
          <a href="https://bidderspagefront.onrender.com/usersSession">
            Go to Bid Page
          </a>
        </span>
      </div>
    </div>
  );
};

export default Popup;
