import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './verification.css';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import apiRequest from '../../lib/apiRequest';

const VerificationPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userData.user);
  const [userMessage, setUserMessage] = useState(user);

  useEffect(() => {
    setUserMessage(user);
  }, [user]);

  const handleResendEmail = async (email) => {
    try {
      const res = await apiRequest.post('/auth/resend-verification', { email });
      if (res.data.error) {
        throw new Error(res.data.error);
      }
      toast.success('Verification email resent successfully.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="verification-container">
      <h1>Verify Your Email</h1>
      <h6>Email delivery may take upto 5 mins</h6>
      {user.success ? (
        <div className="btnHolder">
          <p>{userMessage.emailMessage.message}</p>

          <button onClick={() => navigate('/register')}>
            Back to Register
          </button>
          <button onClick={() => navigate('/login')}>
            Have Verified Email? Login
          </button>
          <button onClick={handleResendEmail}>Resend Verification Email</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VerificationPage;
