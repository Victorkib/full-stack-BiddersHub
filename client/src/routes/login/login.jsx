import { useContext, useState } from 'react';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import ForgotPassword from '../forgotPassword/ForgotPassword'; // Import ForgotPassword component
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles
import { setUser } from '../../Features/userSuccesRegData/userSlice';
import { useDispatch } from 'react-redux';

function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle between login and forgot password

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.target);

    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const res = await apiRequest.post('/auth/login', {
        username,
        password,
      });
      console.log('logedInDt: ', res.data);
      if (res.status) {
        updateUser(res.data);
        dispatch(setUser(res.data));
        // toast.success('Login successful!');
        navigate('/');
      } else {
        const errorMessage =
          res.status === 403
            ? 'Please verify your email first.'
            : res.data.message;
        setError(errorMessage);
        navigate(`/verification`, {
          state: {
            verificationDt: res.data.user,
          },
        });
        // toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err.response.status === 403
          ? 'Please verify your email first.'
          : err.response.data.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <ToastContainer /> {/* Add ToastContainer */}
      {isForgotPassword ? (
        <ForgotPassword setIsForgotPassword={setIsForgotPassword} /> // Render ForgotPassword component
      ) : (
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h1>Welcome back</h1>
            <input
              name="username"
              required
              minLength={3}
              maxLength={20}
              type="text"
              placeholder="Your Unique Username"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
            />
            <button disabled={isLoading}>Login</button>
            {error && <span>{error}</span>}
            <Link
              onClick={() => setIsForgotPassword(true)}
              className="forgot-password-link"
            >
              Forgot password?
            </Link>
            <Link to="/register">{"Don't"} have an account?</Link>
          </form>
        </div>
      )}
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
