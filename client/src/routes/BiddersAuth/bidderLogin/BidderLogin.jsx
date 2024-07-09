import { useState } from 'react';
import './BidderLogin.scss';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../../lib/apiRequest';
import { useDispatch } from 'react-redux';
import { setToken } from '../../../Features/bidderToken/bidderTokenSlice';

function BidderLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await apiRequest.post('/bidders/loginBidder', {
        email,
        password,
      });

      if (res.status === 200) {
        console.log('Logged in Bidder:', res.data);
        dispatch(setToken(res.data.token));
        localStorage.setItem('biddersToken', res.data.token);
        navigate('/usersSession');
      }
    } catch (err) {
      setError(err.response.data.error || 'Failed to login bidder');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bidderLogin">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Bidder{`'`}s Login</h1>
          <input name="email" required type="email" placeholder="Your Email" />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/biddersRegister">Don{`'`}t have an account? Register</Link>
        </form>
      </div>
      <div className="bidderImgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default BidderLogin;
