/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { FaHeart } from 'react-icons/fa';

import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import './Categories.scss';
import Cards from '../Cards/Cards';

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} btn btn-next`}
      style={{ ...style, background: 'red' }}
      onClick={onClick}
    >
      NEXT
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} btn btn-prev`}
      style={{ ...style, background: 'green' }}
      onClick={onClick}
    >
      BACK
    </div>
  );
};

const Categories = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const slider = React.useRef(null);

  useEffect(() => {
    const fetchDataToUse = async () => {
      try {
        const res = await fetch('http://localhost:8800/api/posts/getAllPosts');
        //const specials = data.filter((item) => item.category === 'popular');
        const data = await res.json();
        console.log('sessions fetched: ' + data);
        //.then((res) => res.json())
        // .then((data) => {
        //   setRecipes(data);
        // });
        if (res.ok) {
          setError('');
          setRecipes(data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchDataToUse();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 970,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      {recipes?.length > 0 ? (
        <div className="container">
          <div className="text-left">
            <p className="subtitle">Favorites Auction Items</p>
            <h2 className="title">Popular Auctions</h2>
          </div>
          <div className="buttons">
            <button
              onClick={() => slider?.current?.slickPrev()}
              className="btn"
            >
              <FaAngleLeft className="icon" />
            </button>
            <button
              onClick={() => slider?.current?.slickNext()}
              className="btn btn-next"
            >
              <FaAngleRight className="icon" />
            </button>
          </div>
          <Slider ref={slider} {...settings} className="slider">
            {recipes
              ? recipes.map((item, i) => <Cards item={item} key={i} />)
              : error && <span>Error:{error}</span>}
          </Slider>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Categories;
