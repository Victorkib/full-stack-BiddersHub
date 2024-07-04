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
      <StatsCounter label="Clients" initialValue={500} start={startCount} />
      <StatsCounter label="Projects" initialValue={1000} start={startCount} />
      <StatsCounter
        label="Years of Experience"
        initialValue={5}
        start={startCount}
      />
    </div>
  );
};

export default Stats;
