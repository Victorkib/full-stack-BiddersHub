import { toast } from 'react-toastify';

const BidNotification = ({ message }) => {
  toast.info(message);

  return null;
};

export default BidNotification;
