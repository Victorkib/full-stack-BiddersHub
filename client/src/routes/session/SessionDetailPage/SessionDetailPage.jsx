import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiRequest from '../../../lib/apiRequest';
import './SessionDetailPage.scss';

const SessionDetailPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await apiRequest.get(`/sessions/${id}`);
        console.log('fetched Individual session details: ', response.data);
        setSession(response.data);
      } catch (error) {
        console.error('Error fetching session', error);
      }
    };

    fetchSession();
  }, [id]);

  const handleNavigation = (post, img = null) => {
    navigate(`/posts/${post.id}`, {
      state: {
        post: post,
        title: post.title,
        image: img || post.images[0], // Pass the specific image if clicked, else the first image
        sessionId: session.id, // Pass session id to PostDetailPage
        sessionDetailId: id, // Pass id received from useParams()
      },
    });
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sessionDetailMain">
      <h1>{session.title}</h1>
      <p>{session.description}</p>
      <ul className="postList">
        {session.posts.map((post) => (
          <li key={post.id} className="postItem">
            <div onClick={() => handleNavigation(post.post)}>
              <h2>{post.post.title}</h2>
            </div>
            <div className="imagesContainer">
              {post.post.images.map((img, index) => (
                <div
                  className="imgHolder"
                  key={index}
                  onClick={() => handleNavigation(post.post, img)}
                >
                  <div className="vehicle">
                    <h5>Item: {index}</h5>
                    <img src={img} alt={`Image ${index}`} />
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionDetailPage;
