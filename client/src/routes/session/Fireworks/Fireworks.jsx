import Fireworks from '@fireworks-js/react';
import './Fireworks.scss';

const FireworksComponent = () => (
  <Fireworks
    count={3}
    interval={500}
    colors={['#cc3333', '#4CAF50', '#81C784']}
    calc={fxCalc}
    className="fireworks"
  />
);

const fxCalc = (dx, dy) => Math.sqrt(dx * dx + dy * dy) / 50;

export default FireworksComponent;
