import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from '../../../lib/apiRequest';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThreeDots } from 'react-loader-spinner';
import './MoreOnPastSessionItem.scss';

const MoreOnPastSessionItem = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState();
  const [bidData, setBidData] = useState([]);

  useEffect(() => {
    const fetchItemData = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        if (res.status) {
          setPosts(res.data);
          console.log('LoggedPosts:', res.data);
        }
      } catch (error) {
        console.log(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBidsRelatedToItem = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(`/bidders/allBidsOnItem/${id}`);
        if (res.status) {
          setBidData(res.data);
          console.log(res.data);
        }
      } catch (error) {
        console.log(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
    fetchBidsRelatedToItem();
  }, [id]);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const downloadCSV = () => {
    const csvRows = [
      ['Profile', 'Username', 'Email', 'Bid Amount'],
      ...bidData.map((bid) => [
        bid.bidder.profile,
        bid.bidder.username,
        bid.bidder.email,
        bid.amount,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `bids_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {loading || !posts || !bidData.length ? (
        <div className="loader">
          <ThreeDots
            className="threeDots"
            color="#00BFFF"
            height={80}
            width={80}
          />
        </div>
      ) : (
        <div className="moreOnPastItem">
          <div className="topSection">
            <div className="leftCard">
              <Slider {...sliderSettings} className="sliderContainer">
                {posts.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image ? image : '/noavatar.jpg'}
                      alt={`Slide ${index}`}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="rightCard">
              <div className="topMiniCard">
                <h3>Highest Bidder</h3>
                <img
                  src={
                    bidData[0].bidder.profile
                      ? bidData[0].bidder.profile
                      : '/noavatar.jpg'
                  }
                  alt="Bidder Profile"
                  className="profileImage"
                />
              </div>
              <div className="bottomMiniCard">
                <table>
                  <tbody>
                    <tr>
                      <td>Username</td>
                      <td>{bidData[0].bidder.username}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{bidData[0].bidder.email}</td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td>{bidData[0].amount}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>{posts?.isSold === true ? 'Sold' : 'Not Sold'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="bottomSection">
            <table>
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Bid Amount</th>
                </tr>
              </thead>
              <tbody>
                {bidData.map((bid, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          bid.bidder.profile
                            ? bid.bidder.profile
                            : '/noavatar.jpg'
                        }
                        alt="Bidder Profile"
                        className="smallProfileImage"
                      />
                    </td>
                    <td>{bid.bidder.username}</td>
                    <td>{bid.bidder.email}</td>
                    <td>{bid.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={downloadCSV}>Download Data</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MoreOnPastSessionItem;
