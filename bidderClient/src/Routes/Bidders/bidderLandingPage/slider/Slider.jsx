// SleekSliderComponent.jsx

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Slider.scss';

const SleekSliderComponent = () => {
  // Dummy data for slides (replace with actual data)
  const slides = [
    { id: 1, imageUrl: '/Mybg.png', description: 'Description for Slide 1' },
    { id: 2, imageUrl: '/Mybg.png', description: 'Description for Slide 2' },
    { id: 3, imageUrl: '/Mybg.png', description: 'Description for Slide 3' },
    { id: 4, imageUrl: '/Mybg.png', description: 'Description for Slide 4' },
    { id: 5, imageUrl: '/Mybg.png', description: 'Description for Slide 5' },
    { id: 6, imageUrl: '/Mybg.png', description: 'Description for Slide 6' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="sleek-slider">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="slide">
            <img
              src={slide.imageUrl}
              alt={slide.description}
              className="slide-image"
            />
            <div className="slide-description">{slide.description}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SleekSliderComponent;
