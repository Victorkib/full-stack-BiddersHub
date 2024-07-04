import { useState, useEffect } from 'react';
import './stats.scss';

const StatsCounter = ({ label, initialValue, start }) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(initialValue);

  useEffect(() => {
    if (!start) return;
    const increment = target / 500;
    if (count < target) {
      const timer = setTimeout(() => {
        setCount(Math.ceil(count + increment));
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [count, target, start]);

  useEffect(() => {
    setTarget(initialValue);
    setCount(0);
  }, [initialValue]);

  return (
    <div className="stats-counter mt-1">
      <p className="count">{count}+</p>
      <p className="label">{label}</p>
    </div>
  );
};

export default StatsCounter;
