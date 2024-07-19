import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SeeMorePastSessionPage.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import apiRequest from '../../../lib/apiRequest';
import { ThreeDots } from 'react-loader-spinner';

const SeeMorePastSessionPage = () => {
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(`/sessions/${sessionId}`);
        if (res.status === 200) {
          console.log('session details: ', res.data);
          setSession(res.data);
        } else {
          console.error('Failed to fetch session details:', res.statusText);
          // Handle error or show a notification to the user
        }
      } catch (error) {
        console.error('Error fetching session details:', error.message);
        // Handle error or show a notification to the user
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  const renderSlider = (images) => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </Slider>
    );
  };

  return (
    <div className="seeMorePage">
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
        <>
          {session && (
            <div className="sessionDetails">
              <div className="leftSection">
                <div className="leftCard">
                  <h3>{session.title}</h3>
                  <p>{session.description}</p>
                  <p>Items Auctioned: {session.posts.length}</p>
                  <p>
                    <strong>Started :</strong>{' '}
                    {new Date(session.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Ended :</strong>{' '}
                    {new Date(session.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="rightSection">
                {session.posts.map((post) => (
                  <div className="postCard" key={post.id}>
                    <div className="topMiniCard">
                      <div className="sliderContainer">
                        {renderSlider(post.post.images)}
                      </div>
                      <div className="moreButton">
                        <Link to={`/moreOnPastSessionItem/${post.post.id}`}>
                          View Item
                        </Link>
                      </div>
                    </div>
                    <div className="bottomMiniCard">
                      <h4>{post.post.title}</h4>
                      <p>Price: ${post.post.basePrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeeMorePastSessionPage;
