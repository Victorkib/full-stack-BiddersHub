// Footer.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section company">
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Our Services</li>
            <li>Privacy Policy</li>
            <li>Affiliate Program</li>
          </ul>
        </div>
        <div className="footer-section get-help">
          <h3>Get Help</h3>
          <ul>
            <li>FAQ</li>
            <li>Shipping</li>
            <li>Returns</li>
            <li>Order Status</li>
            <li>Payment Options</li>
          </ul>
        </div>
        <div className="footer-section online-shop">
          <h3>Online Shop</h3>
          <ul>
            <li>Watch</li>
            <li>Bag</li>
            <li>Shoes</li>
            <li>Dress</li>
          </ul>
        </div>
        <div className="footer-section follow-us">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebookF} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faLinkedinIn} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
