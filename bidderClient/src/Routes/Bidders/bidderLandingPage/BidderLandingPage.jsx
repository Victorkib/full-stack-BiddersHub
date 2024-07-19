// BiddersLandingPage.jsx

import './BiddersLandingPage.scss'; // Import SCSS for styling
import Card from './card/Card';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import SleekSliderComponent from './slider/Slider';

const BiddersLandingPage = () => {
  return (
    <div className="bidders-landing-page">
      {/* Header Component */}
      <Header />
      {/* Main Content */}
      <main className="main-content">
        {/* Cards Sections */}
        <section className="cards-container">
          {/* Horizontal Cards */}
          <Card title="Card 1" description="Description for Card 1" />
          <Card title="Card 2" description="Description for Card 2" />
          <Card title="Card 3" description="Description for Card 3" />
          <Card title="Card 4" description="Description for Card 4" />
        </section>

        {/* Two Cards Section */}
        <section className="cards-container">
          <Card title="Card A" description="Description for Card A" />
          <Card title="Card B" description="Description for Card B" />
          <Card title="Card c" description="Description for Card c" />
        </section>

        {/* Image Section */}
        <section className="image-section">
          <img className="image" src="hammer.jpg" alt="Placeholder" />
        </section>

        {/* Sleek Slider Section */}
        <section className="slider-section">
          <SleekSliderComponent />
        </section>

        {/* Three Cards Section */}
        <section className="cards-container">
          <Card title="Card X" description="Description for Card X" />
          <Card title="Card Y" description="Description for Card Y" />
          <Card title="Card Z" description="Description for Card Z" />
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default BiddersLandingPage;
