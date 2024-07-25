import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from '../../../lib/apiRequest';
import styles from './TrackIndividualItem.module.scss';
import Slider from 'react-slick';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

const TrackIndividualItem = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highestBid, setHighestBid] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      const res = await apiRequest.get(`/posts/getsinglePostData/${id}`);
      if (res.status) {
        setPosts(res.data);
        setLoading(false);
      } else {
        toast('error fetching posts');
      }
    };

    const fetchHighestBid = async () => {
      try {
        const response = await apiRequest.get(
          `/bidders/topFiveBidsOnItem?itemId=${id}`
        );
        if (response.status) {
          console.log(response.data);
          setHighestBid(response.data);
        }
      } catch (error) {
        console.error('Error fetching highest bid', error);
        toast('error fetching highest bid');
      }
    };

    fetchPostData();
    fetchHighestBid();
  }, [id]);

  const sliderSettings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <ThreeDots color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div className={styles.trackIndividualItem}>
      <ToastContainer />
      <div className={styles.mainCard}>
        <Slider {...sliderSettings}>
          {posts?.images?.map((image, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img src={image} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </Slider>
        <div className={styles.detailsCard}>
          <h2>{posts?.title}</h2>
          <p>Price: KSH{posts?.price}</p>
          <p>Address: {posts?.address}</p>
          <p>City: {posts?.city}</p>
          <p>Number in Stock: {posts?.numberInStock}</p>
          <p>Variety Number: {posts?.varietyNumber}</p>
          <p>Purchase Type: {posts?.purchaseType}</p>
          <p>Property: {posts?.property}</p>
          <p>Condition: {posts?.postDetail?.condition}</p>
          <p>Functionality: {posts?.postDetail?.functionality}</p>
          <p>Created by: {posts?.user?.username}</p>
        </div>
      </div>

      <div className={styles.bidsCard}>
        <h3>Highest Bids</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Bid Value</th>
            </tr>
          </thead>
          <tbody>
            {highestBid.map((bid) => (
              <tr key={bid.id}>
                <td>{bid.bidder.username}</td>
                <td>{bid.bidder.email}</td>
                <td>KSH: {bid.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackIndividualItem;
