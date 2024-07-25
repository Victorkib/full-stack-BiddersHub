import Chat from '../../components/chat/Chat';
import List from '../../components/list/List';
import './profilePage.scss';
import apiRequest from '../../lib/apiRequest';
import { Await, Link, useLoaderData, useNavigate } from 'react-router-dom';
import { Suspense, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { resetUser } from '../../Features/userSuccesRegData/userSlice';
import ProfileUpdatePage from '../profileUpdatePage/profileUpdatePage';

function ProfilePage() {
  const data = useLoaderData();
  console.log('profilePageData: ', data);

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await apiRequest.post('/auth/logout');
      updateUser(null);
      dispatch(resetUser());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleError = (message) => {
    toast.error(message);
  };

  return (
    <div className="profilePage">
      <ToastContainer />
      <div className="chatContainer">
        <ProfileUpdatePage />
      </div>
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            {/* <Link to="/profile/update">
              <button>Update Profile</button>
            </Link> */}
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || 'noavatar.jpg'} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          {/* <div className="title">
            <h1>My Products</h1>
            <Link to="/add">
              <button>New Product</button>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="loader">
                <ThreeDots
                  className="threeDots"
                  color="#00BFFF"
                  height={80}
                  width={80}
                />
              </div>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading Products!</p>}
              onError={(error) => handleError('Error loading Products!')}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense> */}
          {/* <div className="title">
            <h1>Pending Bidding Products</h1>
          </div>
          <Suspense
            fallback={<ThreeDots color="#00BFFF" height={80} width={80} />}
          >
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading Products!</p>}
              onError={(error) => handleError('Error loading Products!')}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense> */}
        </div>
      </div>
      {/* <div className="chatContainer">
        <div className="wrapper">
          <Suspense
            fallback={<ThreeDots color="#00BFFF" height={80} width={80} />}
          >
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
              onError={(error) => handleError('Error loading chats!')}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div> */}
    </div>
  );
}

export default ProfilePage;
