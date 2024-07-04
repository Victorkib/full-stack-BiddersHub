import { useContext } from 'react';
import SearchBar from '../../components/searchBar/SearchBar';
import './homePage.scss';
import { AuthContext } from '../../context/AuthContext';
import Categories from './categories/Categories';
import Stats from '../../components/stats/Stats';

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homePage">
      <div className="Homeparent">
        <div className="textContainer">
          <div className="wrapper">
            <h1 className="title">
              Actioneering: We make it happen, rain or shine
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
              explicabo suscipit cum eius, iure est nulla animi consequatur
              facilis id pariatur fugit quos laudantium temporibus dolor ea
              repellat provident impedit!
            </p>
            <SearchBar />
            <Stats />
          </div>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
      <div className="homeChildParent">
        <div className="firstchild">
          <img src="/BeeCar.jpg" alt="" />
        </div>
        <div className="secondChild">
          <img src="/BeeCar.jpg" alt="" />
        </div>
        <div className="thirdChild">
          <img src="/BeeCar.jpg" alt="" />
        </div>
        <div className="forthChild">
          <img src="/BeeCar.jpg" alt="" />
        </div>
      </div>
      {/* <Categories /> */}
      {/* New Sections */}
      <div className="aboutSection">
        <div className="wrapper">
          <h2>About Us</h2>
          <p>
            Actioneering is dedicated to making auctioneering accessible and
            efficient for everyone. With a team of passionate experts, we ensure
            that your auction experiences are seamless and successful.
          </p>
          <img src="/about-image.jpg" alt="About Us" />
        </div>
      </div>

      <div className="contactSection">
        <div className="wrapper">
          <h2>Contact Us</h2>
          <p>
            Have questions or need assistance? Contact our support team anytime
            for help with your auctions or account.
          </p>
          <div className="contactInfo">
            <div>
              <h3>Customer Support</h3>
              <p>Email: support@actioneering.com</p>
              <p>Phone: +1-123-456-7890</p>
            </div>
            <img src="/contact-image.jpg" alt="Contact Us" />
          </div>
        </div>
      </div>

      <div className="footerSection">
        <div className="wrapper">
          <h2>Footer</h2>
          <p>
            Stay updated with the latest auction news and events. Follow us on
            social media and subscribe to our newsletter for exclusive updates.
          </p>
          <div className="socialLinks">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>
          <p>&copy; 2024 Actioneering. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
