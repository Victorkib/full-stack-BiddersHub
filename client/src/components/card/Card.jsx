import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './card.scss';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Card({ item, handleDelete }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    togglePopup();
    try {
      await handleDelete(item.id);
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async () => {
    setIsLoading(true);
    try {
      navigate(`/edit/${item.id}`);
    } catch (error) {
      console.error('Error navigating to edit page:', error);
      toast.error('Failed to navigate to edit page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <ToastContainer />
      {isLoading && (
        <div className="loader">
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      )}
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">Base Price: ${item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/Mybg.png" alt="" />
              <span>{item.bedroom} TestNo</span>
            </div>
            <div className="feature">
              <img src="/Mybg.png" alt="" />
              <span>{item.bathroom} TestNo</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
            <div className="icon">
              <button onClick={handleEditClick}>
                <FontAwesomeIcon icon={faEdit} aria-label="Edit" />
              </button>
            </div>
            <div className="icon">
              <button onClick={togglePopup}>
                <FontAwesomeIcon icon={faTrash} aria-label="Delete" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPopupVisible && (
        <div className="popup">
          <div className="popupContent">
            <h3>Are you sure you want to delete this item?</h3>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={togglePopup}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
