import { useContext, useState } from 'react';
import './profileUpdatePage.scss';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';
import UploadWidget from '../../components/uploadWidget/UploadWidget';
import { ThreeDots } from 'react-loader-spinner'; // Import loader
import { ToastContainer, toast } from 'react-toastify';

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState([]);
  const [loading, setLoading] = useState(false); // State for loader

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const { username, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email: currentUser.email, // Use current email
        password,
        avatar: avatar[0],
      });
      updateUser(res.data);
      toast.success('Success Profile Edit');
      // navigate('/profile');
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  return (
    <div className="profileUpdatePage">
      <ToastContainer />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={currentUser.email} // Display current email
              readOnly // Make the email field read-only
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        {loading ? (
          <ThreeDots color="#333" height={80} width={80} /> // Display loader while uploading
        ) : (
          <>
            <img
              src={avatar[0] || currentUser.avatar || '/noavatar.jpg'}
              alt=""
              className="avatar"
            />
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'estate',
                multiple: false,
                maxImageFileSize: 2000000,
                folder: 'avatars',
              }}
              setState={setAvatar}
              setLoading={setLoading} // Pass setLoading to manage loading state in UploadWidget
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
