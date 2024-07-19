import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './verification.css';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import apiRequest from '../../lib/apiRequest';
import { ThreeDots } from 'react-loader-spinner';

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationDt } = location.state || {}; // Destructure state from location
  console.log(verificationDt);
  const user = useSelector((state) => state.userData.user);
  console.log(user);

  const [userMessage, setUserMessage] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserMessage(user);
  }, [user]);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.post('/auth/resend-verification', {
        email: verificationDt.email,
      });
      if (res.status) {
        console.log('resendEmailDt: ', res.data);
        // toast.success('Verification email resent successfully.');
      }
    } catch (error) {
      // toast.error('error resending email');
      console.log(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      {/* <ToastContainer /> */}
      {loading ? (
        <div className="loader">
          <ThreeDots
            className="threeDots"
            color="#00BFFF"
            height={80}
            width={80}
          />
        </div>
      ) : (
        <>
          <h2>
            A Verification Email will be sent shortly after Credential Review by
            the review board.
          </h2>
          <h4>
            Verification may take up to 2 hours to ensure credibility and
            Accountability from where you will receive an email{' '}
          </h4>
          {user.success ? (
            <div className="btnHolder">
              <p>{userMessage.emailMessage.message}</p>

              <button onClick={() => navigate('/register')}>
                Back to Register
              </button>
              <button onClick={() => navigate('/login')}>
                Have Verified Email? Login
              </button>
              <button onClick={() => handleResendEmail()}>
                Resend Verification Email
              </button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </div>
  );
};

export default VerificationPage;
