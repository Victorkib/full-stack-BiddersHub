import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './TrackSessionPage.module.scss';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiRequest from '../../../lib/apiRequest';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TrackSessionPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/sessions/${id}`);
      if (res.status) {
        console.log('trackSessionDt: ', res.data);
        setSession(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch session');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <ThreeDots
          className={styles.threeDots}
          color="#00BFFF"
          height={80}
          width={80}
        />
      </div>
    );
  }

  if (!session) {
    return <p>Session not found</p>;
  }
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className={styles.trackSessionMain}>
      <ToastContainer />
      <h2>Session Title: {session.title}</h2>

      <div className={styles.cardContainer}>
        {session?.posts?.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.sliderContainer}>
              <Slider {...sliderSettings} className={styles.slider}>
                {post.post.images.length > 0
                  ? post.post.images.map((img, index) => (
                      <div key={index} className={styles.cardImage}>
                        <img src={img} alt="image" />
                      </div>
                    ))
                  : ''}
              </Slider>
            </div>
            <div className={styles.cardDetails}>
              <h3>{post.post.title}</h3>
              <p>
                Base Price:{' '}
                {post.price?.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </p>
              <Link
                to={`/trackMore/${post.post.id}`}
                className={styles.moreLink}
              >
                More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackSessionPage;
