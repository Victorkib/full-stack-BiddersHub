import { useState } from 'react';
import './BidderRegister.scss';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../../lib/apiRequest';

function BiddersRegister() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.target);

    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const res = await apiRequest.post('/bidders/register', {
        email,
        username,
        password,
      });

      if (res.status) {
        console.log('Registered Bidder:', res.data);
        localStorage.setItem('biddersToken', res.data.token);
        navigate('/usersSession');
      } else {
        setError(res.data.error || 'Error registering bidder');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register bidder');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bidderRegister">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Register as a Bidder</h1>
          <input name="email" required type="email" placeholder="Your Email" />
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
          <button disabled={isLoading}>Register</button>
          {error && <span className="error">{error}</span>}
          <Link to="/biddersLogin">Already have an account? Login</Link>
        </form>
      </div>
      <div className="bidderImgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default BiddersRegister;
