import { useEffect, useState } from 'react';
import apiRequest from '../../../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Participation.scss';
import { ThreeDots } from 'react-loader-spinner';
import { resetHighestBidData } from '../../../Features/sessionEndNotifData/highestBidDataSlice';
import { clearItemBided } from '../../../Features/sessionEndNotifData/itemBidedSlice';

const Participation = () => {
  const bidder = JSON.parse(localStorage.getItem('bidder'));
  const highestBidData = useSelector(
    (state) => state.highestBidDataValue.highestBidData
  );

  console.log('highestBidData: ', highestBidData);
  const [data, setData] = useState({ posts: [], bids: [] });
  console.log('dataForParticipation:', data);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchItemsBidderHasBidOn = async () => {
      setLoading(true);
      try {
        const response = await apiRequest.get(
          `/bidders/getBidsAndPostsByBidder/${bidder?.id}`
        );
        if (response.status) {
          setData(response.data);
        }
      } catch (error) {
        console.log('error: ', error.response.data.error);
      } finally {
        setLoading(false);
      }
    };
    dispatch(resetHighestBidData());
    dispatch(clearItemBided());
    fetchItemsBidderHasBidOn();
  }, [bidder?.id, dispatch]);

  const sliderSettings = {
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
  };

  return (
    <div className="participation">
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
          {data.posts.length > 0 ? (
            <>
              {data.posts.map((post) => {
                const postBids = data.bids.filter(
                  (bid) => bid.itemId === post.id
                );

                return (
                  <div className="card" key={post.id}>
                    <div className="cardLeft">
                      <Slider {...sliderSettings} className="imageSlider">
                        {post?.images?.map((image, index) => (
                          <div key={index} className="slide">
                            <img src={image} alt={post.title} />
                          </div>
                        ))}
                      </Slider>
                    </div>
                    <div className="cardRight">
                      <h3>Bid Values</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Your Highest Bid </th>
                          </tr>
                        </thead>
                        <tbody>
                          {postBids.map((bid, index) => (
                            <tr key={bid.id}>
                              <td>{index + 1}</td>
                              <td>{bid.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="nothing">
              <p>No Participation History to Display</p>
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

export default Participation;
