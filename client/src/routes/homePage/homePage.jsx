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
              Auctioneering : We make it happen, rain or shine
            </h1>
            <p>
              Discover exciting opportunities on our auction and bidding
              platform. Here, you can explore a wide range of items up for grabs
              and compete against other bidders to secure your desired purchase.
              Whether you{`'`}re a seasoned auction-goer or a first-time
              participant, our user-friendly interface makes it easy to
              navigate, place bids, and track your progress.
            </p>
            {/* <SearchBar /> */}
            <Stats />
          </div>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
      {/* <div className="homeChildParent">
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
      </div> */}
      <Categories />
      {/* New Sections */}
      <div className="aboutSection">
        <div className="wrapper">
          <div className="innerWrapper">
            <h2>About Us</h2>
            <p>
              Actioneering is dedicated to making auctioneering accessible and
              efficient for everyone. With a team of passionate experts, we
              ensure that your auction experiences are seamless and successful.
            </p>
          </div>

          <img src="/auction-hammer.jpg" alt="About Us" />
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
            <img src="/Customer-Care-Script.jpg" alt="Contact Us" />
          </div>
        </div>
      </div>

      <div className="footerSection">
        <div className="wrapper">
          <div className="innerFooterWrapper">
            <h2>Footer</h2>
            <p>
              Stay updated with the latest auction news and events. Follow us on
              social media and subscribe to our newsletter for exclusive
              updates.
            </p>
          </div>

          <div className="socialLinks">
            <a href="#" target="_blank">
              Facebook
            </a>
            <a href="#" target="_blank">
              Twitter
            </a>
            <a href="#" target="_blank">
              Instagram
            </a>
          </div>
          <p>&copy; 2024 BiddersHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
