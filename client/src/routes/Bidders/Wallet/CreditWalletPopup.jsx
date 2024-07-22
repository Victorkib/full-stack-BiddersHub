import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CreditWalletPopup.module.scss';
import { useSelector } from 'react-redux';

const CreditWalletPopup = ({ show, onClose, walletId, onCreditSuccess }) => {
  const [amount, setAmount] = useState('');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalButtonRef = useRef(null);
  const wallet = useSelector((store) => store.bidderWallet.wallet);
  console.log(wallet);
  console.log(walletId);
  //  script.src = `https://www.paypal.com/sdk/js?client-id=AVP1SYh7rx65ywvhK1DxyQToKuW0an-M-uZm5IuxTJSmooP8rltjb5Dwyv2RJSl7FGTfrgVUdl8I5Eqq`;

  useEffect(() => {
    if (!show) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AZufVO1YzT982fFI1y2Km-OO4zV8YjYhaKBS2OfZkVFOk2Ctevwh6R9ewhbD-HlzkjTMNPYto5Rrks_K`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      setPaypalLoaded(false);
    };
  }, [show, wallet]);

  useEffect(() => {
    if (!paypalLoaded || !show || paypalButtonRef.current.hasChildNodes())
      return;

    window.paypal
      .Buttons({
        createOrder: async (data, actions) => {
          try {
            // 'http://localhost:8800/api/paypal/create-order',
            const res = await fetch(
              'https://biddershubbackend.onrender.com/api/paypal/create-order',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  walletId: wallet.id,
                  amount: parseFloat(amount).toFixed(2),
                }),
                credentials: 'include',
              }
            );
            const order = await res.json();
            if (res.status) {
              console.log('order: ', order);
              return order.orderId;
            }
            console.log('order: ', order);
            return null;
          } catch (error) {
            console.error('Error creating PayPal order', error);
            toast.error('Failed to create PayPal order');
          }
        },
        onApprove: async (data, actions) => {
          console.log('data to send to capture order: ', data);
          try {
            // 'http://localhost:8800/api/paypal/capture-order',
            const res = await fetch(
              'https://biddershubbackend.onrender.com/api/paypal/capture-order',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                  walletId: wallet.id,
                }),
                credentials: 'include',
              }
            );
            const result = await res.json();
            console.log('result of capture order: ', result);
            if (result.success) {
              setAmount('');
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
  }, [paypalLoaded, show, amount, walletId, onClose, onCreditSuccess]);

  if (!show) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <ToastContainer />
        <h2>Credit Wallet</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // The actual payment will be handled by PayPal buttons
          }}
          className={styles.formContainer}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>

          <div className={styles.actions}>
            <div
              id="paypal-button-container"
              className={styles.paypalButton}
              ref={paypalButtonRef}
            ></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditWalletPopup;
