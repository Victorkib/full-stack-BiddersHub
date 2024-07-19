import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Wins.scss';
import apiRequest from '../../../lib/apiRequest';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThreeDots } from 'react-loader-spinner';

const Wins = () => {
  const bidder = JSON.parse(localStorage.getItem('bidder'));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const findBidderWins = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(
          `/bidders/highestBidderOnItem/${
            bidder?.id
          }?email=${encodeURIComponent(bidder.email)}`
        );

        if (res.status) {
          console.log('biddersWins: ', res.data);
          setPosts(res.data);
        }
      } catch (error) {
        console.error('Error fetching bidder wins:', error);
      } finally {
        setLoading(false);
      }
    };
    findBidderWins();
  }, [bidder.id]);

  const sliderSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div className="wins">
      <h2 className="congratulations">Congratulations!</h2>
      {loading ? (
        <div className="loader">
          <ThreeDots
            className="threeDots"
            color="#00BFFF"
            height={80}
            width={80}
          />
        </div>
      ) : (
        <div className="cardContainer">
          {posts?.length > 0 ? (
            <>
              {posts?.map((win, index) => (
                <div key={index} className="win-card">
                  <Slider {...sliderSettings} className="imageSlider">
                    {win?.post?.images?.map((image, idx) => (
                      <div key={idx} className="slide">
                        <img src={image} alt="Post" className="slider-image" />
                      </div>
                    ))}
                  </Slider>
                  <div className="win-card__details">
                    <h3>{win?.post?.title}</h3>
                    <p>Base Price: ${win?.post?.basePrice}</p>
                    <p>Winning Amount: ${win?.highestBid?.amount}</p>
                    <p>An Email Has Been Sent To For Further Communication</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="nothing">
              <p>No Current Wins! Better Luck Next Time</p>
              <button>
                <Link to="/usersSession">Start Bidding</Link>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wins;
