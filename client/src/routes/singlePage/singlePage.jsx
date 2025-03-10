import './singlePage.scss';
import Slider from '../../components/slider/Slider';
import Map from '../../components/map/Map';
import { useNavigate, useLoaderData, Await } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useContext, useState, Suspense } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../lib/apiRequest';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SinglePage() {
  const { postResponse } = useLoaderData();
  const [saved, setSaved] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (post) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setSaved((prev) => !prev);
    try {
      await apiRequest.post('/users/save', { postId: post.id });
      toast.success('Post saved successfully');
    } catch (err) {
      console.log(err);
      toast.error('Failed to save post');
      setSaved((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [display, setFormDisplay] = useState(false);

  const handleMessageBtn = () => {
    setFormDisplay((prev) => !prev);
  };

  const handleSendMessage = async (e, post) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest.post('/chats', { message });
      if (res.status) {
        toast.success('Message sent successfully');
        setFormDisplay(false);
        setMessage('');
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to send message');
      setError(err.message);
      setFormDisplay(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="singlePage">
      <ToastContainer />
      <Suspense
        fallback={
          <div className="loaderContainer">
            <ThreeDots color="#00BFFF" height={80} width={80} />
          </div>
        }
      >
        <Await resolve={postResponse}>
          {(post) => {
            if (!post?.data?.latitude || !post?.data?.longitude) {
              return <div>Location data is unavailable</div>;
            }

            return (
              <>
                <div className="details">
                  <div className="wrapper">
                    <Slider images={post?.data?.images} />
                    <div className="info">
                      <div className="top">
                        <div className="post">
                          <h1>{post?.data?.title}</h1>
                          <div className="address">
                            <img src="/pin.png" alt="" />
                            <span>{post?.data?.address}</span>
                          </div>
                          <div className="price">
                            KSH {post?.data?.basePrice}
                          </div>
                        </div>
                        <div className="user">
                          <img src={post?.data?.user?.avatar} alt="" />
                          <span>{post?.data?.user?.username}</span>
                        </div>
                      </div>
                      <div
                        className="bottom"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            post?.data?.postDetail?.desc
                          ),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="features">
                  <div className="wrapper">
                    <p className="title">General</p>
                    <div className="listVertical">
                      <div className="feature">
                        <img src="/fee.png" alt="" />
                        <div className="featureText">
                          <span>Product</span>
                          <p>{post?.data?.property}</p>
                        </div>
                      </div>
                      <div className="feature">
                        <img src="/utility.png" alt="" />
                        <div className="featureText">
                          <span>Condition:</span>
                          {post?.data?.postDetail?.condition}
                        </div>
                      </div>
                      <div className="feature">
                        <img src="/Mybg.png" alt="" />
                        <div className="featureText">
                          <span>Functionality:</span>
                          {post?.data?.postDetail?.functionality}
                        </div>
                      </div>
                    </div>
                    <div className="listHorizontal">
                      <div className="feature">
                        <img src="/Mybg.png" alt="" />
                        <div className="featureText">
                          <h6>Sold Status</h6>
                          <p>{post?.data?.isSold ? 'Sold' : 'Not Sold'}</p>
                        </div>
                      </div>
                      <div className="feature">
                        <img src="/Mybg.png" alt="" />
                        <div className="featureText">
                          <h6>Rating</h6>
                          <p>
                            {post.postDetail?.rating < 5
                              ? post.postDetail?.rating
                              : 5}{' '}
                            / 5
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="title">Location</p>
                    <div className="mapContainer">
                      <Map items={[post?.data]} />
                    </div>
                    <div className="buttons">
                      <button onClick={handleMessageBtn}>
                        <img src="/chat.png" alt="" />
                        Send a Message
                      </button>
                      {display && (
                        <form onSubmit={(e) => handleSendMessage(e, post)}>
                          <label>Message</label>
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button>Send</button>
                        </form>
                      )}
                      <button
                        onClick={() => handleSave(post)}
                        // style={{ backgroundColor: saved ? '#fece51' : 'white' }}
                      >
                        <img src="/save.png" alt="" />
                        {saved ? 'Place Saved' : 'Save the Place'}
                      </button>
                      {error && <span>{error}</span>}
                    </div>
                  </div>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export default SinglePage;
