import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SessionDetailPage.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThreeDots } from 'react-loader-spinner';
import apiRequest from '../../../lib/apiRequest';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreditWalletPopup from '../../../Routes/Bidders/Wallet/CreditWalletPopup';

const SessionDetailPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreditAmountPopup, setShowCreditAmountPopup] = useState(false);
  const [showCreditWalletPopup, setShowCreditWalletPopup] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const bidder = JSON.parse(localStorage.getItem('bidder'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await apiRequest.get(
          `/sessions/indiSessBidders/${id}`
        );
        console.log('Fetched individual session details:', response.data);
        setSession(response.data);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    fetchBidderWalletBalance();
  }, [id, bidder.id]);

  const fetchBidderWalletBalance = async () => {
    try {
      const response = await apiRequest.get(`/wallet/balance/${bidder.id}`);
      setWalletBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const handleNavigation = async (post) => {
    if (walletBalance < post.deposit) {
      setCreditAmount(post.deposit - walletBalance);
      setShowCreditAmountPopup(true);
      return;
    }

    navigate(`/posts/${post.id}`, {
      state: {
        post,
        sessionDetailId: id,
      },
    });
  };

  if (loading || !session) {
    return (
      <div className="loaderContainer">
        <ThreeDots className="sessionLoader" height={80} width={80} />
        <p>Loading session details...</p>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="sessionDetailMain">
      <ToastContainer />
      <ul className="postList">
        {session.posts.map((post) => (
          <li
            key={post.id}
            className="postCard"
            onClick={() => handleNavigation(post.post)}
          >
            <div className="leftSection">
              <Slider {...sliderSettings} className="slider">
                {post?.post?.images?.map((img, index) => (
                  <div key={index} className="imgHolder">
                    <img src={img} alt={`Image ${index}`} />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="rightSection">
              <h4>{post?.post?.title ? post?.post?.title : 'No Title'}</h4>
              <h4>
                Required Deposit: $
                {post?.post?.deposit ? post?.post?.deposit : 'No Deposit'}
              </h4>
            </div>
          </li>
        ))}
      </ul>

      {showCreditAmountPopup && (
        <CreditAmountPopup
          amount={creditAmount}
          balance={walletBalance}
          onChange={(e) => setCreditAmount(e.target.value)}
          onSubmit={() => {
            setShowCreditAmountPopup(false);
            setShowCreditWalletPopup(true);
          }}
          onCancel={() => setShowCreditAmountPopup(false)}
        />
      )}

      {showCreditWalletPopup && (
        <CreditWalletPopup
          show={showCreditWalletPopup}
          onClose={() => setShowCreditWalletPopup(false)}
          walletId={bidder.wallet.id}
          amount={creditAmount}
          onCreditSuccess={() => {
            setShowCreditWalletPopup(false);
            fetchBidderWalletBalance();
          }}
        />
      )}
    </div>
  );
};

export default SessionDetailPage;

const CreditAmountPopup = ({
  amount,
  balance,
  onChange,
  onSubmit,
  onCancel,
}) => (
  <div className="amountPopup">
    <label>
      <strong> Credit Wallet To Bid</strong>
    </label>
    <hr />
    <p>Current amount:{balance}</p>
    <p>Deficit amount:{amount}</p>
    <input
      type="number"
      value={amount}
      onChange={onChange}
      placeholder="Enter amount to credit"
      className="amountInput"
    />
    <div className="amountBtn">
      <button type="button" onClick={onCancel} className="amountButton">
        <span>Cancel</span>
      </button>
      <button type="button" onClick={onSubmit} className="amountButton">
        <span>→</span>
      </button>
    </div>
  </div>
);
