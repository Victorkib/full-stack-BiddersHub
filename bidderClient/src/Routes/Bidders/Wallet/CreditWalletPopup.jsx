import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CreditWalletPopup.module.scss';

const CreditWalletPopup = ({
  show,
  onClose,
  walletId,
  amount,
  onCreditSuccess,
}) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonRef = useRef(null);

  // script.src = `https://www.paypal.com/sdk/js?client-id=AVP1SYh7rx65ywvhK1DxyQToKuW0an-M-uZm5IuxTJSmooP8rltjb5Dwyv2RJSl7FGTfrgVUdl8I5Eqq`;

  //  script.src = `https://www.paypal.com/sdk/js?client-id=AZufVO1YzT982fFI1y2Km-OO4zV8YjYhaKBS2OfZkVFOk2Ctevwh6R9ewhbD-HlzkjTMNPYto5Rrks_K`;

  useEffect(() => {
    if (!show) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AVP1SYh7rx65ywvhK1DxyQToKuW0an-M-uZm5IuxTJSmooP8rltjb5Dwyv2RJSl7FGTfrgVUdl8I5Eqq`;
    script.async = true;

    script.onload = () => {
      console.log('PayPal SDK script loaded');
      setPaypalLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK script');
      toast.error('Failed to load PayPal SDK');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      setPaypalLoaded(false);
    };
  }, [show]);

  useEffect(() => {
    if (!paypalLoaded || !show || paypalButtonRef.current.hasChildNodes())
      return;

    window.paypal
      .Buttons({
        createOrder: async (data, actions) => {
          try {
            const res = await fetch(
              'https://biddershubbackend.onrender.com/api/paypal/create-order',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  walletId: walletId,
                  amount: parseFloat(amount).toFixed(2),
                }),
                credentials: 'include',
              }
            );
            const order = await res.json();
            if (res.status) {
              return order.orderId;
            }
            return null;
          } catch (error) {
            console.error('Error creating PayPal order', error);
            toast.error('Failed to create PayPal order');
          }
        },
        onApprove: async (data, actions) => {
          try {
            const res = await fetch(
              'https://biddershubbackend.onrender.com/api/paypal/capture-order',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                  walletId: walletId,
                }),
                credentials: 'include',
              }
            );
            const result = await res.json();
            if (result.success) {
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
      .render(paypalButtonRef.current)
      .catch((error) => {
        console.error('Error rendering PayPal button', error);
        toast.error('Failed to render PayPal button');
      });
  }, [paypalLoaded, show, amount, walletId, onClose, onCreditSuccess]);

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

export default CreditWalletPopup;
