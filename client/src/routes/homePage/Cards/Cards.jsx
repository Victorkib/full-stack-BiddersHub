import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Cards.scss';

const Cards = ({ item }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  return (
    <div to={`/menu/${item.id}`} className="card">
      <Link to={`/menu/${item.id}`}>
        <figure>
          <img
            src={item.images[0] || 'BeeCar.jpg'} // Adjust this line if there is no image property
            alt={item.title}
            className="hover:scale-105 transition-all duration-300"
          />
        </figure>
      </Link>
      <div className="card-body">
        <Link to={`/menu/${item.id}`}>
          <h2 className="card-title">{item.title}</h2>
        </Link>
        <div className="card-actions">
          <p className="timeRemainingP">price:{item.price}</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
