import './list.scss';
import Card from '../card/Card';
import { useState } from 'react';
import apiRequest from '../../lib/apiRequest';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function List({ posts }) {
  const [cards, setCards] = useState(posts);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await apiRequest.delete(`/posts/${id}`);
      setCards(cards.filter((card) => card.id !== id));
      notifySuccess('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      notifyError('Failed to delete post');
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="list">
      <ToastContainer />
      {isLoading && (
        <div className="loader">
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      )}
      {cards.map((item) => (
        <Card key={item.id} item={item} handleDelete={handleDelete} />
      ))}
      {error && <span>{error}</span>}
    </div>
  );
}

export default List;
