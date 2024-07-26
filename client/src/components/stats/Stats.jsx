import { useState, useEffect, useRef } from 'react';
import './stats.scss';
import StatsCounter from './StatsCounter';

const Stats = () => {
  const [startCount, setStartCount] = useState(false);
  const statsRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Adjust the threshold as needed
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div ref={statsRef} className="stats">
      <StatsCounter label="Clients" initialValue={1} start={startCount} />
      <StatsCounter
        label="Products Sold"
        initialValue={10}
        start={startCount}
      />
      <StatsCounter
        label="Months of Experience"
        initialValue={2}
        start={startCount}
      />
    </div>
  );
};

export default Stats;
