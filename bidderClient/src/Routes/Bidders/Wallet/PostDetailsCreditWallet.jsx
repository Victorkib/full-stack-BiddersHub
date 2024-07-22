/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CreditWalletPopup.module.scss';

const PostDetailCreditWalletPopup = ({
  show,
  onClose,
  walletId,
  amount,
  onCreditSuccess,
}) => {
  const paypalButtonRef = useRef(null);
  // script.src = `https://www.paypal.com/sdk/js?client-id=AVP1SYh7rx65ywvhK1DxyQToKuW0an-M-uZm5IuxTJSmooP8rltjb5Dwyv2RJSl7FGTfrgVUdl8I5Eqq`;

  useEffect(() => {
    if (!show) return;

    const loadPayPalSDK = async () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AZufVO1YzT982fFI1y2Km-OO4zV8YjYhaKBS2OfZkVFOk2Ctevwh6R9ewhbD-HlzkjTMNPYto5Rrks_K`;
      script.async = true;
      script.onload = () => {
        initializePayPalButton();
      };
      document.body.appendChild(script);
    };

    const initializePayPalButton = () => {
      window.paypal
        .Buttons({
          createOrder: async (data, actions) => {
            try {
              const response = await fetch(
                'https://full-stack-estate-main.onrender.com/api/paypal/create-order',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    walletId,
                    amount: parseFloat(amount).toFixed(2),
                  }),
                  credentials: 'include',
                }
              );
              const order = await response.json();
              if (response.status === 200) {
                return order.orderId;
              } else {
                toast.error('Failed to create PayPal order');
                return null;
              }
            } catch (error) {
              console.error('Error creating PayPal order', error);
              toast.error('Failed to create PayPal order');
              return null;
            }
          },
          onApprove: async (data, actions) => {
            try {
              const response = await fetch(
                'https://full-stack-estate-main.onrender.com/api/paypal/capture-order',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId: data.orderID,
                    walletId,
                  }),
                  credentials: 'include',
                }
              );
              const result = await response.json();
              if (response.status === 200 && result.success) {
                toast.success('Wallet credited successfully');
                onCreditSuccess();
                onClose();
              } else {
                toast.error('Failed to capture PayPal order');
              }
            } catch (error) {
              console.error('Error capturing PayPal order', error);
              toast.error('Failed to capture PayPal order');
            }
          },
        })
        .render(paypalButtonRef.current);
    };

    if (show) {
      loadPayPalSDK();
    }

    return () => {
      // Cleanup if needed
    };
  }, [show, amount, walletId, onCreditSuccess, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <ToastContainer />
        <h2>Credit Wallet</h2>
        <div>
          <p>Amount: ${amount}</p>
        </div>
        <div ref={paypalButtonRef} className={styles.paypalButton}></div>
        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PostDetailCreditWalletPopup;
