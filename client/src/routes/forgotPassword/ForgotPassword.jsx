import { useState } from 'react';
import './forgotPassword.scss';
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ setIsForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiRequest.post('/auth/forgotPassword', { email });
      navigate('/emailSent');
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={isLoading}>Send Email</button>
        {error && <span>{error}</span>}
        <button
          type="button"
          onClick={() => setIsForgotPassword(false)}
          className="back-to-login"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
