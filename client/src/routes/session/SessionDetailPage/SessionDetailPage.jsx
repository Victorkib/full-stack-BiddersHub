import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiRequest from '../../../lib/apiRequest';
import './SessionDetailPage.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThreeDots } from 'react-loader-spinner';

const SessionDetailPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await apiRequest.get(`/sessions/${id}`);
        console.log('Fetched individual session details:', response.data);
        setSession(response.data);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false); // Update loading state after fetch completes
      }
    };

    fetchSession();
  }, [id]);

  const handleNavigation = (post) => {
    navigate(`/posts/${post.id}`, {
      state: {
        post,
        sessionDetailId: id,
      },
    });
  };

  if (loading || !session) {
    return (
      <div className="loaderContainer">
        <ThreeDots className="sessionLoader" height={80} width={80} />
        <p>Loading session details...</p>
      </div>
    );
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
    <div className="sessionDetailMain">
      <ul className="postList">
        {session.posts.map(({ post }) => (
          <li
            key={post.id}
            className="postItem"
            onClick={() => handleNavigation(post)}
          >
            <h2>{post.title}</h2>
            <div className="sliderContainer">
              <Slider {...sliderSettings} className="slider">
                {post.images.map((img, index) => (
                  <div key={index} className="imgHolder">
                    <img src={img} alt={`Image ${index}`} />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="cardTitle">Click to start bidding</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionDetailPage;
